/* Aquí va la lógica para dar funcionalidad al botón de "Aplicar" */
//-------------------------------------tercera forma----------
//const jobsListingSection = document.querySelector('.jobs-listings')

//jobsListingSection.addEventListener('click', function(event) {
  //const element = event.target

  //if (element.classList.contains('button-apply-job')) {
  ///  element.textContent = '¡Aplicado!'
   // element.classList.add('is-applied')
   // element.disabled = true
//  }
//})

document.addEventListener("click", function (event) {
  const element = event.target;
  if (element.classList.contains("button-apply-job")) {
    element.textContent = "¡Aplicado!";
    element.classList.add("is-applied");
    element.disabled = true;
  }
});
