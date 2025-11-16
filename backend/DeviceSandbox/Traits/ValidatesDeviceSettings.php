<?php
/**
 * Device Settings Validation Trait
 * Shared validation logic for Device and Preset models
 */

namespace DeviceSandbox\Traits;

trait ValidatesDeviceSettings
{
    /**
     * Valid device types
     */
    private array $validTypes = ['light', 'fan'];
    
    /**
     * Valid color temperatures for lights
     */
    private array $validColorTemps = ['warm', 'neutral', 'cool', 'pink'];
    
    /**
     * Validate device type
     */
    protected function validateDeviceType(string $type): ?string
    {
        if (empty($type)) {
            return 'Device type is required';
        }
        
        if (!in_array($type, $this->validTypes)) {
            return 'Invalid device type. Must be light or fan';
        }
        
        return null;
    }
    
    /**
     * Validate position coordinates
     */
    protected function validatePosition(int $x, int $y): array
    {
        $errors = [];
        
        if (!is_numeric($x) || $x < 0 || $x > 10000) {
            $errors['position_x'] = 'Invalid X position (must be 0-10000)';
        }
        
        if (!is_numeric($y) || $y < 0 || $y > 10000) {
            $errors['position_y'] = 'Invalid Y position (must be 0-10000)';
        }
        
        return $errors;
    }
    
    /**
     * Validate settings structure based on device type
     */
    protected function validateSettings(string $type, array $settings): array
    {
        $errors = [];
        
        if ($type === 'light') {
            $errors = array_merge($errors, $this->validateLightSettings($settings));
        } elseif ($type === 'fan') {
            $errors = array_merge($errors, $this->validateFanSettings($settings));
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Validate light-specific settings
     */
    private function validateLightSettings(array $settings): array
    {
        $errors = [];
        
        if (!isset($settings['power']) || !is_bool($settings['power'])) {
            $errors['power'] = 'Light power must be boolean';
        }
        
        if (!isset($settings['brightness']) || 
            !is_numeric($settings['brightness']) || 
            $settings['brightness'] < 0 || 
            $settings['brightness'] > 100) {
            $errors['brightness'] = 'Light brightness must be 0-100';
        }
        
        if (!isset($settings['colorTemp']) || !in_array($settings['colorTemp'], $this->validColorTemps)) {
            $errors['colorTemp'] = 'Invalid color temperature';
        }
        
        return $errors;
    }
    
    /**
     * Validate fan-specific settings
     */
    private function validateFanSettings(array $settings): array
    {
        $errors = [];
        
        if (!isset($settings['power']) || !is_bool($settings['power'])) {
            $errors['power'] = 'Fan power must be boolean';
        }
        
        if (!isset($settings['speed']) || 
            !is_numeric($settings['speed']) || 
            $settings['speed'] < 0 || 
            $settings['speed'] > 100) {
            $errors['speed'] = 'Fan speed must be 0-100';
        }
        
        return $errors;
    }
}
