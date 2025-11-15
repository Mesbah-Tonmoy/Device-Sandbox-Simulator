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

class Database {
    private static $instance = null;
    private $connection;
    
    // Database credentials
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    
    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct() {
        $this->loadEnvVariables();
        $this->connect();
    }
    
    /**
     * Load environment variables from .env file
     */
    private function loadEnvVariables() {
        $envFile = __DIR__ . '/../.env';
        
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                
                list($key, $value) = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
            }
        }
        
        // Set database credentials
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->port = $_ENV['DB_PORT'] ?? '3306';
        $this->db_name = $_ENV['DB_NAME'] ?? 'device_sandbox';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';
    }
    
    /**
     * Establish database connection
     */
    private function connect() {
        $this->connection = null;
        
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            
            $options = [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES => false,
                \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];
            
            $this->connection = new \PDO($dsn, $this->username, $this->password, $options);
            
        } catch (\PDOException $e) {
            $this->handleConnectionError($e);
        }
    }
    
    /**
     * Handle connection errors
     */
    private function handleConnectionError($exception) {
        $isDebug = ($_ENV['APP_DEBUG'] ?? 'false') === 'true';
        
        if ($isDebug) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed',
                'error' => $exception->getMessage()
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed. Please try again later.'
            ]);
        }
        
        exit();
    }
    
    /**
     * Get database instance (Singleton pattern)
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Get PDO connection
     */
    public function getConnection() {
        return $this->connection;
    }
    
    /**
     * Prevent cloning of instance
     */
    private function __clone() {}
    
    /**
     * Prevent unserialization of instance
     */
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}