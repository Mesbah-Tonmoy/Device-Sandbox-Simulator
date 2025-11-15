<?php
/**
 * Device Model
 * Handles all database operations for devices
 */

namespace DeviceSandbox\Models;

use DeviceSandbox\Config\Database;

class Device {
    private $conn;
    private $table = 'devices';
    
    // Device properties
    public $id;
    public $type;
    public $settings;
    public $position_x;
    public $position_y;
    public $created_at;
    public $updated_at;
    
    // Valid device types
    private $validTypes = ['light', 'fan'];
    
    public function __construct() {
        $database = Database::getInstance();
        $this->conn = $database->getConnection();
    }
    
    /**
     * Get current device on canvas
     * Returns the most recently updated device (only one should exist)
     */
    public function getCurrent() {
        $query = "SELECT * FROM {$this->table} 
                  ORDER BY updated_at DESC 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    /**
     * Save or update device
     * Since only one device can exist, we delete old ones and insert new
     */
    public function save() {
        // Validate before saving
        $validation = $this->validate();
        if (!$validation['valid']) {
            return ['success' => false, 'errors' => $validation['errors']];
        }
        
        try {
            $this->conn->beginTransaction();
            
            // Delete all existing devices (only one allowed on canvas)
            $deleteQuery = "DELETE FROM {$this->table}";
            $this->conn->exec($deleteQuery);
            
            // Insert new device
            $insertQuery = "INSERT INTO {$this->table} 
                           (type, settings, position_x, position_y) 
                           VALUES (:type, :settings, :position_x, :position_y)";
            
            $stmt = $this->conn->prepare($insertQuery);
            
            // Bind parameters
            $stmt->bindParam(':type', $this->type);
            $stmt->bindParam(':settings', $this->settings);
            $stmt->bindParam(':position_x', $this->position_x);
            $stmt->bindParam(':position_y', $this->position_y);
            
            $stmt->execute();
            $this->id = $this->conn->lastInsertId();
            
            $this->conn->commit();
            
            return [
                'success' => true,
                'data' => [
                    'id' => $this->id,
                    'type' => $this->type,
                    'settings' => json_decode($this->settings, true),
                    'position_x' => $this->position_x,
                    'position_y' => $this->position_y
                ]
            ];
            
        } catch (PDOException $e) {
            $this->conn->rollBack();
            $GLOBALS['last_error'] = $e->getMessage();
            return ['success' => false, 'error' => 'Database error occurred'];
        }
    }
    
    /**
     * Delete current device (clear canvas)
     */
    public function delete() {
        try {
            $query = "DELETE FROM {$this->table}";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Device removed from canvas'
            ];
            
        } catch (PDOException $e) {
            $GLOBALS['last_error'] = $e->getMessage();
            return ['success' => false, 'error' => 'Failed to delete device'];
        }
    }
    
    /**
     * Validate device data
     */
    private function validate() {
        $errors = [];
        
        // Validate type
        if (empty($this->type)) {
            $errors['type'] = 'Device type is required';
        } elseif (!in_array($this->type, $this->validTypes)) {
            $errors['type'] = 'Invalid device type. Must be light or fan';
        }
        
        // Validate settings JSON
        if (empty($this->settings)) {
            $errors['settings'] = 'Device settings are required';
        } else {
            $settingsData = json_decode($this->settings, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $errors['settings'] = 'Invalid settings JSON format';
            } else {
                // Validate settings structure based on type
                $settingsValidation = $this->validateSettings($settingsData);
                if (!$settingsValidation['valid']) {
                    $errors['settings'] = $settingsValidation['errors'];
                }
            }
        }
        
        // Validate position
        if (!is_numeric($this->position_x) || $this->position_x < 0 || $this->position_x > 10000) {
            $errors['position_x'] = 'Invalid X position (must be 0-10000)';
        }
        
        if (!is_numeric($this->position_y) || $this->position_y < 0 || $this->position_y > 10000) {
            $errors['position_y'] = 'Invalid Y position (must be 0-10000)';
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Validate settings structure based on device type
     */
    private function validateSettings($settings) {
        $errors = [];
        
        if ($this->type === 'light') {
            // Validate light settings
            if (!isset($settings['power']) || !is_bool($settings['power'])) {
                $errors['power'] = 'Light power must be boolean';
            }
            
            if (!isset($settings['brightness']) || 
                !is_numeric($settings['brightness']) || 
                $settings['brightness'] < 0 || 
                $settings['brightness'] > 100) {
                $errors['brightness'] = 'Light brightness must be 0-100';
            }
            
            $validColors = ['warm', 'neutral', 'cool', 'pink'];
            if (!isset($settings['colorTemp']) || !in_array($settings['colorTemp'], $validColors)) {
                $errors['colorTemp'] = 'Invalid color temperature';
            }
            
        } elseif ($this->type === 'fan') {
            // Validate fan settings
            if (!isset($settings['power']) || !is_bool($settings['power'])) {
                $errors['power'] = 'Fan power must be boolean';
            }
            
            if (!isset($settings['speed']) || 
                !is_numeric($settings['speed']) || 
                $settings['speed'] < 0 || 
                $settings['speed'] > 100) {
                $errors['speed'] = 'Fan speed must be 0-100';
            }
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}