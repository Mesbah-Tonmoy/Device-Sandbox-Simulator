<?php

namespace DeviceSandbox\Config;

class Response
{
    /**
     * Send success response
     */
    public static function success(mixed $data = null, string $message = 'Success', int $statusCode = 200): never
    {
        http_response_code($statusCode);
        
        $response = [
            'success' => true,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }
    
    /**
     * Send error response
     */
    public static function error(string $message = 'An error occurred', int $statusCode = 400, mixed $errors = null, ?string $debug = null): never
    {
        http_response_code($statusCode);
        
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        // Add debug info in development (use param or global)
        $isDebug = getenv('APP_DEBUG') === 'true';
        if ($isDebug && ($debug ?? $GLOBALS['last_error'] ?? null)) {
            $response['debug'] = $debug ?? $GLOBALS['last_error'];
        }
        
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }
    
    /**
     * Send validation error response
     */
    public static function validationError(mixed $errors, string $message = 'Validation failed'): never
    {
        self::error($message, 422, $errors);
    }
    
    /**
     * Send server error response
     */
    public static function serverError(string $message = 'Internal server error', ?string $debug = null): never
    {
        self::error($message, 500, null, $debug);
    }
    
    /**
     * Validate request method
     */
    public static function validateMethod(array $allowedMethods): void
    {
        $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        
        if (!in_array($requestMethod, $allowedMethods, true)) {
            self::error(
                "Method {$requestMethod} not allowed. Allowed methods: " . implode(', ', $allowedMethods),
                405
            );
        }
    }
    
    /**
     * Get JSON input from request body
     */
    public static function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true, 512, JSON_THROW_ON_ERROR);
        
        return $data ?? [];
    }
    
    /**
     * Sanitize input data (HTML escaping for strings, recursive for arrays)
     */
    public static function sanitize(mixed $data): mixed
    {
        if (is_array($data)) {
            return array_map(self::sanitize(...), $data);
        }
        
        if (is_string($data)) {
            return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
        }
        
        return $data;
    }
}