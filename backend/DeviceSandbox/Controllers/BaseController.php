<?php
/**
 * Base API Controller
 * Handles common API functionality and reduces boilerplate
 */

namespace DeviceSandbox\Controllers;

use DeviceSandbox\Config\Response;
use Exception;

abstract class BaseController
{
    /**
     * Execute API endpoint with standard error handling
     * 
     * @param callable $callback The endpoint logic
     * @param array $allowedMethods HTTP methods allowed
     */
    public static function execute(callable $callback, array $allowedMethods): void
    {
        Response::validateMethod($allowedMethods);
        
        try {
            $callback();
        } catch (Exception $e) {
            $GLOBALS['last_error'] = $e->getMessage();
            error_log('API Error: ' . $e->getMessage());
            Response::serverError('An unexpected error occurred');
        }
    }
    
    /**
     * Handle model result and send appropriate response
     * 
     * @param array $result Result from model operation
     * @param string $successMessage Success message (fallback if no 'message' in $result)
     * @param int $statusCode HTTP status code for success
     * @param bool $useResultMessage Whether to prefer 'message' from $result on success
     */
    public static function handleResult(
        array $result, 
        string $successMessage = 'Operation successful', 
        int $statusCode = 200,
        bool $useResultMessage = false
    ): void {
        // Ensure the result has a success key
        if (!array_key_exists('success', $result)) {
            $result['success'] = false;
        }
        
        if ($result['success']) {
            $msg = $useResultMessage ? ($result['message'] ?? $successMessage) : $successMessage;
            Response::success(
                $result['data'] ?? null,
                $msg,
                $statusCode
            );
        } else {
            if (isset($result['errors'])) {
                Response::validationError($result['errors']);
            } else {
                Response::error($result['error'] ?? 'Operation failed', 400);
            }
        }
    }
}