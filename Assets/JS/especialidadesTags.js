import Tagify from '../../node_modules/@yaireo/tagify/dist/tagify.esm.js'


document.addEventListener("DOMContentLoaded", function(){

  const especialidades = document.querySelector("#nrEspe");

  const tagify = new Tagify(especialidades, {
    delimiters: ", ", // Separador de etiquetas
    enforceWhitelist: false, // Permitir etiquetas que no estén en la lista de sugerencias
    whitelist: [],
    duplicates: "reject", // Rechazar etiquetas duplicadas
    transformTag: function(tagData) {
      tagData.value = tagData.value.charAt(0).toUpperCase() + tagData.value.slice(1).toLowerCase();
    }
  });

})







const editar = document.querySelectorAll(".editar");



for (let i = 0; i < editar.length; i++) {
  editar[i].addEventListener("click",()=>{
    
    const aggEspecialidad = document.querySelector("#especialidadAgg");
    const tagify = new Tagify(aggEspecialidad,{
            delimiters:", ",//separador de etiquetas
            enforceWhitelist: false, // solo permite etiquetas de la lista de sugerencias;
            whitelist: ["tag1","sexo","indigenas"],
            duplicates: "reject", // Rechaza etiquetas duplicadas
            transformTag: function(tagData) {
              tagData.value = tagData.value.charAt(0).toUpperCase() + tagData.value.slice(1).toLowerCase();
            }
          }
        )
    tagify.removeAllTags()
    tagify.addTags(arrayEspecialidades)

  })
  
} 
  
