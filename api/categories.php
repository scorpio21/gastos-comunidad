<?php
// Incluir archivo de configuración y modelo
require_once 'config.php';
require_once 'models/Category.php';

// Obtener la conexión a la base de datos
$conn = getConnection();

if (!$conn) {
    exit;
}

// Método GET: Obtener todas las categorías
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Crear instancia del modelo Category
        $category = new Category($conn);
        
        // Obtener todas las categorías
        $stmt = $category->getAll();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($categories);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener categorías: " . $exception->getMessage()]);
    }
}

// Método POST: Crear una nueva categoría
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos enviados
    $data = json_decode(file_get_contents("php://input"));
    
    // Validar datos
    if (!isset($data->name) || !isset($data->color) || !isset($data->icon)) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos. Se requiere nombre, color e icono."]);
        exit;
    }
    
    try {
        // Crear instancia del modelo Category
        $category = new Category($conn);
        
        // Generar un UUID para el ID
        $category->id = generateUUID();
        $category->name = $data->name;
        $category->color = $data->color;
        $category->icon = $data->icon;
        
        // Crear la categoría
        if($category->create()) {
            http_response_code(201);
            echo json_encode(["id" => $category->id, "message" => "Categoría creada correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo crear la categoría"]);
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["error" => "Error al crear categoría: " . $exception->getMessage()]);
    }
}

// Método PUT: Actualizar una categoría existente
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Obtener los datos enviados
    $data = json_decode(file_get_contents("php://input"));
    
    // Validar datos
    if (!isset($data->id) || !isset($data->name) || !isset($data->color) || !isset($data->icon)) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos. Se requiere id, nombre, color e icono."]);
        exit;
    }
    
    try {
        // Crear instancia del modelo Category
        $category = new Category($conn);
        
        // Asignar valores
        $category->id = $data->id;
        $category->name = $data->name;
        $category->color = $data->color;
        $category->icon = $data->icon;
        
        // Actualizar la categoría
        if($category->update()) {
            echo json_encode(["message" => "Categoría actualizada correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo actualizar la categoría"]);
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar categoría: " . $exception->getMessage()]);
    }
}

// Método DELETE: Eliminar una categoría
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Obtener el ID de la categoría a eliminar
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Se requiere el ID de la categoría"]);
        exit;
    }
    
    try {
        // Crear instancia del modelo Category
        $category = new Category($conn);
        $category->id = $id;
        
        // Verificar si la categoría está siendo utilizada
        if ($category->isUsedByExpenses()) {
            http_response_code(400);
            echo json_encode(["error" => "No se puede eliminar la categoría porque está siendo utilizada por gastos"]);
            exit;
        }
        
        // Eliminar la categoría
        if($category->delete()) {
            echo json_encode(["message" => "Categoría eliminada correctamente"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo eliminar la categoría"]);
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["error" => "Error al eliminar categoría: " . $exception->getMessage()]);
    }
}
?>
