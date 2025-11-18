<?php
/**
 * Preset Model
 * Handles all database operations for presets
 * PHP 8.4 Compatible with modern features
 */

namespace DeviceSandbox\Models;

use DeviceSandbox\Traits\ValidatesDeviceSettings;
use PDO;
use PDOException;

class Preset extends BaseModel
{
    use ValidatesDeviceSettings;
    
    // Using PHP 8.1+ property types
    public ?int $id = null;
    public string $name = '';
    public string $device_type = '';
    public string $device_settings = '';
    public ?string $created_at = null;
    
    protected string $table = 'presets';
    
    /**
     * Get all presets ordered by creation date (newest first)
     */
    public function getAll(): array
    {
        $query = "SELECT id, name, device_type, device_settings, created_at 
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
    public function getById(int $id): array|false
    {
        $query = "SELECT id, name, device_type, device_settings, created_at 
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
     * Check if preset name already exists
     */
    private function nameExists(string $name, ?int $excludeId = null): bool
    {
        $query = "SELECT COUNT(*) FROM {$this->table} WHERE name = :name";
        
        if ($excludeId !== null) {
            $query .= " AND id != :id";
        }
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        
        if ($excludeId !== null) {
            $stmt->bindParam(':id', $excludeId, PDO::PARAM_INT);
        }
        
        $stmt->execute();
        
        return $stmt->fetchColumn() > 0;
    }
    
    /**
     * Create a new preset
     */
    public function create(): array
    {
        // Validate before creating
        $validation = $this->validate();
        if (!$validation['valid']) {
            return ['success' => false, 'errors' => $validation['errors']];
        }
        
        // Check for duplicate name
        if ($this->nameExists($this->name)) {
            return [
                'success' => false, 
                'error' => 'A preset with this name already exists. Please choose a different name.'
            ];
        }
        
        try {
            $query = "INSERT INTO {$this->table} 
                     (name, device_type, device_settings) 
                     VALUES (:name, :device_type, :device_settings)";
            
            $stmt = $this->conn->prepare($query);
            
            // Bind parameters
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':device_type', $this->device_type);
            $stmt->bindParam(':device_settings', $this->device_settings);
            
            $stmt->execute();
            $this->id = (int) $this->conn->lastInsertId();
            
            return [
                'success' => true,
                'data' => [
                    'id' => $this->id,
                    'name' => $this->name,
                    'device_type' => $this->device_type,
                    'device_settings' => json_decode($this->device_settings, true),
                ]
            ];
            
        } catch (PDOException $e) {
            $GLOBALS['last_error'] = $e->getMessage();
            
            // Check for unique constraint violation
            if ($e->getCode() == 23000) {
                return [
                    'success' => false, 
                    'error' => 'A preset with this name already exists. Please choose a different name.'
                ];
            }
            
            return ['success' => false, 'error' => 'Database error occurred'];
        }
    }
    
    /**
     * Delete a preset by ID
     */
    public function delete(int $id): array
    {
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
    public function searchByName(string $searchTerm): array
    {
        $query = "SELECT id, name, device_type, device_settings, created_at 
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
    public function getByType(string $type): array
    {
        $query = "SELECT id, name, device_type, device_settings, created_at 
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
     * Uses ValidatesDeviceSettings trait for shared validation logic
     */
    public function validate(): array
    {
        $errors = [];
        
        // Validate name
        if (empty($this->name)) {
            $errors['name'] = 'Preset name is required';
        } elseif (strlen($this->name) < 1 || strlen($this->name) > 100) {
            $errors['name'] = 'Preset name must be between 1 and 100 characters';
        }
        
        // Validate device type (from trait)
        $typeError = $this->validateDeviceType($this->device_type);
        if ($typeError) {
            $errors['device_type'] = $typeError;
        }
        
        // Validate device settings JSON
        if (empty($this->device_settings)) {
            $errors['device_settings'] = 'Device settings are required';
        } else {
            $settingsData = json_decode($this->device_settings, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $errors['device_settings'] = 'Invalid settings JSON format';
            } else {
                // Validate settings structure (from trait)
                $settingsValidation = $this->validateSettings($this->device_type, $settingsData);
                if (!$settingsValidation['valid']) {
                    $errors = array_merge($errors, $settingsValidation['errors']);
                }
            }
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Save method (alias for create)
     */
    public function save(): array
    {
        return $this->create();
    }
}