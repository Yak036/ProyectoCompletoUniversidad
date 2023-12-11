<?php
 class EliminarEncargo{
  public $error;
  public function __construct($conexion){
    $idEncargo = $_GET["AsignarTec"];

    // Bajar el id del equipo que tiene ese encargo
    $bajar = $conexion->prepare("SELECT eq.idEquipos FROM encargos en
    INNER JOIN equipos eq
      ON en.Equipos_idEquipos = eq.idEquipos
    WHERE en.idEncargos = :idEncargo");
    $bajar->bindParam(':idEncargo', $idEncargo, PDO::PARAM_INT);
    $bajar->execute();
    $idEquipo = $bajar->fetchColumn();

    // Eliminar el encargo
    $eliminar = $conexion->prepare("DELETE FROM encargos WHERE idEncargos = :idEncargo");
    $eliminar->bindParam(':idEncargo', $idEncargo, PDO::PARAM_INT);
    $eliminar->execute();
    
    // Eliminar la falla que tenía el equipo en ese encargo
    $eliminar = $conexion->prepare("DELETE FROM fallas WHERE Equipos_idEquipos = :idEquipo");
    $eliminar->bindParam(':idEquipo', $idEquipo, PDO::PARAM_INT);
    $eliminar->execute();

    header("location: /ProyectoCompletoUniversidad/Assets/INTERFACES/Asignacion.php");
  }
}


?>