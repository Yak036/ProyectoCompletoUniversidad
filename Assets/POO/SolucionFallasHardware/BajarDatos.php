<?php
class BajarEquiposDisponibles{
  public $error ;
  public $equiposEncargos;
  public function __construct($conexion){
    $bajar = $conexion->prepare("SELECT e.idEncargos, eq.idEquipos, eq.equi_modelo, eq.equi_nombre from encargos e 
    INNER JOIN equipos eq
      ON e.Equipos_idEquipos = eq.idEquipos
    INNER JOIN encargos en 
      ON en.Equipos_idEquipos = eq.idEquipos
    INNER JOIN tecnicos_has_encargos tecEn
      ON tecEn.Encargos_idEncargos = en.idEncargos and en.en_status = 1");
    $bajar->execute();

    $this->equiposEncargos = $bajar->fetchAll(PDO::FETCH_ASSOC);
  }
}