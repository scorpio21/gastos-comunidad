<?php
// Configurar cabeceras para respuesta JSON
header('Content-Type: application/json');

require_once '../config.php';

$response = [
    'success' => false,
    'message' => ''
];

try {
    $conn = getConnection();
    if (!$conn) {
        throw new Exception('No se pudo conectar a la base de datos');
    }
    // Vaciar la tabla de deudas personales
    $conn->exec('TRUNCATE TABLE personal_debts');
    $response['success'] = true;
    $response['message'] = 'Todas las deudas personales han sido eliminadas correctamente.';
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
