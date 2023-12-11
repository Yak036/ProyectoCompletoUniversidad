<?php 
require('../POO/conexion.php');
require('../POO/SolucionFallasHardware/BajarDatos.php');
require('../POO/SolucionFallasHardware/BuscarFallas.php');
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
  $bajarDatos = new BajarEquiposDisponibles($conexion);
  $equiposEncargos = $bajarDatos->equiposEncargos;    
  if($_SERVER["REQUEST_METHOD"] == "POST"){
    $MostrarSoluciones = new BuscaryMostrarSoluciones($conexion);
    if (isset($_POST['EquipoFalla'])){
      $MostrarSoluciones->BuscarSimilares($conexion);
    }
    elseif (isset($_POST['SubirSolucion'])) {
      $MostrarSoluciones->SubirAntecedentes($conexion);
    }
  }
}


?>



<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fallas</title>
  <link rel="stylesheet" href="/ProyectoCompletoUniversidad/node_modules/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="/ProyectoCompletoUniversidad/node_modules/sweetalert2/dist/sweetalert2.min.css"></link>

  <link rel="shortcut icon" href="/ProyectoCompletoUniversidad/Assets/MEDIA/img/LOGO.ico" type="image/x-icon">
  <link rel="stylesheet" href="../CSS/fallaStyle.css">

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


  <h1>Detección y solución de fallas (Software)</h1>
  
  <form action="<?php $_SERVER["PHP_SELF"]?>" method="post" class="deteccionFallasForm">
    <div class="titleLeft">
      <h2>Detección De La Falla</h2>
    </div>
    <div class="quest">
      <div class="grupo-formulario">
        <label for="">Tipo de equipo</label>
        
          <div class="form-floating containerDeteccion grupo-formulario-input">
          <input type="hidden" name="TipoDeFalla" value="Software">
            <select class="form-select" name="EquipoFalla" id="floatingSelect" aria-label="Floating label select example" style="height: 100px">
              <option selected value="nada">¿Cual es el equipo?</option>
              <?php foreach ($equiposEncargos as $fila) { ?>
                echo $fila['equi_modelo'];
              <option value="<?php echo $fila["idEquipos"] ?>"><?php echo "(".$fila["equi_nombre"].")" . " " . $fila["equi_modelo"] ?></option>
              <?php } ?>
            </select>
            <label for="floatingSelect">Selecciona una opcion</label>
          </div>
   
      </div>

      <div class="grupo-formulario">
        <label for="">Descripción de la falla</label>
        <div class="containerDescripcion grupo-formulario-input">
            <textarea class="inputDescripcion" name="FallaDescripcion" id="" ></textarea>
        </div>
      </div>
      <div class="boton">
        <button type="submit" class="subirFallas">Subir Fallas</button>
      </div> 
    </div>
  </form>
  <div class="soluciones">
    <div class="titleLeft">
      <h2>Solución/es</h2>
    </div>
    <div class="soluciones_container">
    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['EquipoFalla'])) {
        if (empty($MostrarSoluciones->resultado)) {
          ?>
          <form action="<?php $_SERVER["PHP_SELF"]?>" method="post" class="subirSolucion">
            <input type="hidden" name="SubirSolucionNew" value="1">
            <input type="hidden" name="SubirSolucion" value="1">
            <input type="hidden" name="TipoDeFallaNew" value="Hardware">
            <h3>No hay Soluciones disponibles actualmente</h3>
            <p>Si encuentras una, porfavor agregala</p>
              <div class="row d-flex justify-content-center align-items-center">
              
              <div class="col-sm-6">
                <label for="inputText5" class="form-label SubirNewSolucioninput">Nueva Solucion:</label>
                <input type="text" id="inputText5" class="form-control SubirNewSolucion" name="solucionNew" >
              </div>
              <div class="boton">
                <button type="submit" class="subirFallas">Subir solucion</button>
              </div> 
          </form>
          <?php
        }else{
          ?>
            <form action="<?php $_SERVER["PHP_SELF"]?>" method="post" class="subirSolucion">
            <input type="hidden" name="SubirSolucion" value="1">
            <input type="hidden" name="TipoDeFallaNew" value="Software">
              <h3>La/s solucione/s recomendada/s para la falla que mencionaste son:</h3>
              <p>Elige la mas adecuada segun tu criterio</p>
              <div class=" justify-content-center align-items-center solucionesMostradas">
              <?php foreach ($MostrarSoluciones->resultado as $fila) {
              ?>
                <div class="form-check form-switch">
                  <input class="form-check-input bg-success chekboxDetec" type="checkbox" role="switch" id="flexSwitchCheckDefault" name="antecedentesID[]" value="<?php echo $fila["idAntecedentes"] ?>">
                  <label class="form-check-label" for="flexSwitchCheckDefault"><?php echo $fila["ante_solucion"]?></label>
                </div>  
                
              <?php ?>
      
              
              
            
          
          <?php
          }
          ?>
        </div>
              <div class="boton">
                  <button type="submit" class="subirFallas">Aplicar Soluciones</button>
              </div> 
              <p p class="waos">Si tienes alguna otra solucion, porfavor agregala</p>
              <input type="hidden" name="TipoDeFallaNew" value="Software">
              <div class="col-sm-6">
                <label for="inputText5" class="form-label SubirNewSolucioninput">Nueva Solucion:</label>
                <input type="text" id="inputText5" class="form-control SubirNewSolucion" name="solucionNew" >
              </div>

              <div class="boton">
                  <button type="submit" class="subirFallas">Aplicar Soluciones</button>
              </div> 
            </form>
        <?php
      }
      
    }
    ?>
    
  </div>
  </div>

  <script src="/ProyectoCompletoUniversidad/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
  <script src="../JS/fallas.js"></script>
  <script src="/ProyectoCompletoUniversidad/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
  
</body>
</html>