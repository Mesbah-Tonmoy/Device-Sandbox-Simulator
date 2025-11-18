<?php
/**
 * Save/Update Device Endpoint
 * POST /api/devices/save.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Controllers\BaseController;
use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Device;

BaseController::execute(function() {
    $input = Response::getJsonInput();
    
    // Sanitize input
    $type = Response::sanitize($input['type'] ?? '');
    $settings = $input['settings'] ?? null;
    
    // Create device instance
    $device = new Device();
    $device->type = $type;
    $device->settings = json_encode($settings);
    
    BaseController::handleResult(
        $device->save(),
        'Device saved successfully',
        201
    );
}, ['POST']);