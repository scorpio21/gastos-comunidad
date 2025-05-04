<?php
// Incluir configuración y conexión a la base de datos
require_once '../config.php';

// Configurar cabeceras para respuesta JSON
header('Content-Type: application/json');

// Verificar si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit;
}

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se proporcionaron credenciales
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Se requiere nombre de usuario y contraseña'
    ]);
    exit;
}

$login_username = $data['username'];
$login_password = $data['password'];

try {
    // Guardar las credenciales de login en variables separadas
    $login_user = $login_username;
    $login_pass = $login_password;
    
    // Usar la función de conexión definida en config.php
    $conn = getConnection();
    
    // Si la conexión falló, lanzar una excepción
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }
    
    // Preparar consulta para buscar el usuario
    $stmt = $conn->prepare("SELECT id, username, password, name, role FROM admin_users WHERE username = ?");
    $stmt->execute([$login_user]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        
        // Verificar contraseña
        if (password_verify($login_pass, $user['password'])) {
            // Actualizar último inicio de sesión
            $updateStmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
            $updateStmt->execute([$user['id']]);
            
            // Generar token de sesión (simple para este ejemplo)
            $token = bin2hex(random_bytes(32));
            
            // En una aplicación real, guardaríamos este token en una tabla de sesiones
            // Aquí simplemente lo devolvemos
            
            // Respuesta exitosa
            echo json_encode([
                'success' => true,
                'message' => 'Inicio de sesión exitoso',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'name' => $user['name'],
                    'role' => $user['role']
                ],
                'token' => $token
            ]);
        } else {
            // Contraseña incorrecta
            echo json_encode([
                'success' => false,
                'message' => 'Credenciales inválidas'
            ]);
            exit;
        }
    } else {
        // Usuario no encontrado
        echo json_encode([
            'success' => false,
            'message' => 'Credenciales inválidas'
        ]);
        exit;
    }
    
    // Con PDO no es necesario cerrar explícitamente las conexiones
    // Se cierran automáticamente cuando las variables salen del ámbito
    
} catch (Exception $e) {
    // Respuesta de error
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
