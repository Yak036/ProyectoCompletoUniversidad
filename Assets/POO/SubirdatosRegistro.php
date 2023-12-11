<?php 
  class SubirDatosUsuario{
    public $error;
    // ! este constructo recibe la conexion para poder subir los datos
    public function __construct($conexion){
      try{
        
      // ! luego recibe las variables q se enviaron desde el formulario por metodo post si estas existen se les da su valor, si no seran NULAS
      $apellidoUsu = isset($_POST["apellidos"]) ? ucfirst($_POST["apellidos"]) : null;
      $nombreUsu = isset($_POST["nombres"]) ? ucfirst($_POST["nombres"]) : null;
      $cedulaUsu = isset($_POST["cedula"]) ? $_POST["cedula"] : null;
      $usuGmail = $_POST["correo"];
      $usuTelefono = isset($_POST["telefono"]) ? $_POST["telefono"] : null;
      // ! al ser las especialidades varias estas se reciben como un objeto el cual nosotros convertiremos en un array

      $tecEspe = json_decode($_POST["especialidades"],true);

      // TODO: Subimos los datos de usuario
      $subir = $conexion->prepare("INSERT INTO usuarios(usu_nombre, usu_apellido, usu_cedula, usu_gmail, usu_telefono) VALUES
      (:nombre, :apellido, :cedula, :gmail, :telefono)");
      $subir->bindParam(":apellido",$apellidoUsu, PDO::PARAM_STR);
      $subir->bindParam(":nombre",$nombreUsu, PDO::PARAM_STR);
      $subir->bindParam(":cedula",$cedulaUsu, PDO::PARAM_INT);
      $subir->bindParam(":gmail",$usuGmail, PDO::PARAM_STR);
      $subir->bindParam(":telefono",$usuTelefono, PDO::PARAM_INT);
      $subir->execute();
 
      // * Bajamos los datos del usuario q se acaba de subir y lo convertimos en tecnico
      $bajar = $conexion->prepare("SELECT MAX(idUsuarios) as id FROM usuarios");
      $bajar->execute();
      $fila = $bajar->fetch(PDO::FETCH_ASSOC);

      $NewUsuId = $fila["id"];

      // * lo Convertimos en tecnico
      $subir = $conexion->prepare("INSERT INTO tecnicos(Usuarios_idUsuarios, tec_estado) VALUES (:NewUsuId, :estado)");
      $subir->bindParam(":NewUsuId", $NewUsuId, PDO::PARAM_INT);
      $subir->bindValue(":estado", 1, PDO::PARAM_STR);
      $subir->execute();
      // * obtenemos el id del tecnico que acaba de crearse
      $bajar = $conexion->prepare("SELECT MAX(idTecnicos) as id FROM tecnicos");
      $bajar->execute();
      $fila = $bajar->fetch(PDO::FETCH_ASSOC);

      $NewTecId = $fila["id"];
      
      // TODO: Ahora subimos las especialidades del nuevo tecnico

      foreach ($tecEspe as $valor) {
        $bajar = $conexion->prepare("SELECT * FROM especialidades");
        $bajar->execute();
        $encontrado = false;
        while ($fila = $bajar->fetch(PDO::FETCH_ASSOC)){
          if ($fila["espe_nombre"] == $valor["value"]) {
            // * si se encuentra una especialidad igual a la q esta en la base de datos entonces se baja su ID
            $bajar = $conexion->prepare("SELECT * from especialidades WHERE espe_nombre = :nombreEspecialidad");
            $bajar->bindParam(":nombreEspecialidad", $fila["espe_nombre"], PDO::PARAM_STR);
            $bajar->execute();
            $fila = $bajar->fetch(PDO::FETCH_ASSOC);
            // * se agrega dentro de una variable
            $idEspecialidad = $fila["idEspecialidades"];
            $subir = $conexion->prepare("INSERT INTO tecnicos_has_especialidades(Tecnicos_idTecnicos,   Especialidades_idEspecialidades) VALUES (:idTecnico, :idEspecialidad)");
            $subir->bindParam(":idTecnico",$NewTecId,PDO::PARAM_INT);
            $subir->bindParam(":idEspecialidad",$idEspecialidad,PDO::PARAM_INT);
            $subir->execute();
            $encontrado = true;
            break;
          }
        }
        if(!$encontrado){
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
          $subir->bindParam(":idTecnico",$NewTecId,PDO::PARAM_INT);
          $subir->bindParam(":idEspecialidad",$NewEspeId,PDO::PARAM_INT);
          $subir->execute();
          
        }
      
      }
      header("location: /ProyectoCompletoUniversidad/Registro.php");

    }catch(PDOException $e){
      $this->error = "Error al subir datos ". $e->getMessage();
    }
    }
  }
?>