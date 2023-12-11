<?php 
// TODO: CONEXION
require('Assets/POO/conexion.php');
// TODO: Subir datos
require("Assets/POO/SubirdatosRegistro.php");
// TODO: Actualizar datos
require("Assets/POO/ActualizarDatosRegistro.php");


// * hacer Coneccion
$host="localhost";
$dbname="serviciotecnico";
$usuario="root";
$password='09112003aDxDGokuwily.';
// * crear la nueva clase
$conexionInpura = new BaseDeDatos($host,$dbname,$usuario,$password);
// * obtener la conexion directa e una variable por comodidad
$conexion = $conexionInpura->obtenerConexion();



// ! Si las variables POST (variables que rellena el usuario en el formulario) son enviadas con exito se subiran a la base de datos
if($_SERVER["REQUEST_METHOD"] == "POST"){
    if (isset($_POST["subir"])) {
        // * Aqui se suben
        $SubirDatosUsuario = new SubirDatosUsuario($conexion);
    }
    elseif (isset($_POST["idUsuarioOculto"])) {
        // * Aqui se editan
        $EditarDatosTecnico = new EditarTecnico($conexion);
    }else{
        // * Aqui se eliminan los datos
        $EliminarDatosUsuario = new EliminarTecnicos($conexion);
    }
    
}



// * Hacer nuevo objeto para obtener los tecnicos ya creados en la base de datos
$tablaTec = new BajarTecnicos($conexion);


?>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualizar Tecnicos</title>
    <link rel="stylesheet" href="/ProyectoCompletoUniversidad/node_modules/sweetalert2/dist/sweetalert2.min.css"></link>
    <link rel="stylesheet" href="/ProyectoCompletoUniversidad/node_modules/bootstrap/dist/css/bootstrap.min.css">
    
    <link rel="stylesheet" href="node_modules/@yaireo/tagify/dist/tagify.css">
    <link rel="stylesheet" href="Assets/CSS/registroStyle.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <meta property="og:image" content="/ProyectoCompletoUniversidad/Assets/MEDIA/img/LOGO.jpg">
    <link rel="shortcut icon" href="/ProyectoCompletoUniversidad/Assets/MEDIA/img/LOGO.ico" type="image/x-icon">
</head>
<body>
<script src="node_modules/validator/validator.min.js"></script>

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



    <div class="fallasContenedor">
    
        <div class="error_table">
            <div class="error_target ApellidoError off">
 
            </div>
            <div class="error_target NombreError off">

            </div>
            <div class="error_target CedulaError off">


            </div>
            <div class="error_target TelefonoError off">


            </div>
            <div class="error_target EmailError off">


            </div>
            <div class="error_target EspeError off">

            
            </div>
            <div class="error_target camposError off">

            
            </div>
        </div>
    </div>

    <div class="contenedor">
        <form action="<?php $_SERVER["PHP_SELF"]?>" class="formulario formulario_registro" id="formulario" method="post">
            <fieldset>
                <h2 class="titleForm">Datos del Tecnico</h2>
                <div class="contenido-formulario">
                <input type="hidden" name="subir" value="insertar">

                    <div class="grupo-formulario" id="grupo-apellidos">
                        <label for="apellidos">Apellido</label>
                        <div class="grupo-formulario-input">
                            <input type="text" autocomplete="nope" name="apellidos" size="20px" placeholder="Ej. Satorou" id="apellidos">
                          
                        </div>
                    </div>
                        

                    <div class="grupo-formulario" id="grupo-nombres">
                        <label for="nombres">Nombre</label>
                        <div class="grupo-formulario-input">
                            <input type="text" autocomplete="nope" name="nombres" size="20px" placeholder="Ej. Gojo" id="nombres">
                          
                            
                        </div>
                    </div>

                    <div class="grupo-formulario" id="grupo-cedula">
                        <label for="cedula">Cedula</label>
                        <div class="grupo-formulario-input">
                            <input  data-rules="bail|required|number|between:1,10" type="number" autocomplete="nope" name="cedula" size="20px" placeholder="Ej. 30115151" id="cedula">
                          
                        </div>
                    </div>

                    <div class="grupo-formulario" id="grupo-telefono">
                        <label for="telefono">Telefono</label>
                        <div class="grupo-formulario-input">
                            <input type="number" autocomplete="nope" name="telefono" size="20px" placeholder="4241752564" id="telefono">
                          
                        </div>
                    </div>

                    <div class="grupo-formulario papo" id="grupo-correo">
                        <div class="waos">
                            <label for="correo">Correo Electronico</label>
                            <div class="grupo-formulario-input">
                                <input type="text" autocomplete="nope" name="correo" size="20px" placeholder="Ej. SabraDios@gmail.com" id="correo">
                              
                            </div>
                        </div>
                    </div>
                    <div class="grupo-formulario especialidade" id="especialidades">
                        <label for="especialida 1">Especialidades</label>
                        <div class="grupo-formulario-input">
                            <input type="text" autocomplete="nope" name="especialidades" id="nrEspe" size="20px" placeholder="">
                        </div>
                    </div>

                    <div class="grupo-formulario pap" id="grupo-especialidades">
                    
                    </div>
                </div>

                <div class="advertencia" id="advertencia">
                </div>

                <div class="boton">
                    <button type="submit" class="guardar">Guardar</button>
                </div> 

            </fieldset>
        </form>
    </div>



    <div class="tabla">
        <table>
            <tr>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Cedula</th>
                <th>Telefono</th>
                <th>Correo Electronico</th>
                <th class="especialidadesTabla">Especialidades</th>
                <th>Acciones</th>
            </tr>
            <tr>
                
            <?php 
                $i = 0;
                foreach ($tablaTec->tabla as $fila) {
                    ?>
                    <form class="eliminarForm" action="<?php $_SERVER["PHP_SELF"]?>" method="post">
                    <?php
                    echo '<tr>';
                    echo '<input id="idUsuarioOculto" type="hidden" name="idUsuarioEliminar" value="'.$fila["idUsuarios"].'">';
                    echo '<td class="apellido'.$i.'">'. $fila['usu_apellido'] . '</td>';
                    echo '<td class="nombre'.$i.'">' . $fila['usu_nombre'] . '</td>';
                    echo '<td class="cedula'.$i.'">' . $fila['usu_cedula'] . '</td>';
                    echo '<td class="telefono'.$i.'">' . $fila['usu_telefono'] . '</td>';
                    echo '<td class="gmail'.$i.'">' . $fila['usu_gmail'] . '</td>';
                    echo '<td class="especialidadesTabla especialidades'.$i.'">' . $fila['especialidades'] . '</td>';   
                    echo '<td class="acciones">';
                    echo '<div class="editar"><i class="fa-solid fa-pen"></i></div>';
                    echo '<div class="eliminar"><i class="fa-solid fa-trash"></i></div>';
                    echo '</td>';
                    echo '</tr>';
                    $i += 1;
                    ?>
                    </form>
                    <?php
                }
            ?>
        </table>
    </div>

    <div class="infoCompletaTec">
        
        
    </div>

    <div class="table_activator">
        <i class="fa-solid fa-table " id="table_activator" style="color: #501060;"></i>
        <p>VER TECNICOS</p>
    </div>
    <script src="/ProyectoCompletoUniversidad/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
    <script src="https://unpkg.com/validator@latest/validator.min.js"></script>
    <script type="module" src="Assets/JS/animaciones.js"></script>
    <script src="Assets/JS/validaciones.js" ></script>
    <script src="Assets/JS/registro.js"></script>
    <script src="Assets/JS/especialidadesTags.js"  type="module"></script>
    
    <script src="/ProyectoCompletoUniversidad/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>

    

</body>
</html>