-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gastos_app;

-- Usar la base de datos
USE gastos_app;

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de gastos
CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(36) PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATETIME NOT NULL,
  is_income BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías iniciales
INSERT INTO categories (id, name, color, icon) VALUES
  (UUID(), 'Gastos Comunidad Casa', '#10B981', 'home'),
  (UUID(), 'Extras Comunidad Casa', '#F59E0B', 'plus-circle'),
  (UUID(), 'Deuda Comunidad Casa', '#EF4444', 'alert-circle'),
  (UUID(), 'Gastos Comunidad Garaje', '#3B82F6', 'parking-circle'),
  (UUID(), 'Extras Garaje', '#8B5CF6', 'plus-circle'),
  (UUID(), 'Deuda Garaje', '#EC4899', 'alert-circle');
