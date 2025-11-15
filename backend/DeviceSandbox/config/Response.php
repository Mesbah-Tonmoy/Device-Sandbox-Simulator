<?php

namespace DeviceSandbox\Config;

class Response
{
    /**
     * Send success response
     */
    public static function success($data = null, string $message = 'Success', int $statusCode = 200): void
    {
        http_response_code($statusCode);
        
        $response = [
            'success' => true,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    /**
     * Send error response
     */
    public static function error(string $message = 'An error occurred', int $statusCode = 400, $errors = null): void
    {
        http_response_code($statusCode);
        
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        // Add debug info in development
        if (($_ENV['APP_DEBUG'] ?? 'false') === 'true' && isset($GLOBALS['last_error'])) {
            $response['debug'] = $GLOBALS['last_error'];
        }
        
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    /**
     * Send validation error response
     */
    public static function validationError($errors, string $message = 'Validation failed'): void
    {
        self::error($message, 422, $errors);
    }
    
    /**
     * Send not found response
     */
    public static function notFound(string $message = 'Resource not found'): void
    {
        self::error($message, 404);
    }
    
    /**
     * Send unauthorized response
     */
    public static function unauthorized(string $message = 'Unauthorized access'): void
    {
        self::error($message, 401);
    }
    
    /**
     * Send server error response
     */
    public static function serverError(string $message = 'Internal server error'): void
    {
        self::error($message, 500);
    }
    
    /**
     * Validate request method
     */
    public static function validateMethod(array $allowedMethods): void
    {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        
        if (!in_array($requestMethod, $allowedMethods)) {
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
        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            self::error('Invalid JSON format', 400);
        }
        
        return $data ?? [];
    }
    
    /**
     * Sanitize input data
     */
    public static function sanitize($data)
    {
        if (is_array($data)) {
            return array_map([self::class, 'sanitize'], $data);
        }
        
        if (is_string($data)) {
            return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
        }
        
        return $data;
    }
}