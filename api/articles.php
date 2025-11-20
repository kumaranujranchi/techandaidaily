<?php
/**
 * Articles API Endpoints
 * 
 * GET    /api/articles.php          - Get all articles (with optional filters)
 * GET    /api/articles.php?id=123   - Get single article by ID
 * POST   /api/articles.php          - Create new article
 * PUT    /api/articles.php          - Update existing article
 * DELETE /api/articles.php?id=123   - Delete article
 */

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($pdo);
            break;
        case 'POST':
            handlePost($pdo);
            break;
        case 'PUT':
            handlePut($pdo);
            break;
        case 'DELETE':
            handleDelete($pdo);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

/**
 * GET - Fetch articles
 */
function handleGet($pdo) {
    // Single article by ID
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("
            SELECT 
                a.*,
                au.name as author_name,
                au.avatar_url as author_avatar_url,
                au.role as author_role,
                GROUP_CONCAT(t.name) as tags
            FROM articles a
            LEFT JOIN authors au ON a.author_id = au.id
            LEFT JOIN article_tags at ON a.id = at.article_id
            LEFT JOIN tags t ON at.tag_id = t.id
            WHERE a.id = ?
            GROUP BY a.id
        ");
        $stmt->execute([$_GET['id']]);
        $article = $stmt->fetch();
        
        if (!$article) {
            http_response_code(404);
            echo json_encode(['error' => 'Article not found']);
            return;
        }
        
        echo json_encode(formatArticle($article));
        return;
    }
    
    // All articles with optional filters
    $query = "
        SELECT 
            a.*,
            au.name as author_name,
            au.avatar_url as author_avatar_url,
            au.role as author_role,
            GROUP_CONCAT(t.name) as tags
        FROM articles a
        LEFT JOIN authors au ON a.author_id = au.id
        LEFT JOIN article_tags at ON a.id = at.article_id
        LEFT JOIN tags t ON at.tag_id = t.id
    ";
    
    $conditions = [];
    $params = [];
    
    // Filter by category
    if (isset($_GET['category']) && $_GET['category'] !== 'All') {
        $conditions[] = "a.category = ?";
        $params[] = $_GET['category'];
    }
    
    // Search query
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $conditions[] = "(a.title LIKE ? OR a.summary LIKE ?)";
        $searchTerm = '%' . $_GET['search'] . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(' AND ', $conditions);
    }
    
    $query .= " GROUP BY a.id ORDER BY a.published_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $articles = $stmt->fetchAll();
    
    $formatted = array_map('formatArticle', $articles);
    echo json_encode($formatted);
}

/**
 * POST - Create new article
 */
function handlePost($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        return;
    }
    
    // Validate required fields
    $required = ['title', 'summary', 'content', 'category', 'author_id'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            return;
        }
    }
    
    $pdo->beginTransaction();
    
    try {
        // Generate ID
        $id = $data['id'] ?? uniqid('article_', true);
        
        // Insert article
        $stmt = $pdo->prepare("
            INSERT INTO articles (
                id, title, summary, content, category, author_id, 
                published_at, image_url, read_time_minutes, is_top_story, ai_summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $id,
            $data['title'],
            $data['summary'],
            $data['content'],
            $data['category'],
            $data['author_id'],
            $data['publishedAt'] ?? date('Y-m-d H:i:s'),
            $data['imageUrl'] ?? null,
            $data['readTimeMinutes'] ?? ceil(strlen($data['content']) / 1000),
            $data['isTopStory'] ?? false,
            $data['aiSummary'] ?? null
        ]);
        
        // Handle tags
        if (!empty($data['tags']) && is_array($data['tags'])) {
            insertTags($pdo, $id, $data['tags']);
        }
        
        $pdo->commit();
        
        // Fetch and return the created article
        $_GET['id'] = $id;
        handleGet($pdo);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

/**
 * PUT - Update existing article
 */
function handlePut($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing article ID']);
        return;
    }
    
    $pdo->beginTransaction();
    
    try {
        // Build dynamic UPDATE query
        $fields = [];
        $params = [];
        
        $allowedFields = [
            'title', 'summary', 'content', 'category', 'author_id',
            'published_at' => 'publishedAt',
            'image_url' => 'imageUrl',
            'read_time_minutes' => 'readTimeMinutes',
            'is_top_story' => 'isTopStory',
            'ai_summary' => 'aiSummary'
        ];
        
        foreach ($allowedFields as $dbField => $jsonField) {
            if (is_int($dbField)) {
                $dbField = $jsonField;
            }
            
            if (array_key_exists($jsonField, $data)) {
                $fields[] = "$dbField = ?";
                $params[] = $data[$jsonField];
            }
        }
        
        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }
        
        $params[] = $data['id'];
        
        $query = "UPDATE articles SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        
        // Update tags if provided
        if (isset($data['tags']) && is_array($data['tags'])) {
            // Remove existing tags
            $pdo->prepare("DELETE FROM article_tags WHERE article_id = ?")->execute([$data['id']]);
            // Insert new tags
            insertTags($pdo, $data['id'], $data['tags']);
        }
        
        $pdo->commit();
        
        // Fetch and return updated article
        $_GET['id'] = $data['id'];
        handleGet($pdo);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

/**
 * DELETE - Remove article
 */
function handleDelete($pdo) {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing article ID']);
        return;
    }
    
    $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Article not found']);
        return;
    }
    
    echo json_encode(['success' => true, 'message' => 'Article deleted']);
}

/**
 * Helper: Insert tags for an article
 */
function insertTags($pdo, $articleId, $tags) {
    foreach ($tags as $tagName) {
        $tagName = trim($tagName);
        if (empty($tagName)) continue;
        
        // Insert tag if doesn't exist
        $stmt = $pdo->prepare("INSERT IGNORE INTO tags (name) VALUES (?)");
        $stmt->execute([$tagName]);
        
        // Get tag ID
        $stmt = $pdo->prepare("SELECT id FROM tags WHERE name = ?");
        $stmt->execute([$tagName]);
        $tagId = $stmt->fetchColumn();
        
        // Link to article
        $stmt = $pdo->prepare("INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)");
        $stmt->execute([$articleId, $tagId]);
    }
}

/**
 * Helper: Format article for JSON response
 */
function formatArticle($row) {
    return [
        'id' => $row['id'],
        'title' => $row['title'],
        'summary' => $row['summary'],
        'content' => $row['content'],
        'category' => $row['category'],
        'author' => [
            'id' => $row['author_id'],
            'name' => $row['author_name'],
            'avatarUrl' => $row['author_avatar_url'],
            'role' => $row['author_role']
        ],
        'publishedAt' => $row['published_at'],
        'imageUrl' => $row['image_url'],
        'tags' => $row['tags'] ? explode(',', $row['tags']) : [],
        'readTimeMinutes' => (int)$row['read_time_minutes'],
        'isTopStory' => (bool)$row['is_top_story'],
        'aiSummary' => $row['ai_summary']
    ];
}
