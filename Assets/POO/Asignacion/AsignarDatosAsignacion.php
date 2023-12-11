<?php
class AsignarTecnico{
  public $error;
  public function __construct($conexion){
    try{
      $idEncargo = $_POST["AsignarTec"];
      $idTecnico = $_POST["Tecnico"];
      $subir = $conexion->prepare("INSERT into tecnicos_has_encargos(Tecnicos_idTecnicos, Encargos_idEncargos) VALUES (:idTecnico, :idEncargo)");
      $subir->bindParam(":idTecnico", $idTecnico,PDO::PARAM_INT);
      $subir->bindParam(":idEncargo",$idEncargo,PDO::PARAM_INT);
      $subir->execute();
  
      header("location: /ProyectoCompletoUniversidad/Assets/INTERFACES/Asignacion.php");
  
    }catch(PDOException $e){
      $this->error = "Error al subir datos ". $e->getMessage();
      return $this->error;
    }
  }

}

class EditarAsignacionTecnico{
  public $error;
  public function __construct($conexion){
    try{
      $idEncargo = $_POST["idEncargoActualizar"];
      $idNewTec = $_POST["newTecEncargo"];

      $actualizar = $conexion->prepare("UPDATE tecnicos_has_encargos
      set Tecnicos_idTecnicos = :idNewTec
      WHERE Encargos_idEncargos = :idEncargo");
      $actualizar->bindParam(":idNewTec",$idNewTec,PDO::PARAM_STR);
      $actualizar->bindParam(":idEncargo",$idEncargo,PDO::PARAM_STR);
      $actualizar->execute();

      header("location: /ProyectoCompletoUniversidad/Assets/INTERFACES/Asignacion.php");
    }catch(PDOException $e){
      $this->error = "Error al editar los datos ". $e->getMessage();
    }  
  }
}


?>