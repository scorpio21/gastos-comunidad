<?php
// Este archivo sirve como punto de entrada para el servidor PHP
// Redirige todas las solicitudes que no son de la API al index.html para que React Router pueda manejarlas

// Si la solicitud es para la API, dejar que el servidor la maneje normalmente
if (strpos($_SERVER['REQUEST_URI'], '/api/') === 0) {
    return false;
}

// Servir el archivo index.html para todas las demás rutas
$indexFile = __DIR__ . '/index.html';

if (file_exists($indexFile)) {
    echo file_get_contents($indexFile);
} else {
    http_response_code(404);
    echo "No se encontró el archivo index.html";
}
?>
