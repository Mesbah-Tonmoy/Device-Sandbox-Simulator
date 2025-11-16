<?php
/**
 * Database Configuration and Connection Handler
 * Using PDO with prepared statements for security
 * Singleton pattern for single connection instance
 */

namespace DeviceSandbox\Config;

use PDO;
use PDOException;
use Exception;

require_once __DIR__ . '/../../config/env.php';

class Database {
    private static ?self $instance = null;
    private ?PDO $connection = null;
    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private int $port;
    
    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct() {
        $this->loadEnvVariables();
        $this->connect();
    }
    
    /**
     * Load environment variables from .env file (loaded via env.php)
     */
    private function loadEnvVariables(): void {
        // Set database credentials with defaults
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->port = (int)(getenv('DB_PORT') ?: 3306);
        $this->db_name = getenv('DB_NAME') ?: throw new Exception('DB_NAME not set');
        $this->username = getenv('DB_USER') ?: throw new Exception('DB_USER not set');
        $this->password = getenv('DB_PASS') ?: '';
    }
    
    /**
     * Establish database connection
     */
    private function connect(): void {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch (PDOException $e) {
            $this->handleConnectionError($e);
        }
    }
    
    /**
     * Handle connection errors
     */
    private function handleConnectionError(PDOException $exception): never {
        $isDebug = getenv('APP_DEBUG') === 'true';
        
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed',
            'error' => $isDebug ? $exception->getMessage() : null
        ]);
        
        exit;
    }
    
    /**
     * Get database instance (Singleton pattern)
     */
    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Get PDO connection
     */
    public function getConnection(): PDO {
        return $this->connection;
    }
    
    /**
     * Prevent cloning of instance
     */
    private function __clone() {}
    
    /**
     * Prevent unserialization of instance
     */
    public function __wakeup(): never {
        throw new Exception("Cannot unserialize singleton");
    }
}