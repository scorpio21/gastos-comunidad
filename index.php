<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Este archivo sirve como punto de entrada para el servidor PHP

// Preparar la información de depuración
$debug = "=== DEBUG INFO ===\n";
$debug .= "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";
$debug .= "DOCUMENT_ROOT: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
$debug .= "SCRIPT_FILENAME: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
$debug .= "__DIR__: " . __DIR__ . "\n";
$debug .= "Current working directory: " . getcwd() . "\n";

// Verificar la carpeta dist y sus assets
$debug .= "\n=== DIST DIRECTORY ===\n";
$distPath = __DIR__ . '/dist';
$debug .= "Checking dist directory: {$distPath}\n";
if (is_dir($distPath)) {
    $debug .= "dist directory exists\n";
    $files = scandir($distPath);
    $debug .= "Contents of dist:\n" . print_r($files, true);
    
    $assetsPath = $distPath . '/assets';
    $debug .= "\nChecking assets directory: {$assetsPath}\n";
    if (is_dir($assetsPath)) {
        $debug .= "assets directory exists\n";
        $assets = scandir($assetsPath);
        $debug .= "Contents of assets:\n" . print_r($assets, true);
    } else {
        $debug .= "assets directory does not exist!\n";
    }
} else {
    $debug .= "dist directory does not exist!\n";
}

// Si la solicitud es para la API
if (strpos($_SERVER['REQUEST_URI'], '/gastos/api/') === 0) {
    $apiPath = substr($_SERVER['REQUEST_URI'], strlen('/gastos/api/'));
    $targetFile = __DIR__ . '/api/' . $apiPath;
    $debug .= "\n=== API REQUEST ===\n";
    $debug .= "API Path: {$apiPath}\n";
    $debug .= "Target File: {$targetFile}\n";
    
    if (file_exists($targetFile)) {
        require_once $targetFile;
        exit;
    }
    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found']);
    exit;
}

// Servir archivos estáticos desde la carpeta dist
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$debug .= "\n=== REQUEST ANALYSIS ===\n";
$debug .= "Original Request Path: {$requestPath}\n";

// Si es la raíz, servir index.html
if ($requestPath === '/gastos/' || $requestPath === '/gastos') {
    $file = __DIR__ . '/dist/index.html';
    $debug .= "Root request detected, serving index.html\n";
}
// Si es un asset, buscarlo en la carpeta dist
elseif (strpos($requestPath, '/gastos/assets/') === 0) {
    $assetPath = substr($requestPath, strlen('/gastos/'));
    $file = __DIR__ . '/dist/' . $assetPath;
    $debug .= "Asset request detected\n";
    $debug .= "Asset path: {$assetPath}\n";
}
// Para cualquier otra ruta, servir index.html
else {
    $file = __DIR__ . '/dist/index.html';
    $debug .= "Other route detected, serving index.html\n";
}

$debug .= "\n=== FILE CHECK ===\n";
$debug .= "Looking for file: {$file}\n";
$debug .= "File exists: " . (file_exists($file) ? 'Yes' : 'No') . "\n";
$debug .= "Is file: " . (is_file($file) ? 'Yes' : 'No') . "\n";

if (file_exists($file) && is_file($file)) {
    $extension = pathinfo($file, PATHINFO_EXTENSION);
    $debug .= "File extension: {$extension}\n";
    
    // Obtener el contenido del archivo
    $content = file_get_contents($file);
    
    // Configurar el tipo de contenido correcto
    switch($extension) {
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'svg':
            header('Content-Type: image/svg+xml');
            break;
        case 'html':
            header('Content-Type: text/html');
            break;
    }
    
    // Si es un archivo HTML y se solicita depuración, mostrarla
    if ($extension === 'html' && isset($_GET['debug'])) {
        echo "<pre>";
        echo $debug;
        echo "</pre>";
    }
    
    // Enviar el contenido
    echo $content;
    exit;
}

http_response_code(404);
echo "<h1>Error 404</h1>";
echo "<p>No se encontró el archivo: " . $file . "</p>";
if (isset($_GET['debug'])) {
    echo "<pre>";
    echo $debug;
    print_r(['REQUEST_URI' => $_SERVER['REQUEST_URI'],
             'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'],
             'SCRIPT_FILENAME' => $_SERVER['SCRIPT_FILENAME']]);
    echo "</pre>";
}
?>
