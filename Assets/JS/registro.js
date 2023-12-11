
// Seleccionar el formulario con el document.getElement
const formulario = document.getElementById('formulario')
// Seleccionar imput de formulario
const inputs = document.querySelectorAll('#formulario input')

// Expresiones regulares para validar formulario
const expresiones = {
    apellidos: /^[a-zA-ZÀ-ÿ\s]{3,250}$/,
    nombres: /^[a-zA-ZÀ-ÿ\s]{3,250}$/,
    cedula: /^\d{7,11}$/,
    telefono: /^\d{10}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-z0-9-]+\.[a-zA-z0-9-.]+$/,
    especialidad: /^\d{1,20}$/
}


// los valores de los inputs pero en array

const grupos = {
    apellidos: false,
    nombres: false,
    cedula: false,
    telefono: false,
    correo: false,
    especialidad: false
}




const validacionesGrupos = (expresion, input, grupo) => {
    if (expresion.test(input.value)){
        //seleccionas el imput
        document.getElementById(`grupo-${grupo}`).classList.remove ('grupo-formulario-incorrecto')
        document.getElementById(`grupo-${grupo}`).classList.add('grupo-formulario-correcto')
        document.querySelector(`#grupo-${grupo} i`).classList.add('fa-check-circle')
        document.querySelector(`#grupo-${grupo} i`).classList.remove('fa-times-circle')
       
        grupos[grupo] = true
    }else{
        document.getElementById(`grupo-${grupo}`).classList.add('grupo-formulario-incorrecto')
        document.getElementById(`grupo-${grupo}`).classList.remove ('grupo-formulario-correcto')
        document.querySelector(`#grupo-${grupo} i`).classList.add('fa-times-circle')
        document.querySelector(`#grupo-${grupo} i`).classList.remove('fa-check-circle')
        grupos[grupo] = false
    }
}



const validaciones = (e) => {
    switch (e.target.name) {
        case "apellidos":
            validacionesGrupos(expresiones.apellidos, e.target, 'apellidos');
        break

        case "nombres":
            validacionesGrupos(expresiones.nombres, e.target, 'nombres')
        break

        case "cedula":
            validacionesGrupos(expresiones.cedula, e.target, 'cedula')
        break

        case "telefono":
            validacionesGrupos(expresiones.telefono, e.target, 'telefono')
        break

        case "correo":
            validacionesGrupos(expresiones.correo, e.target, 'correo')
        break

        case "especialidad":
            validacionesGrupos(expresiones.especialidad, e.target, 'especialidad')
        break
    }
}


inputs.forEach((input) =>{
    input.addEventListener('keyup', validaciones);
    input.addEventListener('blur', validaciones)
})













// editar y eliminar

const editar = document.querySelectorAll(".editar");



let ventanaTec = document.querySelector(".infoCompletaTec")
let containerInfo = document.querySelector(".containerInfo")
let arrayEspecialidades = []
for (let i = 0; i < editar.length; i++) {
    editar[i].addEventListener("click",()=>{
        
        arrayEspecialidades = []
        ventanaTec.classList.toggle("active")
        const apellidoTec = document.querySelector(`.apellido${i}`),
            nombreTec = document.querySelector(`.nombre${i}`),
            cedulaTec = document.querySelector(`.cedula${i}`),
            telefonoTec = document.querySelector(`.telefono${i}`),
            gmailTec = document.querySelector(`.gmail${i}`),
            especialidadesTec = document.querySelector(`.especialidades${i}`)
            arrayEspecialidades = arrayEspecialidades.concat(especialidadesTec.textContent.split(", ")),
            idUsuarioOculto = document.querySelectorAll("#idUsuarioOculto");

            
        ventanaTec.innerHTML = `
        
            
            <form class="containerInfo" id="formulario" method="post" action="/ProyectoCompletoUniversidad/Registro.php">
            <h3>Editar información del técnico</h3>
            <input type="hidden" name="idUsuarioOculto" value="${idUsuarioOculto[i].value}">
            <div class="grupo-formulario-input">
                <label for="">Apellido</label>
                <input type="text " value="${apellidoTec.textContent}" id="apellidoTec" autocomplete="nope" name="editApellido">
            </div>
            
            <div class="grupo-formulario-input">
                <label for="">Nombre</label>
                <input type="text" value="${nombreTec.textContent}" id="nombreTec" autocomplete="nope" name="editNombre">
            </div>
            
            <div class="grupo-formulario-input">
                <label for="">Cédula</label>
                <input type="number" value="${cedulaTec.textContent}" id="cedulaTec" autocomplete="nope" name="editACedula">
            </div>
            
            <div class="grupo-formulario-input">
                <label for="">Teléfono</label>
                <input type="number" value="${telefonoTec.textContent}" id="telefonoTec" autocomplete="nope" name="editTelefono">
            </div>
            <div class="grupo-formulario-input correo">
                <p for="">Correo electronico</p>
                <input type="text" value="${gmailTec.textContent}" id="correoTec" autocomplete="nope" name="editGmail">
            </div>

            <div class="grupo-formulario-input especialidadesDBcontainer">
                <div class="especialidadesDB">
                    <p for="">Actualizar especialidades del tecnico</p>
                    <input type="text" value="" id="especialidadAgg" autocomplete="nope" name="editEspe">
                    <div class="boton">
                        <button type="submit" class="guardar">Actualizar Datos</button>
                    </div> 
                </div>
            </div>
            <div class="fallasContenedorTec">
    
        <div class="error_table Tec">
            <div class="error_target Tec ApellidoErrorTec off">
 
            </div>
            <div class="error_target Tec NombreErrorTec off">

            </div>
            <div class="error_target Tec CedulaErrorTec off">


            </div>
            <div class="error_target Tec TelefonoErrorTec off">


            </div>
            <div class="error_target Tec EmailErrorTec off">


            </div>
            <div class="error_target Tec EspeErrorTec off">

            </div>
            <div class="error_target Tec camposErrorTec off">            
            </div>
        </div>
    </div>
        </form>
        `
        
        const grupoTec = {
            apellido: true,
            nombre: true,
            cedula: true,
            telefono: true,
            correo: true,
            especialidades: true
        };

        ventanaTec = document.querySelector(".infoCompletaTec");
        containerInfo = document.querySelector(".containerInfo");
        
        
            validarEmail("EmailErrorTec","correoTec","Gmail",grupoTec,"correo");
            validarText("ApellidoErrorTec","apellidoTec","Apellido",grupoTec,"apellido")
            validarTelefono("TelefonoErrorTec","telefonoTec","Teléfono",grupoTec,"telefono");
            validarCedula("CedulaErrorTec","cedulaTec","Cédula",grupoTec,"cedula");
            validarText("NombreErrorTec","nombreTec","Nombre", grupoTec,"nombre");

            let containerEspe = document.querySelector(".EspeErrorTec")
            const especialidadesInput = document.querySelector("#especialidadAgg");
            setInterval(()=>{
            if(especialidadesInput.value != ""){
                containerEspe.classList.add("off");
                grupoTec["especialidades"] = true;
            }else{
                grupoTec["especialidades"] = false;
                containerEspe.classList.remove("off");
                containerEspe.innerHTML = `<p class="vali Minimo5">Especialidades: Necesitas mínimo 1 Especialidad</p>
                <i class="fa-solid fa-circle-exclamation"></i>`
            }


            },1000)
            validarFormulario("containerInfo","Algún dato es invalido",grupoTec);

    })
}

ventanaTec.addEventListener("click",function(evento){
    if (!containerInfo.contains(evento.target)) {
        ventanaTec.classList.remove("active")
    }
})


let eliminar = document.querySelectorAll(".eliminar");
let eliminarForm = document.querySelectorAll(".eliminarForm");

for (let i = 0; i < eliminar.length; i++) {
    eliminar[i].addEventListener("click",function(){
        eliminarForm[i].submit();
    })
}
