<?php 
class BuscaryMostrarSoluciones{
  public $idEquipo;
  public $tipoDeFalla;
  public $descripcionFalla;
  public $resultado;
  public $error;
  public function __construct($conexion){
    if (isset($_POST["EquipoFalla"])) {
      $this->idEquipo = $_POST['EquipoFalla']; 
      $this->tipoDeFalla = $_POST["TipoDeFalla"];
      $this->descripcionFalla = $_POST['FallaDescripcion'];
    }
  }
  public function BuscarSimilares($conexion){
    
    // * Se baja el tipo de equipo (laptop, computadora, impresora, etc)
    $bajar = $conexion->prepare("SELECT equi_nombre FROM equipos WHERE idEquipos = $this->idEquipo");
    $bajar->execute();
    $equipoTipo = $bajar->fetchColumn();

    $bajar = $conexion->prepare("SELECT eq.equi_nombre, an.idAntecedentes, an.ante_falla, an.ante_solucion
    FROM antecedentes an
    INNER JOIN antecedentes_has_equipos anEq
      ON anEq.Antecedentes_idAntecedentes = an.idAntecedentes
    INNER JOIN equipos eq 
      ON eq.idEquipos = anEq.Equipos_idEquipos
    WHERE an.ante_tipo = '$this->tipoDeFalla' AND eq.equi_nombre = '$equipoTipo'
    AND (CASE
        WHEN an.ante_falla = '$this->descripcionFalla' THEN 1
        WHEN an.ante_falla LIKE CONCAT('%', '$this->descripcionFalla', '%') THEN 2
        ELSE 3
        END) IN (1, 2)
    AND (CASE
        WHEN an.ante_falla = '$this->descripcionFalla' THEN 1
        WHEN an.ante_falla LIKE CONCAT('%', '$this->descripcionFalla', '%') THEN 2
        ELSE 3
        END) in (1,2) LIMIT 0,100");

      $bajar->execute();
      $this->resultado = $bajar->fetchAll(PDO::FETCH_ASSOC);

  }


  public function SubirAntecedentes($conexion){
    // * Optener todos los antecedentes en un array
    $antecedentesArray = (isset($_POST['antecedentesID'])) ? $_POST['antecedentesID'] : null;
    $idEquipo = $_POST['idEquipoAntecedente'];
    $nuevaSolucion = ($_POST['solucionNew'] != '')? $_POST['solucionNew'] : null;
    $tipoDeFalla = (isset($_POST['TipoDeFallaNew'])) ? $_POST['TipoDeFallaNew']: null;
    $fallaDescripcionNew = (isset($_POST['FallaDescripcionNew'])) ? $_POST['FallaDescripcionNew']: null;
    // * Bucle para subir los antecedentes
    if ($antecedentesArray != null){
      foreach ($antecedentesArray as $value) {

        $subir = $conexion->prepare("INSERT INTO antecedentes_has_equipos(Antecedentes_idAntecedentes, Equipos_idEquipos) VALUES (:idAntecedente, :idEquipo)");
        $subir->bindParam(":idAntecedente", $value, PDO::PARAM_INT);
        $subir->bindParam(":idEquipo", $idEquipo, PDO::PARAM_INT);
        $subir->execute();
      }
    }
      // * se sube la nueva solucion si es que hay
      
    if($nuevaSolucion != ''){
      $subir= $conexion->prepare("INSERT INTO antecedentes(ante_falla, ante_tipo, ante_solucion) VALUES (:FallaDescrip, :FallaTipo, :FallaSolucion)");
      $subir->bindParam("FallaDescrip", $fallaDescripcionNew, PDO::PARAM_STR);
      $subir->bindParam("FallaTipo", $tipoDeFalla, PDO::PARAM_STR);
      $subir->bindParam("FallaSolucion", $nuevaSolucion, PDO::PARAM_STR);
      $subir->execute();
      

      $bajar= $conexion->prepare("SELECT idAntecedentes FROM antecedentes 
      ORDER BY idAntecedentes desc limit 1");
      $bajar->execute();
      $idNewAntecedente = $bajar->fetchColumn();

      $subir = $conexion->prepare("INSERT INTO antecedentes_has_equipos(Antecedentes_idAntecedentes, Equipos_idEquipos) VALUES (:idAntecedente, :idEquipo)");
        $subir->bindParam(":idAntecedente", $idNewAntecedente, PDO::PARAM_INT);
        $subir->bindParam(":idEquipo", $idEquipo, PDO::PARAM_INT);
        $subir->execute();
    }
    // * se elimina el encargo puesto que ya esta culminado
    $actualizar = $conexion->prepare("UPDATE encargos
    SET en_status = 0 
    WHERE  Equipos_idEquipos = :idEquipo");
    $actualizar->bindParam(":idEquipo", $idEquipo, PDO::PARAM_INT);
    $actualizar->execute();
    if ($tipoDeFalla == "Software") {
      header("location: /ProyectoCompletoUniversidad/Assets/INTERFACES/fallasSoftware.php");
    }else{
      header("location: /ProyectoCompletoUniversidad/Assets/INTERFACES/fallasHardware.php");
    }
  }
}