/* Aquí va la lógica para dar funcionalidad al botón de "Aplicar" */
//-------------------------------------tercera forma----------
const jobsListingSection = document.querySelector('.jobs-listings')

jobsListingSection.addEventListener('click', function(event) {
  const element = event.target

  if (element.classList.contains('button-apply-job')) {
    element.textContent = '¡Aplicado!'
    element.classList.add('is-applied')
    element.disabled = true
 }
})

/*
Genial! La manera en la que lo hiciste está excelente.
Usaría la tercera forma que comentas arriba de este comentario.
A pesar de que ambas funcionen y sean correctas, la `tercera forma` que planteas reduce la cantidad de veces que se tenga que ejecutar el `addEventListener`
*/

// document.addEventListener("click", function (event) {
//   const element = event.target;
//   if (element.classList.contains("button-apply-job")) {
//     element.textContent = "¡Aplicado!";
//     element.classList.add("is-applied");
//     element.disabled = true;
//   }
// });
