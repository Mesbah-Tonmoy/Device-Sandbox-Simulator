<?php
/**
 * List All Presets Endpoint
 * GET /api/presets/list.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Autoloader.php';

use DeviceSandbox\Controllers\BaseController;
use DeviceSandbox\Config\Response;
use DeviceSandbox\Models\Preset;

BaseController::execute(function() {
    $preset = new Preset();
    
    // Check for query parameters
    $type = isset($_GET['type']) ? Response::sanitize($_GET['type']) : null;
    $search = isset($_GET['search']) ? Response::sanitize($_GET['search']) : null;
    
    // Get presets based on filters
    if ($search) {
        $presets = $preset->searchByName($search);
    } elseif ($type) {
        $presets = $preset->getByType($type);
    } else {
        $presets = $preset->getAll();
    }
    
    // Decode settings for each preset (if needed)
    foreach ($presets as &$preset) {  // Use reference (&) to modify in place
        if (is_string($preset['device_settings'])) {
            $preset['device_settings'] = json_decode($preset['device_settings'], true);
        }
    }
    
    Response::success(
        $presets,
        count($presets) > 0 
            ? 'Presets retrieved successfully' 
            : 'No presets found'
    );
}, ['GET']);