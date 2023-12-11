<?php

class BajarTecnicos
{
  public $tabla;
  public $error;
  public function __construct($conexion)
  {
    try {
      $bajar = $conexion->prepare("SELECT
          u.idUsuarios,
          u.usu_apellido,
          u.usu_nombre,
          u.usu_cedula,
          u.usu_telefono,
          u.usu_gmail,
          GROUP_CONCAT(e.espe_nombre SEPARATOR ', ') AS especialidades
          FROM
              usuarios u
          INNER JOIN tecnicos t
          ON u.idUsuarios = t.Usuarios_idUsuarios
          INNER JOIN tecnicos_has_especialidades esp
          ON t.idTecnicos = esp.Tecnicos_idTecnicos
          INNER JOIN especialidades e
          ON esp.Especialidades_idEspecialidades = e.idEspecialidades
          where t.tec_estado = 1
          GROUP BY u.idUsuarios;
        ");
      $bajar->execute();

      $this->tabla = $bajar->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      $this->error = "Error al subir datos " . $e->getMessage();
    }
  }
}

class EliminarTecnicos
{
  public $error;
  public function __construct($conexion)
  {
    try {
      $idUsuarioEliminar = $_POST['idUsuarioEliminar'];

      $idUsuarioEliminar = $_POST['idUsuarioEliminar'];

      // * Se optiene el id del tecnico q se esta eliminando para otras tablas
      $bajar = $conexion->prepare("SELECT * from tecnicos WHERE Usuarios_idUsuarios = $idUsuarioEliminar");
      $bajar->execute();

      $idTecnicoEliminar = $bajar->fetchColumn();


      // * 2: de la tabla tecnicos
      $Actualizar = $conexion->prepare("UPDATE tecnicos 
      set tec_estado = 0
      where idTecnicos = $idTecnicoEliminar");
      $Actualizar->execute();

      // * 4: De la tabla Tecnicos_has_Encargos
      $eliminar = $conexion->prepare("DELETE FROM tecnicos_has_encargos WHERE Tecnicos_idTecnicos = $idTecnicoEliminar");
      $eliminar->execute();

      header("location: /ProyectoCompletoUniversidad/Registro.php");
    } catch (PDOException $e) {
      $this->error = "Error al subir datos " . $e->getMessage();
    }
  }
}

class EditarTecnico
{
  public $error;
  public function __construct($conexion)
  {
    try {
      $idUsuario = $_POST['idUsuarioOculto'];
      $newApellido = ucfirst($_POST['editApellido']);
      $newNombre = ucfirst($_POST['editNombre']);
      $newCedula = $_POST['editACedula'];
      $newTelefono = $_POST["editTelefono"];
      $newGmail = $_POST['editGmail'];
      $newEspe = json_decode($_POST['editEspe'], true);

      // * editamos
      $Actualizar = $conexion->prepare("UPDATE usuarios SET usu_apellido = :apellido, usu_nombre = :nombre, usu_cedula = :cedula, usu_gmail = :gmail, usu_telefono = :telefono WHERE idUsuarios = :idUsuario");
      $Actualizar->bindParam(':apellido', $newApellido, PDO::PARAM_STR);
      $Actualizar->bindParam(':nombre', $newNombre, PDO::PARAM_STR);
      $Actualizar->bindParam(':cedula', $newCedula, PDO::PARAM_INT);
      $Actualizar->bindParam(':gmail', $newGmail, PDO::PARAM_STR);
      $Actualizar->bindParam(':telefono', $newTelefono, PDO::PARAM_INT);
      $Actualizar->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
      $Actualizar->execute();

      // TODO: Ahora lo dificil, Actualizar las Especialidades

      // * Se optiene el id del tecnico q se esta editando para otras tablas
      $bajar = $conexion->prepare("SELECT * from tecnicos WHERE Usuarios_idUsuarios = :idUsuario");
      $bajar->bindParam(":idUsuario", $idUsuario, PDO::PARAM_INT);
      $bajar->execute();
      $idTecnico = $bajar->fetch(PDO::FETCH_ASSOC);

      // * 3: De la tabla Tecnicos_has_Especialidades
      $eliminar = $conexion->prepare("DELETE FROM tecnicos_has_especialidades WHERE Tecnicos_idTecnicos = :idTecnicoEliminar");
      $eliminar->bindParam(":idTecnicoEliminar", $idTecnico['idTecnicos'], PDO::PARAM_INT);
      $eliminar->execute();



      foreach ($newEspe as $valor) {
        $bajar = $conexion->prepare("SELECT * FROM especialidades");
        $bajar->execute();
        $encontrado = false;
        while ($fila = $bajar->fetch(PDO::FETCH_ASSOC)) {
          if ($fila["espe_nombre"] == $valor["value"]) {
            // * si se encuentra una especialidad igual a la q esta en la base de datos entonces se baja su ID
            $bajar = $conexion->prepare("SELECT * from especialidades WHERE espe_nombre = :nombreEspecialidad");
            $bajar->bindParam(":nombreEspecialidad", $fila["espe_nombre"], PDO::PARAM_STR);
            $bajar->execute();
            $fila = $bajar->fetch(PDO::FETCH_ASSOC);
            // * se agrega dentro de una variable
            $idEspecialidad = $fila["idEspecialidades"];
            $subir = $conexion->prepare("INSERT INTO tecnicos_has_especialidades(Tecnicos_idTecnicos,   Especialidades_idEspecialidades) VALUES (:idTecnico, :idEspecialidad)");
            $subir->bindParam(":idTecnico", $idTecnico['idTecnicos'], PDO::PARAM_INT);
            $subir->bindParam(":idEspecialidad", $idEspecialidad, PDO::PARAM_INT);
            $subir->execute();
            $encontrado = true;

            break;
          }
        }
        if (!$encontrado) {
          //* SI no se encuentra esa especialidad en la base de datos entonces SE AGREGA VAMO
          $subir = $conexion->prepare("INSERT INTO especialidades(espe_nombre) VALUES (:especialidadNombre)");
          $subir->bindParam(":especialidadNombre", $valor["value"], PDO::PARAM_STR);
          $subir->execute();
          // * luego de subir la nueva especialidad se obtiene su id para agregarsela al TECNICO
          $bajar = $conexion->prepare("SELECT MAX(idEspecialidades) as id FROM especialidades");
          $bajar->execute();
          $fila = $bajar->fetch(PDO::FETCH_ASSOC);

          $NewEspeId = $fila['id'];
          //* Ahora que tenemos el id de la nueva especialidad solo queda agregarsela al tecnico

          $subir = $conexion->prepare("INSERT INTO tecnicos_has_especialidades(Tecnicos_idTecnicos,   Especialidades_idEspecialidades) VALUES (:idTecnico, :idEspecialidad)");
          $subir->bindParam(":idTecnico", $idTecnico['idTecnicos'], PDO::PARAM_INT);
          $subir->bindParam(":idEspecialidad", $NewEspeId, PDO::PARAM_INT);
          $subir->execute();
        }
      }
      header("location: /ProyectoCompletoUniversidad/Registro.php");
    } catch (PDOException $e) {
      $this->error = "Error al subir datos " . $e->getMessage();
    }
  }
}
