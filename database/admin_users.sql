-- Tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- Insertar usuario administrador por defecto (contraseña: admin123)
-- La contraseña está hasheada con password_hash() de PHP usando PASSWORD_DEFAULT
INSERT INTO admin_users (username, password, name, email) 
VALUES ('admin', '$2y$10$qNYnmV7Wqz7hO3Vq7n.JHOxVT3hZm3MxH1cDpVbTm.BiU0S8wFl2e', 'Administrador', 'admin@example.com')
ON DUPLICATE KEY UPDATE id = id;
