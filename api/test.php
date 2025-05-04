<?php
// Archivo de prueba para verificar la conectividad con la API
header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'message' => 'La API está funcionando correctamente',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
