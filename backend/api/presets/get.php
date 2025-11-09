<?php
/**
 * Get Single Preset Endpoint
 * GET /api/presets/get.php?id=1
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Response.php';
require_once __DIR__ . '/../../models/Preset.php';

// Validate method
Response::validateMethod(['GET']);

try {
    // Get preset ID from query parameter
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($id <= 0) {
        Response::error('Invalid preset ID', 400);
    }
    
    // Create preset instance
    $preset = new Preset();
    
    // Get preset by ID
    $presetData = $preset->getById($id);
    
    if ($presetData) {
        Response::success(
            $presetData,
            'Preset retrieved successfully'
        );
    } else {
        Response::notFound('Preset not found');
    }
    
} catch (Exception $e) {
    $GLOBALS['last_error'] = $e->getMessage();
    Response::serverError('An unexpected error occurred');
}