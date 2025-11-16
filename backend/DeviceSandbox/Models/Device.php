<?php
/**
 * Device Model
 * Handles all database operations for devices
 * PHP 8.4 Compatible with modern features
 */

namespace DeviceSandbox\Models;

use DeviceSandbox\Traits\ValidatesDeviceSettings;
use PDO;

class Device extends BaseModel
{
    use ValidatesDeviceSettings;
    
    // Using PHP 8.1+ property types
    public ?int $id = null;
    public string $type = '';
    public string $settings = '';
    public int $position_x = 0;
    public int $position_y = 0;
    public ?string $created_at = null;
    public ?string $updated_at = null;
    
    protected string $table = 'devices';
    
    /**
     * Get current device on canvas
     * Returns the most recently updated device (only one should exist)
     */
    public function getCurrent(): array|false
    {
        $query = "SELECT * FROM {$this->table} 
                  ORDER BY updated_at DESC 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $device = $stmt->fetch();
        
        if ($device) {
            $device['settings'] = json_decode($device['settings'], true);
        }
        
        return $device;
    }
    
    /**
     * Save or update device
     * Since only one device can exist, we delete old ones and insert new
     */
    public function save(): array
    {
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
            $stmt->bindParam(':position_x', $this->position_x, PDO::PARAM_INT);
            $stmt->bindParam(':position_y', $this->position_y, PDO::PARAM_INT);
            
            $stmt->execute();
            $this->id = (int) $this->conn->lastInsertId();
            
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
            
        } catch (\PDOException $e) {
            $this->conn->rollBack();
            $GLOBALS['last_error'] = $e->getMessage();
            return ['success' => false, 'error' => 'Database error occurred'];
        }
    }
    
    /**
     * Delete current device (clear canvas)
     */
    public function delete(int $id = 0): array
    {
        try {
            $query = "DELETE FROM {$this->table}";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Device removed from canvas'
            ];
            
        } catch (\PDOException $e) {
            $GLOBALS['last_error'] = $e->getMessage();
            return ['success' => false, 'error' => 'Failed to delete device'];
        }
    }
    
    /**
     * Validate device data
     * Uses ValidatesDeviceSettings trait for shared validation logic
     */
    public function validate(): array
    {
        $errors = [];
        
        // Validate device type (from trait)
        $typeError = $this->validateDeviceType($this->type);
        if ($typeError) {
            $errors['type'] = $typeError;
        }
        
        // Validate settings JSON
        if (empty($this->settings)) {
            $errors['settings'] = 'Device settings are required';
        } else {
            $settingsData = json_decode($this->settings, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $errors['settings'] = 'Invalid settings JSON format';
            } else {
                // Validate settings structure (from trait)
                $settingsValidation = $this->validateSettings($this->type, $settingsData);
                if (!$settingsValidation['valid']) {
                    $errors = array_merge($errors, $settingsValidation['errors']);
                }
            }
        }
        
        // Validate position (from trait)
        $positionErrors = $this->validatePosition($this->position_x, $this->position_y);
        $errors = array_merge($errors, $positionErrors);
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}