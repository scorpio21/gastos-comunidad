<?php
// Incluir configuración
require_once 'config.php';

// Configurar cabeceras para respuesta JSON
header('Content-Type: application/json');

// Credenciales para actualizar
$username = 'scorpio';
$new_password = 'scorpio727';

// Información de diagnóstico
$resultado = [
    'username' => $username,
    'password_length' => strlen($new_password)
];

try {
    // Obtener conexión
    $conn = getConnection();
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }
    
    // Generar nuevo hash de contraseña
    $password_hash = password_hash($new_password, PASSWORD_DEFAULT);
    $resultado['nuevo_hash'] = $password_hash;
    
    // Actualizar contraseña en la base de datos
    $stmt = $conn->prepare("UPDATE admin_users SET password = ? WHERE username = ?");
    $resultado['actualizado'] = $stmt->execute([$password_hash, $username]);
    $resultado['filas_afectadas'] = $stmt->rowCount();
    
    // Verificar que la actualización funcionó
    $verify_stmt = $conn->prepare("SELECT password FROM admin_users WHERE username = ?");
    $verify_stmt->execute([$username]);
    $user = $verify_stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $resultado['hash_actual_en_db'] = $user['password'];
        $resultado['verificacion'] = password_verify($new_password, $user['password']);
    } else {
        $resultado['error'] = "No se pudo verificar la actualización";
    }
    
} catch (Exception $e) {
    $resultado['error'] = $e->getMessage();
}

// Devolver resultados
echo json_encode($resultado, JSON_PRETTY_PRINT);
?>
