<?php
/**
 * Save Preset Endpoint
 * POST /api/presets/save.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Preset;

// Validate method
Response::validateMethod(['POST']);

try {
    // Get JSON input
    $input = Response::getJsonInput();
    
    // Sanitize input
    $name = Response::sanitize($input['name'] ?? '');
    $device_type = Response::sanitize($input['device_type'] ?? '');
    $device_settings = $input['device_settings'] ?? null;
    $position_x = (int)($input['position_x'] ?? 0);
    $position_y = (int)($input['position_y'] ?? 0);
    
    // Create preset instance
    $preset = new Preset();
    $preset->name = $name;
    $preset->device_type = $device_type;
    $preset->device_settings = json_encode($device_settings);
    $preset->position_x = $position_x;
    $preset->position_y = $position_y;
    
    // Save preset
    $result = $preset->create();
    
    if ($result['success']) {
        Response::success(
            $result['data'],
            'Preset saved successfully',
            201
        );
    } else {
        if (isset($result['errors'])) {
            Response::validationError($result['errors']);
        } else {
            Response::error($result['error'] ?? 'Failed to save preset');
        }
    }
    
} catch (Exception $e) {
    $GLOBALS['last_error'] = $e->getMessage();
    Response::serverError('An unexpected error occurred');
}