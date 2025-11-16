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
    $position_x = (int)($input['position_x'] ?? 0);
    $position_y = (int)($input['position_y'] ?? 0);
    
    // Create device instance
    $device = new Device();
    $device->type = $type;
    $device->settings = json_encode($settings);
    $device->position_x = $position_x;
    $device->position_y = $position_y;
    
    BaseController::handleResult(
        $device->save(),
        'Device saved successfully',
        201
    );
}, ['POST']);