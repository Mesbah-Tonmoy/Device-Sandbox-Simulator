<?php
/**
 * Model Interface
 * Defines contract for all model classes
 */

namespace DeviceSandbox\Interfaces;

interface ModelInterface
{
    /**
     * Validate model data
     * 
     * @return array{valid: bool, errors: array}
     */
    public function validate(): array;
    
    /**
     * Save model to database
     * 
     * @return array
     */
    public function save(): array;
    
    /**
     * Delete model from database
     * 
     * @param int $id
     * @return array
     */
    public function delete(int $id): array;
}