<?php
// Incluir configuración y conexión a la base de datos
require_once '../config.php';

try {
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

    // Buscar usuario por token
    $conn = getConnection();
    $stmt = $conn->prepare("SELECT id, username, name, role FROM admin_users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            'success' => true,
            'isAuthenticated' => true,
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'isAuthenticated' => false,
            'message' => 'Token inválido o expirado'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'isAuthenticated' => false,
        'message' => 'Error al verificar autenticación: ' . $e->getMessage()
    ]);
}
?>
