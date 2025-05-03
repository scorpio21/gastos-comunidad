<?php
// Configuración de CORS para permitir peticiones desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Mostrar todos los errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Información del sistema
$diagnostico = [
    "status" => "running",
    "timestamp" => date("Y-m-d H:i:s"),
    "php_version" => phpversion(),
    "server_info" => $_SERVER['SERVER_SOFTWARE'],
    "document_root" => $_SERVER['DOCUMENT_ROOT'],
    "script_filename" => $_SERVER['SCRIPT_FILENAME'],
    "api_path" => dirname($_SERVER['SCRIPT_FILENAME']),
    "database_config" => [
        "host" => "localhost",
        "db_name" => "gastos_app",
        "username" => "root",
        "password" => "Sin contraseña"
    ]
];

// Verificar conexión a la base de datos
try {
    $conn = new PDO("mysql:host=localhost;dbname=gastos_app", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $diagnostico["database_connection"] = "Exitosa";
    
    // Verificar tablas
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $diagnostico["database_tables"] = $tables;
    
    // Verificar datos en las tablas
    if (in_array("categories", $tables)) {
        $stmt = $conn->query("SELECT COUNT(*) as count FROM categories");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $diagnostico["categories_count"] = $result['count'];
    }
    
    if (in_array("expenses", $tables)) {
        $stmt = $conn->query("SELECT COUNT(*) as count FROM expenses");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $diagnostico["expenses_count"] = $result['count'];
    }
} catch(PDOException $e) {
    $diagnostico["database_connection"] = "Error: " . $e->getMessage();
}

// Verificar archivos de la API
$api_files = [
    "config.php",
    "categories.php",
    "expenses.php",
    "index.php",
    "models/Category.php",
    "models/Expense.php"
];

$diagnostico["api_files"] = [];
foreach ($api_files as $file) {
    $full_path = dirname($_SERVER['SCRIPT_FILENAME']) . "/" . $file;
    $diagnostico["api_files"][$file] = file_exists($full_path) ? "Existe" : "No existe";
}

// Sugerencias basadas en el diagnóstico
$diagnostico["sugerencias"] = [];

if ($diagnostico["database_connection"] !== "Exitosa") {
    $diagnostico["sugerencias"][] = "Verifica que MySQL esté en ejecución en XAMPP";
    $diagnostico["sugerencias"][] = "Comprueba que el usuario 'admin' tenga acceso a la base de datos 'gastos_app'";
    $diagnostico["sugerencias"][] = "Asegúrate de que la base de datos 'gastos_app' existe";
}

if (isset($diagnostico["database_tables"]) && !in_array("categories", $diagnostico["database_tables"])) {
    $diagnostico["sugerencias"][] = "Ejecuta el script SQL para crear las tablas necesarias";
}

if (isset($diagnostico["categories_count"]) && $diagnostico["categories_count"] == 0) {
    $diagnostico["sugerencias"][] = "Ejecuta el script SQL para insertar las categorías iniciales";
}

// Retornar el diagnóstico en formato JSON
echo json_encode($diagnostico, JSON_PRETTY_PRINT);
?>
