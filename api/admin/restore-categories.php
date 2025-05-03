<?php
// Asegurarse de que no haya salida antes del JSON
ob_start();

// Incluir configuración y conexión a la base de datos
require_once '../config.php';

// Configurar cabeceras para respuesta JSON
header('Content-Type: application/json');

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

// Categorías personalizadas del usuario con color e icono
$default_categories = [
    ['name' => 'Gastos Comunidad Casa', 'type' => 'expense', 'color' => '#4CAF50', 'icon' => 'home'],
    ['name' => 'Gastos Comunidad Garaje', 'type' => 'expense', 'color' => '#2196F3', 'icon' => 'car'],
    ['name' => 'Extras Casa', 'type' => 'expense', 'color' => '#FF9800', 'icon' => 'home'],
    ['name' => 'Extras Garaje', 'type' => 'expense', 'color' => '#FF9800', 'icon' => 'car'],
    ['name' => 'Deuda Comunidad Casa', 'type' => 'expense', 'color' => '#F44336', 'icon' => 'home'],
    ['name' => 'Deuda Comunidad Garaje', 'type' => 'expense', 'color' => '#F44336', 'icon' => 'car'],
    ['name' => 'Ingresos', 'type' => 'income', 'color' => '#4CAF50', 'icon' => 'trending-up']
];

$resultado = [
    'categorias_restauradas' => 0,
    'estructura_corregida' => false
];

try {
    // Usar la función de conexión definida en config.php
    $conn = getConnection();
    
    // Si la conexión falló, lanzar una excepción
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }
    
    // Verificar si existe la tabla categories
    $table_check = $conn->query("SHOW TABLES LIKE 'categories'");
    $categories_exists = $table_check->rowCount() > 0;
    
    if (!$categories_exists) {
        // Crear la tabla si no existe
        $conn->exec("CREATE TABLE categories (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            type VARCHAR(50) NOT NULL,
            color VARCHAR(50) NOT NULL,
            icon VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
        $resultado['tabla_creada'] = true;
    } else {
        // Verificar la estructura de la tabla
        $columns = $conn->query("SHOW COLUMNS FROM categories");
        $column_names = [];
        while($column = $columns->fetch(PDO::FETCH_ASSOC)) {
            $column_names[] = $column['Field'];
        }
        
        // Verificar si faltan columnas
        $missing_columns = [];
        $required_columns = ['id', 'name', 'type', 'color', 'icon', 'created_at'];
        
        foreach($required_columns as $col) {
            if (!in_array($col, $column_names)) {
                $missing_columns[] = $col;
            }
        }
        
        // Añadir columnas faltantes
        if (!empty($missing_columns)) {
            foreach($missing_columns as $col) {
                switch($col) {
                    case 'id':
                        $conn->exec("ALTER TABLE categories ADD COLUMN id VARCHAR(36) PRIMARY KEY FIRST");
                        break;
                    case 'type':
                        $conn->exec("ALTER TABLE categories ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'expense' AFTER name");
                        break;
                    case 'color':
                        $conn->exec("ALTER TABLE categories ADD COLUMN color VARCHAR(50) NOT NULL DEFAULT '#4CAF50' AFTER type");
                        break;
                    case 'icon':
                        $conn->exec("ALTER TABLE categories ADD COLUMN icon VARCHAR(50) NOT NULL DEFAULT 'circle' AFTER color");
                        break;
                    case 'created_at':
                        $conn->exec("ALTER TABLE categories ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
                        break;
                }
            }
            $resultado['columnas_añadidas'] = $missing_columns;
            $resultado['estructura_corregida'] = true;
        }
    }
    
    // Borrar todas las categorías existentes
    $conn->exec("DELETE FROM categories");
    $resultado['categorias_borradas'] = true;
    
    // Insertar categorías personalizadas
    $insert_stmt = $conn->prepare("INSERT INTO categories (id, name, type, color, icon) VALUES (?, ?, ?, ?, ?)");
    
    foreach ($default_categories as $category) {
        $id = generateUUID();
        $insert_stmt->execute([
            $id, 
            $category['name'], 
            $category['type'], 
            $category['color'], 
            $category['icon']
        ]);
        $resultado['categorias_restauradas']++;
    }
    
    $resultado['success'] = true;
    $resultado['message'] = 'Categorías restauradas correctamente';
    
    // Obtener categorías restauradas para mostrarlas en la respuesta
    $stmt = $conn->query("SELECT * FROM categories");
    $new_categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $resultado['categorias'] = $new_categories;
    $resultado['total_categorias'] = count($new_categories);
    
} catch (PDOException $e) {
    $resultado['success'] = false;
    $resultado['error'] = $e->getMessage();
} catch (Exception $e) {
    $resultado['success'] = false;
    $resultado['error'] = $e->getMessage();
}

// Limpiar cualquier salida previa
ob_end_clean();

// Devolver resultados
echo json_encode($resultado, JSON_PRETTY_PRINT);
// Terminar la ejecución para evitar salida adicional
exit;
