
// * Hacer q el select cambie el valor de la variable cada vez q alguien cambie el select para hacer 
// * optener el id del equipo q se va a asignar

let select = document.querySelector('#floatingSelect');
let idEquipo;
// * se le hace un evento para q cada que cambie el valor del select este se monte en el LOCAL STORAGE
select.addEventListener('change', function(){
    idEquipo = select.value; 
    localStorage.setItem('idEquipo', idEquipo);
})

// se confirma q el texarea no este vacio
const textArea = document.querySelector(".inputDescripcion");
let fomularioDetectarSolucion = document.querySelector(".deteccionFallasForm")
fomularioDetectarSolucion.addEventListener("submit",function(event) {
    event.preventDefault();
    if (textArea.value != "" && select.value !="nada"){
        fomularioDetectarSolucion.submit()
    }else{
        Swal.fire({
            title: 'Error!',
            text: 'Debe rellenar todos los datos',
            icon: 'error',
            confirmButtonText: 'Ok!'
          })
    }
    
})


// * se toma el formulario para q cuando envien datos primero se genere un input con el id de ese equipo
let formularioSubirSolucion;
if (document.querySelector('.subirSolucion')) {
    formularioSubirSolucion = document.querySelector('.subirSolucion');
    textArea.addEventListener("keypress", function(evento){
        if (evento) {
            formularioSubirSolucion.style.display = "none"
            }
        })
        select.addEventListener("change", function(){
            formularioSubirSolucion.style.display = "none"
        })


    formularioSubirSolucion.addEventListener('submit', function(event){
        event.preventDefault();
        
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'idEquipoAntecedente';
        input.value = localStorage.getItem('idEquipo');
        formularioSubirSolucion.appendChild(input);

        let inputDescrip = document.createElement('input');
        inputDescrip.type = 'hidden';
        inputDescrip.name = 'FallaDescripcionNew';
        inputDescrip.value = localStorage.getItem('fallaDescrip');
        formularioSubirSolucion.appendChild(inputDescrip);
        formularioSubirSolucion.submit();
    })
    
}








textArea.addEventListener("input", function () {
    this.style.height = "auto"; // Restaurar la altura predeterminada
    this.style.height = (this.scrollHeight) + "px"; // Establecer la altura en función del contenido
    localStorage.setItem('fallaDescrip', textArea.value);
});


textArea.addEventListener("keypress", function(evento){
    if (evento.key == 'Enter' || evento.keyCode == 13) {
        evento.preventDefault();
        Swal.fire({
            title: 'Error!',
            text: 'No se permiten saltos de linea',
            icon: 'error',
            confirmButtonText: 'Ok!'
        })
    }
    if(evento.keyCode == 34 || evento.keyCode == 39 || evento.key == "`" ){
        evento.preventDefault();
        Swal.fire({
            title: 'Error!',
            text: 'No se permite el uso de comillas',
            icon: 'error',
            confirmButtonText: 'Ok!'
        })
    }
})
