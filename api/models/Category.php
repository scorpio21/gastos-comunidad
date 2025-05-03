<?php
class Category {
    // Conexión a la base de datos y nombre de la tabla
    private $conn;
    private $table_name = "categories";

    // Propiedades del objeto
    public $id;
    public $name;
    public $color;
    public $icon;
    public $created_at;

    // Constructor con la conexión a la base de datos
    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todas las categorías
    public function getAll() {
        // Consulta para leer todas las categorías
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY name";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Ejecutar la consulta
        $stmt->execute();
        
        return $stmt;
    }

    // Crear una nueva categoría
    public function create() {
        // Consulta para insertar un registro
        $query = "INSERT INTO " . $this->table_name . " 
                  SET id=:id, name=:name, color=:color, icon=:icon";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar los datos
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->color = htmlspecialchars(strip_tags($this->color));
        $this->icon = htmlspecialchars(strip_tags($this->icon));
        
        // Vincular los valores
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":color", $this->color);
        $stmt->bindParam(":icon", $this->icon);
        
        // Ejecutar la consulta
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Actualizar una categoría
    public function update() {
        // Consulta para actualizar un registro
        $query = "UPDATE " . $this->table_name . " 
                  SET name=:name, color=:color, icon=:icon 
                  WHERE id=:id";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar los datos
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->color = htmlspecialchars(strip_tags($this->color));
        $this->icon = htmlspecialchars(strip_tags($this->icon));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Vincular los valores
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":color", $this->color);
        $stmt->bindParam(":icon", $this->icon);
        $stmt->bindParam(":id", $this->id);
        
        // Ejecutar la consulta
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Eliminar una categoría
    public function delete() {
        // Consulta para eliminar un registro
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar el ID
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Vincular el ID
        $stmt->bindParam(1, $this->id);
        
        // Ejecutar la consulta
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Verificar si una categoría está siendo utilizada por gastos
    public function isUsedByExpenses() {
        // Consulta para verificar si la categoría está siendo utilizada
        $query = "SELECT COUNT(*) as count FROM expenses WHERE category = (SELECT name FROM " . $this->table_name . " WHERE id = ?)";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Vincular el ID
        $stmt->bindParam(1, $this->id);
        
        // Ejecutar la consulta
        $stmt->execute();
        
        // Obtener el resultado
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Si count > 0, la categoría está siendo utilizada
        return $row['count'] > 0;
    }

    // Leer una categoría específica
    public function getOne() {
        // Consulta para leer un registro específico
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Vincular el ID
        $stmt->bindParam(1, $this->id);
        
        // Ejecutar la consulta
        $stmt->execute();
        
        // Obtener el registro
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Establecer los valores a las propiedades del objeto
        if($row) {
            $this->name = $row['name'];
            $this->color = $row['color'];
            $this->icon = $row['icon'];
            $this->created_at = $row['created_at'];
            return true;
        }
        
        return false;
    }
}
?>
