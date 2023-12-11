import anime from '../../node_modules/animejs/lib/anime.es.js';




let tablaButom = document.querySelector("#table_activator");
let tabla = document.querySelector(".tabla");

// ? Optener el ancho de la pantalla de usuario
const ancho = tabla.offsetLeft;
const transAncho = ancho*-1.2

console.log(transAncho)
let estado = 0;
tablaButom.addEventListener("click", function(){
  if (estado === 0) {
    anime({
      duration: 1000,
      targets: '.tabla',
      translateX: transAncho,
      easing: 'easeInOutExpo'
    });
    estado = 1
  }else{
    anime({
      duration: 1000,
      targets: '.tabla',
      translateX: -10,
      easing: 'easeInOutExpo'
    });
    estado = 0
  }

  
})
