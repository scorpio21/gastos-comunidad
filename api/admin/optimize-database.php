<?php
// Incluir configuración y conexión a la base de datos
require_once '../config.php';

// Configurar cabeceras para respuesta JSON
header('Content-Type: application/json');

try {
    // Usar la función de conexión definida en config.php
    $conn = getConnection();
    
    // Si la conexión falló, lanzar una excepción
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }
    
    // Obtener todas las tablas de la base de datos
    $tables_result = $conn->query("SHOW TABLES");
    $tables = $tables_result->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) === 0) {
        throw new Exception("No se encontraron tablas en la base de datos");
    }
    
    // Optimizar cada tabla
    $optimizedTables = [];
    $failedTables = [];
    
    // Usar transacción para asegurar consistencia
    $conn->beginTransaction();
    
    try {
        foreach ($tables as $table) {
            try {
                // Intentar optimizar la tabla
                $optimize_result = $conn->query("OPTIMIZE TABLE `$table`");
                
                if ($optimize_result !== false) {
                    $optimizedTables[] = $table;
                } else {
                    $failedTables[] = $table;
                }
            } catch (PDOException $tableEx) {
                // Si falla una tabla, continuar con las demás
                $failedTables[] = $table;
            }
        }
        
        // Confirmar transacción
        $conn->commit();
    } catch (Exception $e) {
        // Revertir transacción en caso de error
        $conn->rollBack();
        throw $e;
    }
    
    // Con PDO no es necesario cerrar explícitamente las conexiones
    // Se cierran automáticamente cuando las variables salen del ámbito
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => count($failedTables) > 0 ? 'Base de datos optimizada parcialmente' : 'Base de datos optimizada correctamente',
        'tables_optimized' => $optimizedTables,
        'tables_failed' => $failedTables,
        'total_optimized' => count($optimizedTables),
        'total_failed' => count($failedTables)
    ]);
    
} catch (Exception $e) {
    // Respuesta de error
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
