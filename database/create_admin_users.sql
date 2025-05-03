-- Seleccionar la base de datos correcta
USE gastos_app;

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

-- Insertar usuario administrador personalizado (contraseña: scorpio727)
-- Necesitamos generar un nuevo hash para la contraseña personalizada
INSERT INTO admin_users (username, password, name, email) 
VALUES ('scorpio', '$2y$10$5Oi2mYQZM3bpzpS.XTmrpOF9BmNXf2S1UMCsP8aDWWQYCDkYH/Gle', 'Administrador', 'sonscorpio@gmail.com')
ON DUPLICATE KEY UPDATE id = id;
