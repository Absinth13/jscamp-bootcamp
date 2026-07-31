<!-- Aquí puedes poner tus dudas del ejercicio -->
No se por que no me actualiza en PUT el ejercicio no me salio :´(
cuando pongo un console.log después node --test --test-reporter tap me muestra que todo OK , pero 
no veo los cambios cuando pongo el url en el buscador 
En la consola de chrome en network me marca 200 ok.     

Solo me funciona cuando pongo un id invalido si me marca el error 404 y si me muestra el error 'Job not Found'

**Respuesta:**
Hola! Lo que pasaba era que tenias falsos positivos en varios tests, inclusive ese. Por no estaba funcionando correctamente. Habías puesto mal la `,`.

```js
test('Nombre del test'), async () => {
  // cuerpo del test
}
```

Si miras en el `)` justo después del nombre. Lo que JavaScript realmente interpreta es la expresión de coma:
```js
test('Nombre del test'),        // ← se ejecuta: registra un test SIN callback (pasa porque no hay nada)
async () => { ... }              // ← se crea una función y se descarta (código muerto)
```

Quedó arreglado y puse la coma donde tiene que ir