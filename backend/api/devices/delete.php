<?php
/**
 * Delete Device Endpoint (Clear Canvas)
 * DELETE /api/devices/delete.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Controllers\BaseController;
use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Device;

BaseController::execute(function() {
    $device = new Device();
    
    BaseController::handleResult(
        $device->delete(),
        'Device deleted successfully',
        200,
        true
    );
}, ['DELETE']);