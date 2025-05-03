<?php
// Configurar cabeceras para respuesta JSON
header('Content-Type: application/json');

// Incluir el archivo de configuración
require_once '../config.php';

// Tablas a preservar
$preserve_tables = ['admin_users', 'categories'];

// Inicializar respuesta
$response = [
    'success' => false,
    'message' => 'Inicializando...',
    'tables_cleaned' => [],
    'tables_preserved' => $preserve_tables
];

try {
    // Obtener conexión
    $conn = getConnection();
    
    // Verificar conexión
    if (!$conn) {
        throw new Exception("No se pudo conectar a la base de datos");
    }
    
    // Desactivar restricciones de clave foránea
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
    
    // Obtener todas las tablas
    $tables_result = $conn->query("SHOW TABLES");
    $tables = $tables_result->fetchAll(PDO::FETCH_COLUMN);
    
    // Limpiar tablas
    $cleaned_tables = [];
    foreach ($tables as $table) {
        // Omitir tablas a preservar
        if (in_array($table, $preserve_tables)) {
            continue;
        }
        
        // Truncar la tabla
        $conn->exec("TRUNCATE TABLE `$table`");
        $cleaned_tables[] = $table;
    }
    
    // Reactivar restricciones de clave foránea
    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");
    
    // Actualizar respuesta con éxito
    $response['success'] = true;
    $response['message'] = 'Base de datos limpiada correctamente';
    $response['tables_cleaned'] = $cleaned_tables;
    
} catch (Exception $e) {
    // Actualizar respuesta con error
    $response['success'] = false;
    $response['message'] = 'Error: ' . $e->getMessage();
}

// Enviar respuesta JSON
echo json_encode($response);
