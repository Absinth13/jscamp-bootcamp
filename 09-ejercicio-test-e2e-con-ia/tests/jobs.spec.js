/* Aquí irá el código de tu test */

// @ts-check
import { expect, test } from '@playwright/test';

test(' Navegar a la pagina principal y despues buscar empleos', async ({ page }) => {
   await page.goto('http://localhost:5173')

   const searchInput = page.getByRole('searchbox')
   await searchInput.fill('React')

   await page.getByRole('button',{ name:'Buscar'}).click()

   // const JobCards = page.locator('.job-listing-card')
   // await page.waitForSelector('.job-listing-card')
   // waitForSelector no es una buena practica. Lo que hace es esperar "a mano" que aparezca.
   // Con esta aserción de expect no hace falta esperar a mano, se reintenta sola. Es lo que se suele hacer en los tests
   const jobCards = page.locator('.job-listing-card')
   await expect(jobCards.first()).toBeVisible()

   // Está como locator, pero recuerda que es mejor usar getByRole('h3', { level: 3, name: 'Desarrollador de Software Senior' })
   const firstJobTitle = jobCards.first().locator('h3')
   await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')
   

})

test('Buscar empleos con Javascript y aplicar a una de esas ofertas', async ({ page}) => {
  await page.goto('http://localhost:5173')
   const searchInput = page.getByRole('searchbox')
   await searchInput.fill('JavaScript')

   await page.getByRole('button',{ name:'Buscar'}).click()

   // const JobCards = page.locator('.job-listing-card')
   // await page.waitForSelector('.job-listing-card')
   // Misma mejora que en el test anterior: expect reintenta solo
   // No es buena practica usar locator. Mejor usar getByRole('article') o lo que fuese.
   const jobCards = page.locator('.job-listing-card')
   await expect(jobCards.first()).toBeVisible()

   const firstJobTitle = jobCards.first().locator('h3')
   await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')

   await page.getByRole('button', { name :'Iniciar sesión'}).click()

   // Como estaba antes, se aplicaba desde la lista, nunca se entraba al detalle del empleo
   // Para eso hacemos clic en el primer resultado para ver el detalle (como pide el ejercicio)
   await jobCards.first().getByRole('link', { name: 'Ver detalles' }).click()
   // Verificamos que el detalle muestre el titulo del empleo. Aquí te dejamos el ejemplo con getByRole en títulos.
   await expect(page.getByRole('heading', { level: 1, name: 'Desarrollador de Software Senior' })).toBeVisible()

   //aplicar al job y mostrar que se aplico correctamente 
   // const applyButton = page.getByRole('button', { name:'Aplicar'}).first()
   // await applyButton.click()
   // page.getByRole('button', { name:'Aplicado'}).first()
   // La última línea no comprueba nada, porque no estamos haciendo un expect. Siempre que quieras verificar algo, es con expect.
   // Ahora hacemos clic en "Aplicar" y comprobamos que cambia a "Aplicado"
   await page.getByRole('button', { name: 'Aplicar' }).click()
   await expect(page.getByRole('button', { name: 'Aplicado' })).toBeVisible()
})

test('verificar los filtros de la aplicación', async ({ page }) => {
    await page.goto('http://localhost:5173/search')
    const selectLocation = page.getByTestId('filter-location')
    await selectLocation.selectOption('Remoto') // Ojo que el valor es con mayuscula

    const jobCards = page.locator('.job-listing-card')

    // await page.waitForSelector('.job-listing-card')
    // const count = await jobCards.count()
    // for (let i = 0; i < count; i++) { ... expect(locationText...).toContain('remoto') }
    // Verificamos que no haya cards con <small> que diga "Remoto"
    // Así sabemos seguro que el filtro se aplicó y el listado se recargó
    await expect(jobCards.filter({ hasNot: page.locator('small', { hasText: 'Remoto' }) })).toHaveCount(0)
    // Ahora sí, comprobamos que todas las tarjetas muestran "Remoto"
    for (const card of await jobCards.all()) {
      await expect(card.locator('small')).toContainText('Remoto')
    }

   })   

test('Filtrar por Nivel', async ({ page }) => {
    await page.goto('http://localhost:5173/search')
    const selectLevel = page.getByTestId('filter-experience-level')
    await selectLevel.selectOption('senior')

    const jobCards = page.locator('.job-listing-card')
     // const count = await jobCards.count()
     // for (let i = 0; i< count; i++){ ... se leía el <small> buscando "senior" }
     // El <small> tiene "empresa | ubicación", así que ahí nunca iba a estar el nivel
     // El nivel está en el atributo data-nivel de cada tarjeta; esperamos a que no quede ninguna tarjeta que NO sea senior. Un poco la misma lógica que el test anterior
     await expect(jobCards.filter({ hasNot: page.locator('[data-nivel="senior"]') })).toHaveCount(0)
     // Ahora comprobamos el atributo data-nivel de cada tarjeta
     for (const card of await jobCards.all()) {
      await expect(card).toHaveAttribute('data-nivel', 'senior')
     }
    
} )

test('verificar la paginación de resultados.', async ({ page}) => {
   await page.goto('http://localhost:5173/search')
   // await page.waitForSelector('article.job-listing-card')
   // const jobs = await page.locator('article.job-listing-card').count()
   // expect(jobs).toBe(4)
   // toHaveCount reintenta hasta que cargan las 4 tarjetas de la pagina
   await expect(page.locator('.job-listing-card')).toHaveCount(4)
   // await expect(page.locator('[data-testid="pagination"]')).toBeVisible()
   // Usamos getByTestId, pero lo mejor SIEMPRE es `getByRole`.
   await expect(page.getByTestId('pagination')).toBeVisible()
   

})

test('Navegar a la siguiente página', async ({ page}) => {
    await page.goto('http://localhost:5173/search')

    const jobCards = page.locator('.job-listing-card')
    await expect(jobCards.first()).toBeVisible()

    // await page.waitForSelector('[data-testid="pagination"]')
    // const nextButton = page.locator('[data-testid="pagination"] a[href="/search?page=2"]').last()
    // Pusimos el botón con aria-label="Siguiente" en la app y lo buscamos por su rol
    const nextButton = page.getByRole('link', { name: 'Siguiente' })
    await expect(nextButton).toBeVisible()

    const firstTitle = await jobCards.first().locator('h3').innerText()
    await nextButton.click()

    // await expect(page).toHaveURL(/page=2/)
    // Comprobamos que los resultados cambian al pasar de página
    await expect(jobCards.first().locator('h3')).not.toHaveText(firstTitle)

    //verificar boton anterior
    // const prevButton = page.locator('[data-testid="pagination"] a[href="/search?page=1"]').first()
    const prevButton = page.getByRole('link', { name: 'Anterior' })
    await expect(prevButton).toBeVisible()

    await prevButton.click()
    // Al volver atrás debe reaparecer el primer resultado de la página 1. De esta manera verificamos que funciona
    await expect(jobCards.first().locator('h3')).toHaveText(firstTitle)

})


