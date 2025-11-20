<?php
/**
 * Authors API Endpoints
 * 
 * GET /api/authors.php - Get all authors
 */

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

$pdo = getDBConnection();

try {
    $stmt = $pdo->query("SELECT * FROM authors ORDER BY name");
    $authors = $stmt->fetchAll();
    
    $formatted = [];
    foreach ($authors as $author) {
        $formatted[] = [
            'id' => $author['id'],
            'name' => $author['name'],
            'avatarUrl' => $author['avatar_url'],
            'role' => $author['role']
        ];
    }
    
    echo json_encode($formatted);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
