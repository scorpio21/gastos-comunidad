<?php
// Configuración de la base de datos
$host = "localhost";
$db_name = "gastos_app";
$username = "root"; // Cambiado de 'admin' a 'root' (usuario por defecto de XAMPP)
$password = "";     // Sin contraseña por defecto

// Configuración de CORS para permitir peticiones desde la aplicación React
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Mostrar todos los errores para facilitar la depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Función para conectar a la base de datos
function getConnection() {
    global $host, $db_name, $username, $password;
    
    try {
        $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
        $conn->exec("set names utf8");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $exception) {
        echo json_encode(["error" => "Error de conexión: " . $exception->getMessage()]);
        return null;
    }
}

// Función para generar un UUID v4
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
?>
