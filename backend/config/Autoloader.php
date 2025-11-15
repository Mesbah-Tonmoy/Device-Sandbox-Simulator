<?php
/**
 * PSR-4 Autoloader for Device Sandbox
 * Automatically loads classes based on namespace
 */

class Autoloader
{
    /**
     * Base directory for the namespace prefix
     */
    private string $baseDir;
    
    /**
     * Constructor
     * 
     * @param string $baseDir Base directory for classes
     */
    public function __construct(string $baseDir = null) 
    {
        $this->baseDir = $baseDir ?: __DIR__ . '/../';
    }
    
    /**
     * Register the autoloader
     */
    public function register(): void
    {
        spl_autoload_register([$this, 'loadClass']);
    }
    
    /**
     * Load class file for given class name
     * 
     * @param string $className Fully qualified class name
     * @return bool True if file was loaded, false otherwise
     */
    private function loadClass(string $className): bool
    {
        // Get the relative class name (keep the full path including namespace)
        $relativeClass = $className;
        
        // Replace namespace separators with directory separators
        $file = $this->baseDir . str_replace('\\', DIRECTORY_SEPARATOR, $relativeClass) . '.php';
        
        // If the file exists, require it
        if (file_exists($file)) {
            require_once $file;
            return true;
        }
        
        return false;
    }
}

// Initialize and register autoloader
$autoloader = new Autoloader();
$autoloader->register();