

const container = document.querySelector('.jobs-listings')



fetch("./data.json") /* fetch es asíncrono */
  .then((response) => {
    return response.json();
  })
  .then((jobs) => {
    jobs.forEach(job => {
      const article = document.createElement('article')
      article.className = 'job-listing-card'
      
      article.dataset.modalidad = job.data.modalidad
      article.dataset.nivel = job.data.nivel
      article.dataset.technology = job.data.technology

       article.innerHTML = `
       
        <h3><a aria-label="link a la descripcion del empleo" id="linksTo" href="./lista_de_empleos.html">
        ${job.titulo}</a></h3>
        <small>${job.empresa} | ${job.ubicacion}</small>
        <p>${job.descripcion}</p>
        <button class="button-apply-job">Aplicar</button>
      `;

      container.appendChild(article)
    })
  });/* Aquí va la lógica para mostrar los resultados de búsqueda */
