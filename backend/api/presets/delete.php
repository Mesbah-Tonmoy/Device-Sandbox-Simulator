<?php
/**
 * Delete Preset Endpoint
 * DELETE /api/presets/delete.php?id=1
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Preset;

// Validate method
Response::validateMethod(['DELETE']);

try {
    // Get preset ID from query parameter
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($id <= 0) {
        Response::error('Invalid preset ID', 400);
    }
    
    // Create preset instance
    $preset = new Preset();
    
    // Delete preset
    $result = $preset->delete($id);
    
    if ($result['success']) {
        Response::success(
            null,
            $result['message']
        );
    } else {
        Response::error($result['error'] ?? 'Failed to delete preset');
    }
    
} catch (Exception $e) {
    $GLOBALS['last_error'] = $e->getMessage();
    Response::serverError('An unexpected error occurred');
}