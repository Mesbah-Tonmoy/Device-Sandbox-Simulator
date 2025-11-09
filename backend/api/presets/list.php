<?php
/**
 * List All Presets Endpoint
 * GET /api/presets/list.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Response.php';
require_once __DIR__ . '/../../models/Preset.php';

// Validate method
Response::validateMethod(['GET']);

try {
    // Create preset instance
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
    
    Response::success(
        $presets,
        count($presets) > 0 
            ? 'Presets retrieved successfully' 
            : 'No presets found'
    );
    
} catch (Exception $e) {
    $GLOBALS['last_error'] = $e->getMessage();
    Response::serverError('An unexpected error occurred');
}