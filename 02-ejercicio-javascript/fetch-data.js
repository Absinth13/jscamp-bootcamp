

const container = document.querySelector('.jobs-listings')



fetch("./data.json") /* fetch es asíncrono */
  .then((response) => {
    return response.json();
  })
  .then((jobs) => {
/*  DocumentFragment es como un contenedor temporal invisible que nos permite
    crear y organizar elementos antes de agregarlos al DOM.
    Ventaja: en vez de agregar cada elemento uno por uno (lo que hace que el navegador redibuje la página muchas veces), los agrupamos todos aquí y los agregamos de una sola vez.
    Esto hace que la página cargue más rápido y sea más eficiente :)
    Si bien no lo dimos en el curso, y. es util cuando tenemos muchos mas elementos, sentimos que no esta de más comentarlo :)    
*/
    const fragmentContainer = document.createDocumentFragment()
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

      fragmentContainer.appendChild(article)
    })
    container.appendChild(fragmentContainer)
  });
