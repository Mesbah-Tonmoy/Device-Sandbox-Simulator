<?php
/**
 * Save/Update Device Endpoint
 * POST /api/devices/save.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Response.php';
require_once __DIR__ . '/../../models/Device.php';

// Validate method
Response::validateMethod(['POST']);

try {
    // Get JSON input
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
    
    // Save device
    $result = $device->save();
    
    if ($result['success']) {
        Response::success(
            $result['data'],
            'Device saved successfully',
            201
        );
    } else {
        if (isset($result['errors'])) {
            Response::validationError($result['errors']);
        } else {
            Response::error($result['error'] ?? 'Failed to save device');
        }
    }
    
} catch (Exception $e) {
    $GLOBALS['last_error'] = $e->getMessage();
    Response::serverError('An unexpected error occurred');
}