/* Aquí irá el código de tu test */

// @ts-check
import { test, expect } from '@playwright/test';
test(' Navegar a la pagina principal y despues buscar empleos', async ({ page }) => {
   await page.goto('http://localhost:5173')

   const searchInput = page.getByRole('searchbox')
   await searchInput.fill('React')

   await page.getByRole('button',{ name:'Buscar'}).click()

   const JobCards = page.locator('.job-listing-card')
   await page.waitForSelector('.job-listing-card')

   const firstJobTitle = JobCards.first().locator('h3')
   await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')
   

})

test('Buscar empleos con Javascript y aplicar a una de esas ofertas', async ({ page}) => {
  await page.goto('http://localhost:5173')
   const searchInput = page.getByRole('searchbox')
   await searchInput.fill('Javascript')

   await page.getByRole('button',{ name:'Buscar'}).click()

   const JobCards = page.locator('.job-listing-card')
   await page.waitForSelector('.job-listing-card')

   const firstJobTitle = JobCards.first().locator('h3')
   await expect(firstJobTitle).toHaveText('Desarrollador de Software Senior')

   await page.getByRole('button', { name :'Iniciar sesión'}).click()
   //aplicar al job y mostrar que se aplico correctamente 
   const applyButton = page.getByRole('button', { name:'Aplicar'}).first()
   await applyButton.click()

   page.getByRole('button', { name:'Aplicado'}).first()
})

test('verificar los filtros de la aplicación', async ({ page }) => {
    await page.goto('http://localhost:5173/search')
    const selectLocation = page.getByTestId('filter-location')
    await selectLocation.selectOption('remoto')

    await page.waitForSelector('.job-listing-card')

  
  const jobCards = page.locator('.job-listing-card')
  const count = await jobCards.count()

  // Verificar que cada tarjeta contenga "Remoto"
  for (let i = 0; i < count; i++) {
    const card = jobCards.nth(i)
    const locationText = await card.locator('small').innerText()
    expect(locationText.toLowerCase()).toContain('remoto')
  }

   
})   

test('Filtrar por Nivel', async ({ page }) => {
    await page.goto('http://localhost:5173/search')
    const selectLevel = page.getByTestId('filter-experience-level')
    await selectLevel.selectOption('senior')

    const jobCards = page.locator('.job-listing-card')
    const count = await jobCards.count()
     // Verificar que el filtro muestre senior
     for (let i = 0; i< count; i++){
      const card = jobCards.nth(i)
      const locationText = await card.locator('small').innerText()
      expect(locationText.toLowerCase()).toContain('senior')
     }
    
} )

test('verificar la paginación de resultados.', async ({ page}) => {
   await page.goto('http://localhost:5173/search')
   await page.waitForSelector('article.job-listing-card')

   const jobs = await page.locator('article.job-listing-card').count()
   expect(jobs).toBe(4)
   //verificar que aparece la paginación
   await expect(page.locator('[data-testid="pagination"]')).toBeVisible()//Auto-retrying assertions, retrying assertions are async, so you must await them.
  

})

test('Navegar a la siguiente página', async ({ page}) => {
    await page.goto('http://localhost:5173/search')

    await page.waitForSelector('[data-testid="pagination"]')
    const nextButton = page.locator('[data-testid="pagination"] a[href="/search?page=2"]').last()
    await expect(nextButton).toBeVisible()

    await nextButton.scrollIntoViewIfNeeded()
    await nextButton.waitFor({ state:'visible' })
    await nextButton.click()
    await expect(page).toHaveURL(/page=2/)

    //verificar boton anterior
    const prevButton = page.locator('[data-testid="pagination"] a[href="/search?page=1"]').first()
    await expect(prevButton).toBeVisible()
    
    await nextButton.scrollIntoViewIfNeeded()
    await nextButton.waitFor( {state:'visible' })
    await prevButton.click()
    await expect(page).toHaveURL(/search$/)

})



