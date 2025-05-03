<?php
// Incluir archivo de configuración y modelo
require_once 'config.php';
require_once 'models/Expense.php';

// Obtener la conexión a la base de datos
$conn = getConnection();

if (!$conn) {
    exit;
}

// Método GET: Obtener todos los gastos (con filtros opcionales)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Crear instancia del modelo Expense
        $expense = new Expense($conn);
        
        // Preparar filtros
        $filters = [];
        
        if (isset($_GET['startDate']) && $_GET['startDate']) {
            $filters['startDate'] = $_GET['startDate'];
        }
        
        if (isset($_GET['endDate']) && $_GET['endDate']) {
            $filters['endDate'] = $_GET['endDate'];
        }
        
        if (isset($_GET['category']) && $_GET['category']) {
            $filters['category'] = $_GET['category'];
        }
        
        if (isset($_GET['type']) && $_GET['type'] !== 'all') {
            $filters['type'] = $_GET['type'];
        }
        
        // Obtener gastos con filtros
        $stmt = $expense->getAll($filters);
        $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($expenses);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener gastos: " . $exception->getMessage()]);
    }
}

// Método POST: Crear un nuevo gasto
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos enviados
    $data = json_decode(file_get_contents("php://input"));
    
    // Validar datos
    if (!isset($data->amount) || !isset($data->description) || !isset($data->category) || !isset($data->date)) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos. Se requiere importe, descripción, categoría y fecha."]);
        exit;
    }
    
    try {
        // Crear instancia del modelo Expense
        $expense = new Expense($conn);
        
        // Asignar valores
        $expense->id = generateUUID();
        $expense->amount = $data->amount;
        $expense->description = $data->description;
        $expense->category = $data->category;
        $expense->date = $data->date;
        $expense->is_income = isset($data->isIncome) ? $data->isIncome : false;
        
        // Crear el gasto
        if($expense->create()) {
            http_response_code(201);
            echo json_encode(["id" => $expense->id, "message" => "Gasto creado correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo crear el gasto"]);
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["error" => "Error al crear gasto: " . $exception->getMessage()]);
    }
}

// Método PUT: Actualizar un gasto existente
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Obtener los datos enviados
    $data = json_decode(file_get_contents("php://input"));
    
    // Validar datos
    if (!isset($data->id) || !isset($data->amount) || !isset($data->description) || !isset($data->category) || !isset($data->date)) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos. Se requiere id, importe, descripción, categoría y fecha."]);
        exit;
    }
    
    try {
        // Crear instancia del modelo Expense
        $expense = new Expense($conn);
        
        // Asignar valores
        $expense->id = $data->id;
        $expense->amount = $data->amount;
        $expense->description = $data->description;
        $expense->category = $data->category;
        $expense->date = $data->date;
        $expense->is_income = isset($data->isIncome) ? $data->isIncome : false;
        
        // Actualizar el gasto
        if($expense->update()) {
            echo json_encode(["message" => "Gasto actualizado correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo actualizar el gasto"]);
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar gasto: " . $exception->getMessage()]);
    }
}

// Método DELETE: Eliminar un gasto
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Obtener el ID del gasto a eliminar
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Se requiere el ID del gasto"]);
        exit;
    }
    
    try {
        // Crear instancia del modelo Expense
        $expense = new Expense($conn);
        $expense->id = $id;
        
        // Eliminar el gasto
        if($expense->delete()) {
            echo json_encode(["message" => "Gasto eliminado correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo eliminar el gasto"]);
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["error" => "Error al eliminar gasto: " . $exception->getMessage()]);
    }
}
?>
