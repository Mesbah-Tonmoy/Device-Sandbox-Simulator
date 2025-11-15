<?php
/**
 * Delete Device Endpoint (Clear Canvas)
 * DELETE /api/devices/delete.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Device;

// Validate method
Response::validateMethod(['DELETE']);

try {
    // Create device instance
    $device = new Device();
    
    // Delete current device
    $result = $device->delete();
    
    if ($result['success']) {
        Response::success(
            null,
            $result['message']
        );
    } else {
        Response::error($result['error'] ?? 'Failed to delete device');
    }
    
} catch (Exception $e) {
    $GLOBALS['last_error'] = $e->getMessage();
    Response::serverError('An unexpected error occurred');
}