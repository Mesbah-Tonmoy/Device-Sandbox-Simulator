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
$corsOriginEnv = getenv('CORS_ORIGIN') ?: '';
// Remove quotes if present
$corsOriginEnv = trim($corsOriginEnv, '"\' ');
$allowedOrigins = $isDev 
    ? ['*']  // Allow all in dev
    : array_filter(array_map('trim', explode(',', $corsOriginEnv)));

// Set CORS headers
if ($origin) {  // Only process if origin header exists
    if ($allowedOrigins === ['*'] || in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: {$origin}");
    } else {
        // Origin not in allowed list
        http_response_code(403);
        echo json_encode(['error' => 'CORS origin not allowed']);
        exit;
    }
}
// If no origin header, it's a same-origin or non-browser request (allowed)

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