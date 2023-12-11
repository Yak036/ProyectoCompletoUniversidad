<?php 
class MostrarEncargos{
  public $error;
  public $tablaEncargo;
  public $tablaEncargoAsig;
  public $mejoresTecnicos;
  public $tecnicos;
  public function __construct($conexion){
    try{
      $bajar = $conexion->prepare("SELECT en.idEncargos, u.usu_nombre, u.usu_apellido, e.equi_nombre,e.equi_modelo, f.falla_descripcion, f.falla_tipo, en.en_prioridad, en.fecha_entrada, en.fecha_salida, enca.Encargos_idEncargos from usuarios u
      inner join  clientes c
        ON u.idUsuarios = c.Usuarios_idUsuarios
      inner join equipos e
        on c.idCliente = e.Clientes_Cliente
      Inner Join fallas f
        on e.idEquipos = f.Equipos_idEquipos
      inner join encargos en
        ON e.idEquipos = en.Equipos_idEquipos
      left join tecnicos_has_encargos enca
        on en.idEncargos = enca.Encargos_idEncargos
      where enca.Encargos_idEncargos is null and en_status = 1");

      $bajar->execute();
      $this->tablaEncargo = $bajar->fetchAll(PDO::FETCH_ASSOC);


      $bajar = $conexion->prepare("SELECT en.idEncargos, u.usu_nombre, u.usu_apellido, e.equi_nombre,e.equi_modelo, f.falla_descripcion, f.falla_tipo, en.en_prioridad, usu.usu_nombre as usu_nombreTec, usu.usu_apellido As usu_apellidoTec, en.fecha_entrada, en.fecha_salida, enca.Encargos_idEncargos from usuarios u
      inner join  clientes c
        ON u.idUsuarios = c.Usuarios_idUsuarios
      inner join equipos e
        on c.idCliente = e.Clientes_Cliente
      Inner Join fallas f
        on e.idEquipos = f.Equipos_idEquipos
      inner join encargos en
        ON e.idEquipos = en.Equipos_idEquipos
      left join tecnicos_has_encargos enca
        on en.idEncargos = enca.Encargos_idEncargos
      inner join tecnicos tec
        on enca.Tecnicos_idTecnicos = tec.idTecnicos
      inner join usuarios usu
        on tec.Usuarios_idUsuarios = usu.idUsuarios
      where enca.Encargos_idEncargos is not null and en_status = 1");

      $bajar->execute();
      $this->tablaEncargoAsig = $bajar->fetchAll(PDO::FETCH_ASSOC);
      
      $bajar = $conexion->prepare("SELECT t.idTecnicos, u.usu_nombre, u.usu_apellido from usuarios u 
      inner join tecnicos t
      ON u.idUsuarios = t.Usuarios_idUsuarios");
      $bajar->execute();
      $this->mejoresTecnicos = $bajar->fetchAll(PDO::FETCH_ASSOC);



      
    }catch(PDOException $e){
      $this->error = "Error al mostrar datos Sin asignar: ". $e->getMessage();
    }
  }
}
