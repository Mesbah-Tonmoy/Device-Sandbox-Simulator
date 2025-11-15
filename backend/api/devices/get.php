<?php
/**
 * Get Current Device Endpoint
 * GET /api/devices/get.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Device;

// Validate method (OPTIONS already handled in cors.php)
Response::validateMethod(['GET']);

try {
    // Create device instance
    $device = new Device();
    
    // Get current device
    $currentDevice = $device->getCurrent();
    
    if ($currentDevice) {
        // Parse settings JSON
        $currentDevice['settings'] = json_decode($currentDevice['settings'], true);
        
        Response::success(
            $currentDevice,
            'Device retrieved successfully'
        );
    } else {
        // No device on canvas
        Response::success(
            null,
            'No device on canvas'
        );
    }
    
} catch (Exception $e) {
    $GLOBALS['last_error'] = $e->getMessage();
    Response::serverError('An unexpected error occurred');
}