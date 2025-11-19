<?php 

$envFile = __DIR__ . '/../.env';

if (!file_exists($envFile)) {
    error_log('.env file not found at: ' . $envFile);
    throw new Exception('.env file not found');
}

$lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lines as $line) {
    $line = trim($line);
    
    // Skip comments and empty lines
    if ($line === '' || strpos($line, '#') === 0) {
        continue;
    }
    
    // Parse key=value
    if (strpos($line, '=') === false) {
        continue;
    }
    
    list($key, $value) = explode('=', $line, 2);
    $key = trim($key);
    $value = trim($value);
    
    // Remove quotes from value if present
    $value = trim($value, '"\' ');
    
    putenv("$key=$value");
    $_ENV[$key] = $value;
}
