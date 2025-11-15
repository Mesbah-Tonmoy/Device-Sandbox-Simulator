<?php
/**
 * Base Model Abstract Class
 * Provides common functionality for all models
 * PHP 8.4 Compatible
 */

namespace DeviceSandbox\Models;

use DeviceSandbox\Config\Database;
use DeviceSandbox\Interfaces\ModelInterface;
use PDO;

abstract class BaseModel implements ModelInterface
{
    protected PDO $conn;
    protected string $table = '';
    
    /**
     * Constructor - Inject database connection
     */
    public function __construct()
    {
        $database = Database::getInstance();
        $this->conn = $database->getConnection();
    }
    
    /**
     * Sanitize input to prevent XSS
     */
    protected function sanitize(mixed $data): mixed
    {
        if (is_array($data)) {
            return array_map([$this, 'sanitize'], $data);
        }
        
        if (is_string($data)) {
            return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
        }
        
        return $data;
    }
    
    /**
     * Execute query with error handling
     */
    protected function executeQuery(string $query, array $params = []): array
    {
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            return ['success' => true, 'statement' => $stmt];
        } catch (\PDOException $e) {
            $GLOBALS['last_error'] = $e->getMessage();
            return ['success' => false, 'error' => 'Database error occurred'];
        }
    }
    
    /**
     * Abstract methods to be implemented by child classes
     */
    abstract public function validate(): array;
    abstract public function save(): array;
    abstract public function delete(int $id): array;
}