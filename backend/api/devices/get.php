<?php
/**
 * Get Current Device Endpoint
 * GET /api/devices/get.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Controllers\BaseController;
use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Device;

BaseController::execute(function() {
    $device = new Device();
    
    $currentDevice = $device->getCurrent();
    
    if ($currentDevice) {
        // Conditionally decode only if it's a string (robust handling)
        if (is_string($currentDevice['settings'])) {
            $currentDevice['settings'] = json_decode($currentDevice['settings'], true);
        }
        
        Response::success(
            $currentDevice,
            'Device retrieved successfully'
        );
    } else {
        Response::success(
            null,
            'No device on canvas'
        );
    }
}, ['GET']);