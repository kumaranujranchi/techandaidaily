<?php
/**
 * API Index - Health check and info
 */

require_once __DIR__ . '/config/cors.php';

echo json_encode([
    'name' => 'Tech & AI Daily API',
    'version' => '1.0.0',
    'status' => 'active',
    'endpoints' => [
        'GET /api/articles.php' => 'Get all articles',
        'GET /api/articles.php?id={id}' => 'Get single article',
        'POST /api/articles.php' => 'Create article',
        'PUT /api/articles.php' => 'Update article',
        'DELETE /api/articles.php?id={id}' => 'Delete article',
        'GET /api/authors.php' => 'Get all authors'
    ]
]);
