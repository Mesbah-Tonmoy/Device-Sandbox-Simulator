<?php
/**
 * Delete Preset Endpoint
 * DELETE /api/presets/delete.php?id=1
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
    }
    
    $preset = new Preset();
    
    BaseController::handleResult(
        $preset->delete($id),
        'Preset deleted successfully',
        201
    );
}, ['DELETE']);