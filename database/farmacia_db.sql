CREATE DATABASE IF NOT EXISTS farmacia_db;

USE farmacia_db;


-- TABLA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);


-- TABLA DE MEDICAMENTOS
CREATE TABLE IF NOT EXISTS medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    fecha_vencimiento DATE NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
);


-- TABLA DE EMPLEADOS
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    cargo VARCHAR(100) NOT NULL
);


-- 5 CATEGORIAS
INSERT IGNORE INTO categorias (id, nombre, descripcion) VALUES
(1, 'Analgesicos', 'Medicamentos para aliviar el dolor'),
(2, 'Antibioticos', 'Medicamentos para infecciones bacterianas'),
(3, 'Antialergicos', 'Medicamentos para tratar alergias'),
(4, 'Vitaminas', 'Vitaminas y suplementos'),
(5, 'Antisepticos', 'Productos para desinfeccion');


-- 10 MEDICAMENTOS
INSERT IGNORE INTO medicamentos
(id, nombre, descripcion, precio, stock, fecha_vencimiento, categoria_id)
VALUES
(1, 'Paracetamol 500 mg', 'Comprimidos', 1500.00, 50, '2028-05-31', 1),
(2, 'Ibuprofeno 400 mg', 'Comprimidos', 2300.00, 35, '2027-11-30', 1),
(3, 'Dipirona 500 mg', 'Comprimidos', 1800.00, 20, '2028-02-29', 1),
(4, 'Amoxicilina 500 mg', 'Capsulas', 4200.00, 25, '2027-09-30', 2),
(5, 'Azitromicina 500 mg', 'Comprimidos', 6500.00, 15, '2027-12-31', 2),
(6, 'Loratadina 10 mg', 'Comprimidos', 1900.00, 40, '2028-03-31', 3),
(7, 'Cetirizina 10 mg', 'Comprimidos', 2100.00, 30, '2028-06-30', 3),
(8, 'Vitamina C 1 g', 'Comprimidos', 3200.00, 22, '2028-10-31', 4),
(9, 'Complejo B', 'Comprimidos', 3800.00, 18, '2028-08-31', 4),
(10, 'Clorhexidina 0.12%', 'Solucion antiseptica', 2500.00, 12, '2027-10-31', 5);


-- 5 EMPLEADOS
INSERT IGNORE INTO empleados
(id, nombre, apellido, dni, email, cargo)
VALUES
(1, 'Ana', 'Gomez', '30000111', 'ana.gomez@example.com', 'Farmaceutica'),
(2, 'Juan', 'Perez', '30000222', 'juan.perez@example.com', 'Vendedor'),
(3, 'Laura', 'Diaz', '30000333', 'laura.diaz@example.com', 'Cajera'),
(4, 'Carlos', 'Lopez', '30000444', 'carlos.lopez@example.com', 'Repositor'),
(5, 'Sofia', 'Torres', '30000555', 'sofia.torres@example.com', 'Administrativa');