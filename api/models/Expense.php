<?php
class Expense {
    // Conexión a la base de datos y nombre de la tabla
    private $conn;
    private $table_name = "expenses";

    // Propiedades del objeto
    public $id;
    public $amount;
    public $description;
    public $category;
    public $date;
    public $is_income;
    public $created_at;

    // Constructor con la conexión a la base de datos
    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todos los gastos con filtros opcionales
    public function getAll($filters = []) {
        // Consulta base
        $query = "SELECT * FROM " . $this->table_name . " WHERE 1=1";
        $params = [];
        
        // Aplicar filtros si existen
        if (isset($filters['startDate']) && $filters['startDate']) {
            $query .= " AND date >= ?";
            $params[] = $filters['startDate'];
        }
        
        if (isset($filters['endDate']) && $filters['endDate']) {
            $query .= " AND date <= ?";
            $params[] = $filters['endDate'];
        }
        
        if (isset($filters['category']) && $filters['category']) {
            $query .= " AND category = ?";
            $params[] = $filters['category'];
        }
        
        if (isset($filters['type']) && $filters['type'] !== 'all') {
            if ($filters['type'] === 'income') {
                $query .= " AND is_income = 1";
            } else if ($filters['type'] === 'expense') {
                $query .= " AND is_income = 0";
            }
        }
        
        // Ordenar por fecha (más reciente primero)
        $query .= " ORDER BY date DESC";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Vincular parámetros si existen
        for ($i = 0; $i < count($params); $i++) {
            $stmt->bindParam($i + 1, $params[$i]);
        }
        
        // Ejecutar la consulta
        $stmt->execute();
        
        return $stmt;
    }

    // Crear un nuevo gasto
    public function create() {
        // Consulta para insertar un registro
        $query = "INSERT INTO " . $this->table_name . " 
                  SET id=:id, amount=:amount, description=:description, category=:category, date=:date, is_income=:is_income";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar los datos
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->amount = htmlspecialchars(strip_tags($this->amount));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->date = htmlspecialchars(strip_tags($this->date));
        
        // Vincular los valores
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":amount", $this->amount);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":is_income", $this->is_income, PDO::PARAM_BOOL);
        
        // Ejecutar la consulta
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Actualizar un gasto existente
    public function update() {
        // Consulta para actualizar un registro
        $query = "UPDATE " . $this->table_name . " 
                  SET amount=:amount, description=:description, category=:category, date=:date, is_income=:is_income 
                  WHERE id=:id";
        
        // Preparar la consulta
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar los datos
        $this->amount = htmlspecialchars(strip_tags($this->amount));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Vincular los valores
        $stmt->bindParam(":amount", $this->amount);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":is_income", $this->is_income, PDO::PARAM_BOOL);
        $stmt->bindParam(":id", $this->id);
        
        // Ejecutar la consulta
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Eliminar un gasto
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

    // Leer un gasto específico
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
            $this->amount = $row['amount'];
            $this->description = $row['description'];
            $this->category = $row['category'];
            $this->date = $row['date'];
            $this->is_income = $row['is_income'];
            $this->created_at = $row['created_at'];
            return true;
        }
        
        return false;
    }
}
?>
