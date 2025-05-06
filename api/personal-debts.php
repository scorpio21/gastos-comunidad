<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Configurar el archivo de log
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/debug.log');

// Registrar la solicitud
error_log('Solicitud recibida: ' . $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI']);
error_log('Origen: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'No especificado'));

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Conectar a la base de datos
function getConnection() {
    $host = 'localhost';
    $db = 'gastos_app';
    $user = 'root';
    $pass = '';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        error_log('Error de conexión: ' . $e->getMessage());
        return null;
    }
}

// Obtener todas las deudas personales
function getAllDebts() {
    $conn = getConnection();
    if (!$conn) {
        return ['success' => false, 'message' => 'Error de conexión a la base de datos'];
    }

    try {
        $stmt = $conn->query('SELECT * FROM personal_debts ORDER BY date DESC');
        $debts = $stmt->fetchAll();
        return ['success' => true, 'data' => $debts];
    } catch (PDOException $e) {
        error_log('Error al obtener deudas: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error al obtener las deudas personales'];
    }
}

// Obtener una deuda por ID
function getDebtById($id) {
    $conn = getConnection();
    if (!$conn) {
        return ['success' => false, 'message' => 'Error de conexión a la base de datos'];
    }

    try {
        $stmt = $conn->prepare('SELECT * FROM personal_debts WHERE id = ?');
        $stmt->execute([$id]);
        $debt = $stmt->fetch();

        if ($debt) {
            return ['success' => true, 'data' => $debt];
        } else {
            return ['success' => false, 'message' => 'Deuda no encontrada'];
        }
    } catch (PDOException $e) {
        error_log('Error al obtener deuda: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error al obtener la deuda'];
    }
}

// Crear una nueva deuda
function createDebt($data) {
    $conn = getConnection();
    if (!$conn) {
        return ['success' => false, 'message' => 'Error de conexión a la base de datos'];
    }

    // Validar datos
    if (!isset($data['name']) || !isset($data['concept']) || !isset($data['amount']) || !isset($data['date'])) {
        return ['success' => false, 'message' => 'Faltan datos requeridos'];
    }

    try {
        $stmt = $conn->prepare('INSERT INTO personal_debts (name, concept, amount, date, status) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['name'],
            $data['concept'],
            $data['amount'],
            $data['date'],
            isset($data['status']) ? $data['status'] : 'pending'
        ]);

        $id = $conn->lastInsertId();
        return ['success' => true, 'message' => 'Deuda creada correctamente', 'id' => $id];
    } catch (PDOException $e) {
        error_log('Error al crear deuda: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error al crear la deuda: ' . $e->getMessage()];
    }
}

// Actualizar una deuda existente
function updateDebt($id, $data) {
    $conn = getConnection();
    if (!$conn) {
        return ['success' => false, 'message' => 'Error de conexión a la base de datos'];
    }

    // Validar datos
    if (!isset($data['name']) || !isset($data['concept']) || !isset($data['amount']) || !isset($data['date'])) {
        return ['success' => false, 'message' => 'Faltan datos requeridos'];
    }

    try {
        $stmt = $conn->prepare('UPDATE personal_debts SET name = ?, concept = ?, amount = ?, date = ?, status = ? WHERE id = ?');
        $stmt->execute([
            $data['name'],
            $data['concept'],
            $data['amount'],
            $data['date'],
            isset($data['status']) ? $data['status'] : 'pending',
            $id
        ]);

        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Deuda actualizada correctamente'];
        } else {
            return ['success' => false, 'message' => 'No se encontró la deuda o no se realizaron cambios'];
        }
    } catch (PDOException $e) {
        error_log('Error al actualizar deuda: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error al actualizar la deuda'];
    }
}

// Eliminar una deuda
function deleteDebt($id) {
    $conn = getConnection();
    if (!$conn) {
        return ['success' => false, 'message' => 'Error de conexión a la base de datos'];
    }

    try {
        $stmt = $conn->prepare('DELETE FROM personal_debts WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Deuda eliminada correctamente'];
        } else {
            return ['success' => false, 'message' => 'No se encontró la deuda'];
        }
    } catch (PDOException $e) {
        error_log('Error al eliminar deuda: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Error al eliminar la deuda'];
    }
}

// Procesar la solicitud
$method = $_SERVER['REQUEST_METHOD'];

// Obtener datos de la solicitud
$data = null;
if ($method === 'POST' || $method === 'PUT') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    error_log('Datos recibidos: ' . $input);
}

// Obtener ID de la URL si existe
$id = isset($_GET['id']) ? $_GET['id'] : null;

// Ejecutar la acción correspondiente según el método HTTP
switch ($method) {
    case 'GET':
        if ($id) {
            $response = getDebtById($id);
        } else {
            $response = getAllDebts();
        }
        break;

    case 'POST':
        $response = createDebt($data);
        break;

    case 'PUT':
        if (!$id) {
            $response = ['success' => false, 'message' => 'ID no especificado'];
        } else {
            $response = updateDebt($id, $data);
        }
        break;

    case 'DELETE':
        if (!$id) {
            $response = ['success' => false, 'message' => 'ID no especificado'];
        } else {
            $response = deleteDebt($id);
        }
        break;

    default:
        $response = ['success' => false, 'message' => 'Método no soportado'];
        break;
}

// Devolver la respuesta como JSON
echo json_encode($response);
