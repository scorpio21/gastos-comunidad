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
    
    // Definir fecha límite (1 año atrás)
    $fecha_limite = date('Y-m-d', strtotime('-1 year'));
    
    // Comprobar si la tabla existe
    $table_check = $conn->query("SHOW TABLES LIKE 'transactions'");
    $transactions_exists = $table_check->rowCount() > 0;
    
    $table_check2 = $conn->query("SHOW TABLES LIKE 'expenses'");
    $expenses_exists = $table_check2->rowCount() > 0;
    
    $rows_affected = 0;
    
    // Eliminar transacciones antiguas de la tabla transactions si existe
    if ($transactions_exists) {
        $stmt = $conn->prepare("DELETE FROM transactions WHERE date < ?");
        $stmt->execute([$fecha_limite]);
        $rows_affected += $stmt->rowCount();
    }
    
    // Eliminar transacciones antiguas de la tabla expenses si existe
    if ($expenses_exists) {
        $stmt2 = $conn->prepare("DELETE FROM expenses WHERE date < ?");
        $stmt2->execute([$fecha_limite]);
        $rows_affected += $stmt2->rowCount();
    }
    
    // El número de filas afectadas ya se ha calculado en los pasos anteriores
    
    // Con PDO no es necesario cerrar explícitamente las conexiones
    // Se cierran automáticamente cuando las variables salen del ámbito
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Transacciones antiguas eliminadas correctamente',
        'count' => $rows_affected
    ]);
    
} catch (Exception $e) {
    // Respuesta de error
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
