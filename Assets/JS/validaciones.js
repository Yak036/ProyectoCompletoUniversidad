






const grupo = {
  apellido: false,
  nombre: false,
  cedula: false,
  telefono: false,
  correo: false,
  especialidades: false
};

//! lista de errores

const fallasContainer = document.querySelector(".fallasContenedor");



// * funcion para validar texto
function validarText(selectorContainer, SelectorInput,Text,grupo,grupoName) {
  let input = document.querySelector(`#${SelectorInput}`);
  let inputContainer = document.querySelector(`.${selectorContainer}`);
  input.addEventListener("keyup", function(){
    fallasContainer.classList.add("active")
    grupo[grupoName] = false
    inputContainer.classList.remove("off")
    // ? Validar si tiene minimo 3 caracteres
    if (validator.isLength(input.value,{min: 3})){  
      inputContainer.classList.add("off")
      // ? validar si solo tiene letras
      if(validator.isAlpha(input.value,'es-ES')) {
        inputContainer.classList.add("off");
        if (validator.isByteLength(input.value, {min:3, max:250})) {
          inputContainer.classList.add("off")
          
          grupo[grupoName] = true
        }else{
          inputContainer.classList.remove("off")
          inputContainer.innerHTML = `<p class="vali soloLetras">${Text}: Muy largo</p>
        <i class="fa-solid fa-circle-exclamation"></i>`
        }
      }else{
        inputContainer.classList.remove("off")
        inputContainer.innerHTML = `<p class="vali soloLetras">${Text}: Solo puede tener letras</p>
        <i class="fa-solid fa-circle-exclamation"></i>`
      }
    }else{
      inputContainer.classList.remove("off")
      inputContainer.innerHTML = `<p class="vali Minimo5">${Text}: Necesita mínimo 3 caracteres</p>
      <i class="fa-solid fa-circle-exclamation"></i>`
    }
   
  })
}

function validarCedula(selectorContainer, SelectorInput,Text,grupo,grupoName){
  let input = document.querySelector(`#${SelectorInput}`);
  let inputContainer = document.querySelector(`.${selectorContainer}`);
  
  input.addEventListener("keyup", function(){
    fallasContainer.classList.add("active")
    grupo[grupoName] = false
    inputContainer.classList.remove("off")
    if (validator.isNumeric(input.value) && validator.isByteLength(input.value, {min:7, max:11})) {
      inputContainer.classList.add("off")
      grupo[grupoName] = true
    }else{
      inputContainer.classList.remove("off");
      inputContainer.innerHTML = `<p class="vali Minimo5">${Text}: Necesita mínimo 7 caracteres, máximo 11 y solo pueden ser numéricos</p>
      <i class="fa-solid fa-circle-exclamation"></i>`
    }
  
  })
}

function validarTelefono(selectorContainer, SelectorInput,Text,grupo,grupoName){
  let input = document.querySelector(`#${SelectorInput}`);
  let inputContainer = document.querySelector(`.${selectorContainer}`);
  
  input.addEventListener("keyup", function(){
    fallasContainer.classList.add("active")
    grupo[grupoName] = false
    inputContainer.classList.remove("off")
    if (validator.isMobilePhone(input.value, 'es-VE')) {
      inputContainer.classList.add("off")
      grupo[grupoName] = true
    }else{
      inputContainer.classList.remove("off");
      inputContainer.innerHTML = `<p class="vali Minimo5">${Text}:Numero Invalido, Necesita  10 caracteres</p>
      <i class="fa-solid fa-circle-exclamation"></i>`
    }
  
  })
}

function validarEmail(selectorContainer, SelectorInput,Text,grupo,grupoName){
  let input = document.querySelector(`#${SelectorInput}`);
  let inputContainer = document.querySelector(`.${selectorContainer}`);
  
  input.addEventListener("keyup", function(){
    fallasContainer.classList.add("active")
    grupo[grupoName] = false
    inputContainer.classList.remove("off")
    if (validator.isEmail(input.value)) {
      inputContainer.classList.add("off")
      grupo[grupoName] = true
    }else{
      inputContainer.classList.remove("off");
      inputContainer.innerHTML = `<p class="vali Minimo5">${Text}: Invalido</p>
      <i class="fa-solid fa-circle-exclamation"></i>`
    }
  
  })
}
// ! validar especialidades sin funcion pq son tags y recibe un proceso diferente
let containerEspe = document.querySelector(".EspeError")
const especialidadesInput = document.querySelector("#nrEspe");
  
setInterval(()=>{
  if(especialidadesInput.value != ""){
    containerEspe.classList.add("off");
    grupo["especialidades"] = true;
  }else{

    containerEspe.classList.remove("off");
    containerEspe.innerHTML = `<p class="vali Minimo5">Especialidades: Necesitas mínimo 1 Especialidad</p>
    <i class="fa-solid fa-circle-exclamation"></i>`
  }


},1000)




validarEmail("EmailError","correo","Gmail",grupo,"correo");
validarTelefono("TelefonoError","telefono","Teléfono", grupo,"telefono");
validarCedula("CedulaError","cedula","Cédula", grupo, "cedula");
validarText("ApellidoError","apellidos", "Apellido", grupo,"apellido")  
validarText("NombreError","nombres","Nombre", grupo,"nombre")





function validarFormulario(fromClass,mensaje, grupoName){
  let formRegistro = document.querySelector(`.${fromClass}`);

  formRegistro.addEventListener("submit",function(event){
    event.preventDefault();
    let todasTrue = true
    for(propiedades in grupoName){
      if(!grupoName[propiedades]){
        todasTrue = false;
        break;
      }
    }
    if (todasTrue == false) {
      Swal.fire({
        title: 'Error!',
        text: `${mensaje}`,
        icon: 'error',
        confirmButtonText: 'Ok!'
    })
    }else{
      formRegistro.submit();
    }
  })
}


validarFormulario("formulario_registro","Debe rellenar todos los datos o algún dato es invalido",grupo);