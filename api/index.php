<?php
// Archivo de prueba para la API
header("Content-Type: application/json; charset=UTF-8");

// Comprobar la conexión a la base de datos
require_once 'config.php';

$conn = getConnection();

if ($conn) {
    echo json_encode([
        "status" => "success",
        "message" => "Conexión a la base de datos establecida correctamente",
        "endpoints" => [
            "categories" => "/api/categories.php",
            "expenses" => "/api/expenses.php"
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "No se pudo establecer conexión con la base de datos"
    ]);
}
?>
