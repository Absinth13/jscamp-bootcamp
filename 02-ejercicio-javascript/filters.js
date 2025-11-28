/* Aquí va la lógica para filtrar los resultados de búsqueda */
const filterLocation = document.querySelector('#filter-location')
const filterExperience = document.querySelector('#filter-experience-level')
const filterTech       = document.querySelector('#filter-technology')
const mensaje = document.querySelector('#filter-selected-value')

function aplicarFiltros(){
  const jobs = document.querySelectorAll('.job-listing-card')

  const selectedLocation = filterLocation.value
  const selectedExperience = filterExperience.value
  const selectedTech  = filterTech.value

  let texto = []  //me muestra que es lo que estoy seleccionando debajo de mi barra
  if (selectedLocation) texto.push(`Ubicacion:${selectedLocation}`)
  if (selectedExperience) texto.push(`Nivel: ${selectedExperience}`)
  if (selectedTech)texto.push(`Tecnología : ${selectedTech}`)
    mensaje.textContent = texto.length ? `Has seleccionado : ${texto.join(' | ')}`: ''

  jobs.forEach(job => {
    const modalidad = job.getAttribute('data-modalidad')
    const experience = job.getAttribute('data-nivel')
    const technology = job.getAttribute('data-technology')

    const matchLocation = !selectedLocation || modalidad === selectedLocation
    const matchExperience = !selectedExperience || experience === selectedExperience
    const matchTech = !selectedTech || technology === selectedTech

    const isShown = matchLocation && matchExperience && matchTech
    job.classList.toggle('is-hidden', !isShown)
  })
}
filterLocation.addEventListener('change', aplicarFiltros)
filterExperience.addEventListener('change', aplicarFiltros)
filterTech.addEventListener('change',aplicarFiltros)


//---------------------------Barra de busqueda

const searchInput = document.querySelector('#empleos-search-input')

searchInput.addEventListener('input', function(){
  const query = searchInput.value.toLowerCase() //toLowerCase() Metodo 
  const jobs = document.querySelectorAll('.job-listing-card')

  jobs.forEach (job=> {
    const text = job.textContent.toLowerCase()
    const tech = job.getAttribute('data-tech')?.toLocaleLowerCase() || ''

    const match = text.includes(query) || tech.includes(query)
    job.classList.toggle('is-hidden', !match)
  })
})




