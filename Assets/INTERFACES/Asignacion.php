<?php
// TODO: CONEXION
require('../POO/conexion.php');
require('../POO/Asignacion/MostrarDatosAsignacion.php');
require('../POO/Asignacion/AsignarDatosAsignacion.php');
require('../POO/Asignacion/EliminarDatosAsignacion.php');

// * hacer Coneccion
$host="localhost";
$dbname="serviciotecnico";
$usuario="root";
$password='09112003aDxDGokuwily.';
// * crear la nueva clase
$conexionInpura = new BaseDeDatos($host,$dbname,$usuario,$password);
// * obtener la conexion directa e una variable por comodidad
$conexion = $conexionInpura->obtenerConexion();

if ($conexion) {
  $MostrarEncargos= new MostrarEncargos($conexion);
  $TablaSinAsignar = $MostrarEncargos->tablaEncargo; 
  $TablaAsignados = $MostrarEncargos->tablaEncargoAsig;
  $MejoresTecnicos = $MostrarEncargos->mejoresTecnicos;
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
  if (isset($_POST['Tecnico']) && $_POST["Tecnico"] != "ninguno") {
    $AsignarEncargo = new AsignarTecnico($conexion);
  }
  elseif(isset($_POST["newTecEncargo"])){
    $ActualizarEncargo = new EditarAsignacionTecnico($conexion);
  }
}
elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
  if (isset($_GET["AsignarTec"])) {
    $EliminarEncargo = new EliminarEncargo($conexion);
  }
  
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asignar Encargo</title>

    <link rel="stylesheet" href="/ProyectoCompletoUniversidad/node_modules/bootstrap/dist/css/bootstrap.min.css">

    <link rel="stylesheet" href="../CSS/asignacionStyle.css">
    <link rel="shortcut icon" href="/ProyectoCompletoUniversidad/Assets/MEDIA/img/LOGO.ico" type="image/x-icon">
</head>
<body>

<nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand text-black" href="#">IUJO</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active text-black" aria-current="page" href="#">Inicio</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-black" href="/ProyectoCompletoUniversidad/Registro.php">Actualización de Técnicos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-black" href="/ProyectoCompletoUniversidad/Assets/INTERFACES/Asignacion.php">Asignación de Encargos</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-black" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Detección y solución de fallas
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item text-black" href="/ProyectoCompletoUniversidad/Assets/INTERFACES/fallasHardware.php">Hardware</a></li>
                  <li><a class="dropdown-item text-black" href="/ProyectoCompletoUniversidad/Assets/INTERFACES/fallasSoftware.php">SoftWare</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    <div class="bandeja-encargo">
            <div class="asignados-sinAsignar sinAsignar">
                <h1>Encargos sin asignar</h1>
                <!-- Button trigger modal -->

                <div class="encargos-container">
                <?php 
                $i = 0;
                foreach($TablaSinAsignar as $fila) {
                  ?>
                  <div class="encargo sinAsignados" data-bs-toggle="modal" data-bs-target="#exampleModal<?php echo $i ?>">
                    <div class="campo-info">
                      <h2 class="title_encargo">Encargo N°: <?php echo $fila["idEncargos"] ?></h2>
                      <div class="compo_data_container">
                        <p class="campo">Cliente:</p><p class="data"><?php echo $fila["usu_nombre"] ?></p></p> 
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Equipo:</p><p class="data"> <?php echo $fila["equi_nombre"]?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Modelo:</p><p class="data modelo"> <?php echo $fila["equi_modelo"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Descripción de la Falla: </p><p class="data"> <?php echo $fila["falla_descripcion"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Tipo:</p><p class="data"> <?php echo $fila["falla_tipo"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Prioridad:</p><p class="data"> <?php echo $fila["en_prioridad"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Tecnico:<p class="data tecnicoEncar">Ninguno</p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Fecha de entrada:<p class="data"> <?php echo $fila["fecha_entrada"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Estimacion de salida:<p class="data"> <?php echo $fila["fecha_salida"] ?></p>
                      </div>
                    </div>
                  </div>
                <!-- Modal -->
                <div class="modal fade" id="exampleModal<?php echo $i ?>" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Encargo N°: <?php echo $fila["idEncargos"] ?></h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <form action="<?php $_SERVER["PHP_SELF"]?>" method="post">
                        <div class="modal-body">
                        <div class="row d-flex justify-content-center align-items-center">
                          <input type="hidden" name="AsignarTec" value="<?php echo $fila["idEncargos"] ?>">
                          <div class="col-sm-6">
                            <label for="inputText5" class="form-label">Cliente:</label>
                            <input type="text" id="inputText5" class="form-control" value="<?php echo $fila["usu_nombre"]." ".$fila["usu_apellido"] ?>" disabled>
                          </div>
                          <div class="col-sm-6">
                          <label for="inputText5" class="form-label">Equipo:</label>
                          <input type="text" id="inputText5" class="form-control" value ="<?php echo $fila["equi_nombre"] ." (". $fila["equi_modelo"] . ")"?>" disabled>
                          </div>
                          <div class="form-floating">
                            <textarea class="form-control mt-3" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"  disabled ><?php echo $fila["falla_descripcion"] ?></textarea>
                            <label for="floatingTextarea2 mt-3">Descripcion de la Falla</label>
                          </div>
                          <div class="col-sm-3">
                            <label for="inputText5" class="form-label">Tipo:</label>
                            <input type="text" id="inputText5" class="form-control" value="<?php echo $fila["falla_tipo"] ?>" disabled>
                          </div>
                          <div class="col-sm-3">
                            <label for="inputText5" class="form-label">Prioridad:</label>
                            <input type="text" id="inputText5" class="form-control" value="<?php echo $fila["en_prioridad"] ?>" disabled>
                          </div>
                          <div class="form-floating mt-2">
                            <select name="Tecnico" class="form-select" id="floatingSelect" aria-label="Floating label select example">
                              <option selected value="ninguno">Seleccione un Tecnico</option>
                              <?php foreach ($MejoresTecnicos as $filaTec) { ?>
                                <option value="<?php echo $filaTec['idTecnicos'] ?>"><?php echo $filaTec["usu_nombre"]." ". $filaTec["usu_apellido"]; ?></option>
                              <?php } ?>
                            </select>
                            <label for="floatingSelect">Mejores Opciones</label>
                          </div>
                          <div class="col-sm-3">
                            <label for="inputText5" class="form-label">Fecha de entrada: </label>
                            <input type="text" id="inputText5" class="form-control" value="<?php echo $fila["fecha_entrada"] ?>" disabled>
                          </div>
                          <div class="col-sm-3">
                            <label for="inputText5" class="form-label">Fecha de salida: </label>
                            <input type="text" id="inputText5" class="form-control" value="<?php echo $fila["fecha_salida"] ?>" disabled>
                          </div>
                        
                        </div>
                        <div class="modal-footer">
                          <button type="submit" class="btn btn-danger" data-bs-dismiss="modal"  formmethod="get">Borrar Encargo</button>
                          <button type="submit" class="btn guardar">Guardar Cambios</button>
                        </div>
                      </div>
                      </form>
                    </div>
                  </div>
                </div>
              <?php $i+= 1;} ?>
                  
              </div>
            </div>
            <div class="asignados-sinAsignar asignados">
            <h1>Encargos asignados</h1>
            <div class="encargos-container">
            <?php
              $e = 0;
              foreach($TablaAsignados as $fila) {
                  ?>
              <div class="encargo asignados" data-bs-toggle="modal" data-bs-target="#exampleModal2<?php echo $e ?>">
                  <div class="campo-info">
                  <h2 class="title_encargo">Encargo N°: <?php echo $fila["idEncargos"] ?></h2>
                      <div class="compo_data_container">
                        <p class="campo">Cliente:</p><p class="data"><?php echo $fila["usu_nombre"] ?></p></p> 
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Equipo:</p><p class="data"> <?php echo $fila["equi_nombre"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Modelo:</p><p class="data modelo"> <?php echo $fila["equi_modelo"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Descripción de la Falla: </p><p class="data"> <?php echo $fila["falla_descripcion"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Tipo:</p><p class="data"> <?php echo $fila["falla_tipo"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Prioridad:</p><p class="data"> <?php echo $fila["en_prioridad"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Tecnico:<p class="data tecnicoEncarnone"><?php echo $fila["usu_nombreTec"]?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Fecha de entrada:<p class="data"> <?php echo $fila["fecha_entrada"] ?></p>
                      </div>
                      <div class="compo_data_container">
                        <p class="campo">Estimacion de salida:<p class="data"> <?php echo $fila["fecha_salida"]  ?></p>
                      </div>
                </div>
                
              </div>
              <!-- Modal -->
              <div class="modal fade" id="exampleModal2<?php echo $e ?>" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Encargo N°: <?php echo $fila["idEncargos"] ?></h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <form action="<?php $_SERVER["PHP_SELF"]?>" method="post">
                      <div class="modal-body">
                      <div class="row d-flex justify-content-center align-items-center">
                      <input type="hidden" name="AsignarTec" value="<?php echo $fila["idEncargos"] ?>">
                        <input type="hidden" name="idEncargoActualizar" value="<?php echo $fila["idEncargos"] ?>">
                        <div class="col-sm-6">
                          <label for="inputText5" class="form-label">Cliente:</label>
                          <input type="text" id="inputText5" class="form-control" value="<?php echo $fila["usu_nombre"]." ".$fila["usu_apellido"] ?>" disabled>
                        </div>
                        <div class="col-sm-6">
                          <label for="inputText5" class="form-label">Equipo:</label>
                          <input type="text" id="inputText5" class="form-control" value ="<?php echo $fila["equi_nombre"]." (". $fila["equi_modelo"] . ")" ?>" disabled>
                        </div>
                          <div class="form-floating">
                            <textarea class="form-control mt-3" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"  disabled ><?php echo $fila["falla_descripcion"] ?></textarea>
                            <label for="floatingTextarea2">Descripcion de la Falla</label>
                          </div>
                        <div class="col-sm-3">
                          <label for="inputText5" class="form-label">Tipo:</label>
                          <input type="text" id="inputText5" class="form-control" value="<?php echo $fila["falla_tipo"] ?>" disabled>
                        </div>
                        <div class="col-sm-3">
                          <label for="inputText5" class="form-label">Prioridad:</label>
                          <input type="text" id="inputText5" class="form-control" value="<?php echo $fila["en_prioridad"] ?>" disabled>
                        </div>
                          <div class="form-floating mt-2">
                          
                          <div class="form-floating mt-2">
                            <select class="form-select" id="floatingSelect" aria-label="Floating label select example" name="newTecEncargo">
                              <option>Encargad@ Actual: <?php echo $fila["usu_nombreTec"]." ". $fila["usu_apellidoTec"] ?></option>
                              <?php foreach ($MejoresTecnicos as $filaTec) { ?>
                              <?php if($filaTec["usu_nombre"] != $fila["usu_nombreTec"] || $filaTec["usu_apellido"] !=$fila["usu_apellidoTec"]){ ?>
                                <option value="<?php echo $filaTec['idTecnicos'] ?>"><?php echo $filaTec["usu_nombre"]." ". $filaTec["usu_apellido"]; ?></option>
                              <?php }} ?>
                            </select>
                            <label for="floatingSelect">Cambiar Tecnico</label>
                          </div>
                            
                          </div>
                          <div class="col-sm-3">
                          <label for="inputText5" class="form-label">Fecha de entrada: </label>
                          <input type="text" id="inputText5" class="form-control text-center" value="<?php echo $fila["fecha_entrada"] ?>" disabled>
                          </div>
                          <div class="col-sm-3 ">
                          <label for="inputText5" class="form-label">Fecha de salida: </label>
                          <input type="text" id="inputText5" class="form-control text-center" value="<?php echo $fila["fecha_salida"] ?>" disabled>
                          </div>
                      </div>
                        <div class="modal-footer">
                          <button type="submit" class="btn btn-danger" data-bs-dismiss="modal" formmethod="get">Eliminar Encargo</button>
                          <button type="submit" class="btn guardar">Guardar Cambios</button>
                        </div>
                              </div>
                      </form>
                    </div>
                  </div>
                </div>
              
            
                <?php  $e +=1; ?>
              <?php } ?>
              </div>
              </div>
          </div>
    <script src="../JS/asignacion.js"></script>
    <script src="/ProyectoCompletoUniversidad/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>