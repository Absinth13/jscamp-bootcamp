/* Aquí va la lógica para filtrar los resultados de búsqueda */
const filterLocation = document.querySelector('#filter-location')
const filterExperience = document.querySelector('#filter-experience-level')
const filterTech       = document.querySelector('#filter-technology')
const mensaje = document.querySelector('#filter-selected-value')
const searchInput = document.querySelector('#empleos-search-input')

// en `aplicarFiltros`, tambien tenemos en cuenta lo que el usuario escribe en el input. Esto lo hacemos así porque, si el usuario tiene filtros aplicados y luego escribe, al usar logicas diferentes, se mostrará solo los resultados que coincidan desde el input, y no los que coincidan con los filtros.
function aplicarFiltros(){
  const jobs = document.querySelectorAll('.job-listing-card')

  const selectedLocation = filterLocation.value
  const selectedExperience = filterExperience.value
  const selectedTech  = filterTech.value
  const selectedSearchText = searchInput.value.toLowerCase().trim()

  let texto = []  //me muestra que es lo que estoy seleccionando debajo de mi barra
  if (selectedLocation) texto.push(`Ubicacion:${selectedLocation}`)
  if (selectedExperience) texto.push(`Nivel: ${selectedExperience}`)
  if (selectedTech)texto.push(`Tecnología : ${selectedTech}`)
    mensaje.textContent = texto.length ? `Has seleccionado : ${texto.join(' | ')}`: ''

  jobs.forEach(job => {
    const modalidad = job.getAttribute('data-modalidad')
    const experience = job.getAttribute('data-nivel')
    const technology = job.getAttribute('data-technology')
    const searchText = job.textContent.toLowerCase()

    // si el texto de búsqueda está vacío, se muestra todo
    // si el texto de búsqueda no está vacío, se muestra solo lo que coincide
    const matchSearch = selectedSearchText.trim() === '' ? true : searchText.includes(selectedSearchText)

    const matchLocation = !selectedLocation || modalidad === selectedLocation
    const matchExperience = !selectedExperience || experience === selectedExperience
    const matchTech = !selectedTech || technology === selectedTech

    const isShown = matchLocation && matchExperience && matchTech && matchSearch
    job.classList.toggle('is-hidden', !isShown)
  })
}
filterLocation.addEventListener('change', aplicarFiltros)
filterExperience.addEventListener('change', aplicarFiltros)
filterTech.addEventListener('change',aplicarFiltros)


//---------------------------Barra de busqueda


searchInput.addEventListener('input', aplicarFiltros)

/* searchInput.addEventListener('input', function(){
  // agregamos un .trim() por si el usuario agrega espacios adelante o al final de la búsqueda
  const query = searchInput.value.toLowerCase().trim() //toLowerCase() Metodo 
  const jobs = document.querySelectorAll('.job-listing-card')

  jobs.forEach (job=> {
    const text = job.textContent.toLowerCase()
    const tech = job.getAttribute('data-tech')?.toLocaleLowerCase() || ''

    const match = text.includes(query) || tech.includes(query)
    job.classList.toggle('is-hidden', !match)
  })
}) */




