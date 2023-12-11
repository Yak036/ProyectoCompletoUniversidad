<?php
class BaseDeDatos{
  // ! La variable privada conexión es la que llevara en si el puente que permita a otros archivos acceder a la base de datos
  private $conexion;
  public $estado;
  // ! El constructo de un objeto es aquel que siempre se ejecuta cuando llames a su clase en otro archivo
  public function __construct($host, $dbname, $usuario, $clave){
    // ! Dentro del constructo de este objeto se recibe el nombre de la base de datos, usuario y clave para poder conectar 
    $dsn = "mysql:host=$host;dbname=$dbname";
    $opciones = array(
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_EMULATE_PREPARES => false,
    );
    try{
      $this->conexion = new PDO($dsn, $usuario, $clave, $opciones);
      $this->estado = "Conexion exitosa";
    }catch(PDOException $e){
      $this->estado = "Error de conexion: " . $e->getMessage();
    }
  }

  public function obtenerConexion(){
    return $this->conexion;
  }
}



?>