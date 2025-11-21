<?php
/**
 * Admin Authentication API
 * 
 * POST /api/auth.php?action=login    - Login admin user
 * POST /api/auth.php?action=logout   - Logout admin user
 * GET  /api/auth.php?action=verify   - Verify session
 */

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

session_start();

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'login':
            if ($method !== 'POST') {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
                exit;
            }
            handleLogin($pdo);
            break;
            
        case 'logout':
            handleLogout();
            break;
            
        case 'verify':
            handleVerify();
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

/**
 * Handle login
 */
function handleLogin($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['username']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password required']);
        return;
    }
    
    // Fetch user from database
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ? AND is_active = 1");
    $stmt->execute([$data['username']]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        return;
    }
    
    // Update last login
    $stmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    // Create session
    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['admin_username'] = $user['username'];
    $_SESSION['admin_email'] = $user['email'];
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
}

/**
 * Handle logout
 */
function handleLogout() {
    session_destroy();
    echo json_encode(['success' => true]);
}

/**
 * Verify session
 */
function handleVerify() {
    if (isset($_SESSION['admin_id'])) {
        echo json_encode([
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['admin_id'],
                'username' => $_SESSION['admin_username'],
                'email' => $_SESSION['admin_email']
            ]
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
}

/**
 * Check if user is authenticated (helper function)
 */
function requireAuth() {
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}
