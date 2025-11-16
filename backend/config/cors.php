<?php
/**
 * CORS Configuration Helper
 * This must be included FIRST in all API endpoints before any other code
 */

require_once __DIR__ . '/env.php';

// Get origin from request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Determine if in development mode
$isDev = getenv('APP_ENV') === 'development';

// Allowed origins
$allowedOrigins = $isDev ? [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
] : [];  // In prod, set to specific domains, e.g., ['https://yourdomain.com']

// Set CORS headers
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    http_response_code(403);
    echo json_encode(['error' => 'CORS origin not allowed']);
    exit;
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");
header("Vary: Origin");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}