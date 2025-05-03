<?php
// Incluir configuración y conexión a la base de datos
require_once '../config.php';

// Configurar cabeceras para respuesta JSON
header('Content-Type: application/json');

// Verificar si se proporcionó un token
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

// Verificar formato del header de autorización
if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    echo json_encode([
        'success' => false,
        'message' => 'Token no proporcionado o formato inválido',
        'isAuthenticated' => false
    ]);
    exit;
}

$token = $matches[1];

// En una aplicación real, verificaríamos este token contra una tabla de sesiones
// Para este ejemplo, simplemente verificamos que el token no esté vacío
// y devolvemos una respuesta positiva

// En un sistema real, aquí verificaríamos la validez del token en la base de datos
// Por ejemplo:
// $stmt = $conn->prepare("SELECT user_id FROM sessions WHERE token = ? AND expires_at > NOW()");
// $stmt->bind_param("s", $token);
// $stmt->execute();
// $result = $stmt->get_result();
// $isValid = $result->num_rows > 0;

// Para este ejemplo simplificado, consideramos válido cualquier token no vacío
$isValid = !empty($token);

echo json_encode([
    'success' => true,
    'isAuthenticated' => $isValid
]);
?>
