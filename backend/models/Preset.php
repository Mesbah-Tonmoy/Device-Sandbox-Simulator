<?php
/**
 * Preset Model
 * Handles all database operations for presets
 */

require_once __DIR__ . '/../config/Database.php';

class Preset {
    private $conn;
    private $table = 'presets';
    
    // Preset properties
    public $id;
    public $name;
    public $device_type;
    public $device_settings;
    public $position_x;
    public $position_y;
    public $created_at;
    
    // Valid device types
    private $validTypes = ['light', 'fan'];
    
    public function __construct() {
        $database = Database::getInstance();
        $this->conn = $database->getConnection();
    }
    
    /**
     * Get all presets ordered by creation date (newest first)
     */
    public function getAll() {
        $query = "SELECT id, name, device_type, device_settings, 
                         position_x, position_y, created_at 
                  FROM {$this->table} 
                  ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $presets = $stmt->fetchAll();
        
        // Parse JSON settings for each preset
        foreach ($presets as &$preset) {
            $preset['device_settings'] = json_decode($preset['device_settings'], true);
        }
        
        return $presets;
    }
    
    /**
     * Get a single preset by ID
     */
    public function getById($id) {
        $query = "SELECT id, name, device_type, device_settings, 
                         position_x, position_y, created_at 
                  FROM {$this->table} 
                  WHERE id = :id 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        $preset = $stmt->fetch();
        
        if ($preset) {
            $preset['device_settings'] = json_decode($preset['device_settings'], true);
        }
        
        return $preset;
    }
    
    /**
     * Create a new preset
     */
    public function create() {
        // Validate before creating
        $validation = $this->validate();
        if (!$validation['valid']) {
            return ['success' => false, 'errors' => $validation['errors']];
        }
        
        try {
            $query = "INSERT INTO {$this->table} 
                     (name, device_type, device_settings, position_x, position_y) 
                     VALUES (:name, :device_type, :device_settings, :position_x, :position_y)";
            
            $stmt = $this->conn->prepare($query);
            
            // Bind parameters
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':device_type', $this->device_type);
            $stmt->bindParam(':device_settings', $this->device_settings);
            $stmt->bindParam(':position_x', $this->position_x);
            $stmt->bindParam(':position_y', $this->position_y);
            
            $stmt->execute();
            $this->id = $this->conn->lastInsertId();
            
            return [
                'success' => true,
                'data' => [
                    'id' => $this->id,
                    'name' => $this->name,
                    'device_type' => $this->device_type,
                    'device_settings' => json_decode($this->device_settings, true),
                    'position_x' => $this->position_x,
                    'position_y' => $this->position_y
                ]
            ];
            
        } catch (PDOException $e) {
            $GLOBALS['last_error'] = $e->getMessage();
            
            // Check for duplicate name
            if ($e->getCode() == 23000) {
                return [
                    'success' => false, 
                    'error' => 'A preset with this name already exists'
                ];
            }
            
            return ['success' => false, 'error' => 'Database error occurred'];
        }
    }
    
    /**
     * Delete a preset by ID
     */
    public function delete($id) {
        try {
            $query = "DELETE FROM {$this->table} WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Preset deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Preset not found'
                ];
            }
            
        } catch (PDOException $e) {
            $GLOBALS['last_error'] = $e->getMessage();
            return ['success' => false, 'error' => 'Failed to delete preset'];
        }
    }
    
    /**
     * Search presets by name
     */
    public function searchByName($searchTerm) {
        $query = "SELECT id, name, device_type, device_settings, 
                         position_x, position_y, created_at 
                  FROM {$this->table} 
                  WHERE name LIKE :search 
                  ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $searchParam = "%{$searchTerm}%";
        $stmt->bindParam(':search', $searchParam);
        $stmt->execute();
        
        $presets = $stmt->fetchAll();
        
        // Parse JSON settings
        foreach ($presets as &$preset) {
            $preset['device_settings'] = json_decode($preset['device_settings'], true);
        }
        
        return $presets;
    }
    
    /**
     * Get presets by device type
     */
    public function getByType($type) {
        $query = "SELECT id, name, device_type, device_settings, 
                         position_x, position_y, created_at 
                  FROM {$this->table} 
                  WHERE device_type = :type 
                  ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':type', $type);
        $stmt->execute();
        
        $presets = $stmt->fetchAll();
        
        // Parse JSON settings
        foreach ($presets as &$preset) {
            $preset['device_settings'] = json_decode($preset['device_settings'], true);
        }
        
        return $presets;
    }
    
    /**
     * Validate preset data
     */
    private function validate() {
        $errors = [];
        
        // Validate name
        if (empty($this->name)) {
            $errors['name'] = 'Preset name is required';
        } elseif (strlen($this->name) < 1 || strlen($this->name) > 100) {
            $errors['name'] = 'Preset name must be between 1 and 100 characters';
        }
        
        // Validate device type
        if (empty($this->device_type)) {
            $errors['device_type'] = 'Device type is required';
        } elseif (!in_array($this->device_type, $this->validTypes)) {
            $errors['device_type'] = 'Invalid device type. Must be light or fan';
        }
        
        // Validate device settings JSON
        if (empty($this->device_settings)) {
            $errors['device_settings'] = 'Device settings are required';
        } else {
            $settingsData = json_decode($this->device_settings, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $errors['device_settings'] = 'Invalid settings JSON format';
            } else {
                // Validate settings structure
                $settingsValidation = $this->validateSettings($settingsData);
                if (!$settingsValidation['valid']) {
                    $errors['device_settings'] = $settingsValidation['errors'];
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
        
        if ($this->device_type === 'light') {
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
            
        } elseif ($this->device_type === 'fan') {
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