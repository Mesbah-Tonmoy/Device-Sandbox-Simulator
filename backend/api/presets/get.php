<?php
/**
 * Get Single Preset Endpoint
 * GET /api/presets/get.php?id=1
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Controllers\BaseController;
use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Preset;

BaseController::execute(function() {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($id <= 0) {
        Response::error('Invalid preset ID', 400);
        return;
    }
    
    $preset = new Preset();
    $presetData = $preset->getById($id);
    
    if ($presetData) {
        if (is_string($presetData['device_settings'])) {
            $presetData['device_settings'] = json_decode($presetData['device_settings'], true);
        }
        
        Response::success(
            $presetData,
            'Preset retrieved successfully'
        );
    } else {
        Response::error('Preset not found', 404);
    }
}, ['GET']);