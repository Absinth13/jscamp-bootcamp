/*
 * Aquí debes escribir tus tests para la API de jobs
 *
 * Recuerda:
 * - Usar node:test y node:assert (sin dependencias externas)
 * - Levantar el servidor con before() y cerrarlo con after()
 * - Testear todos los endpoints: GET, POST, PUT, PATCH, DELETE
 * - Verificar validaciones con Zod
 * - Comprobar códigos de estado HTTP correctos
 */
import assert from 'node:assert'
import { afterEach, beforeEach, describe, test } from 'node:test'
import app from './app.js'

let server 
const PORT = 3456 // se hace en un puerto que no utilizamos para evitar conflictos y los test funcionen siempre
const BASE_URL = `http://localhost:${PORT}`

//antes de todos los test se ejecuta para levantar el servidor 
// MADEVAL: La idea es que todos los tests sean independientes entre sí, para lograr esto, lo mejor es levantar y cerrar el servidor para cada tests. De esta manera, los tests no pueden interferir en los otros. Imagina que eliminamos un job en un test y luego en otro verificamos que existe. Si mantenemos el servidor compartido para ambos, lo más probable es que se rompa, porque están consultando datos modificados.
beforeEach(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, ()=> resolve())
    server.on('error', reject)

    })
  })

// después de todos los test, se ejecuta una vez, para cerrar el servidor
afterEach(async () => {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) return reject(err)
                resolve()
        })
    })
})

/* Cuando tenemos funciones que se repiten mucho en cada test, lo mejor es unificarlo en una sola función */
const handleGetResponseAndCheckStatus = async (path = '/', status = 200) => {
    // 1. El desarrollador puede pasar el path con `/` al inicio o no, así que consideramos ambas opciones
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    // 2. Hacemos el fetch y verificamos status
    const res = await fetch(`${BASE_URL}${normalizedPath}`)
    assert.strictEqual(res.status, status)

    // 3. Devolvemos el JSON
    const json = await res.json()
    return json
}

describe('GET/jobs', () => {
    test('debe responder con 200 y un array de trabajos', async ()=> {
        const json = await handleGetResponseAndCheckStatus('/jobs', 200)
        assert.ok(Array.isArray(json.data), 'La respuesta debe ser un array')
    })
     
    test('debe filtrar por trabajos por tecnologia', async () =>{
        const tech = 'react'
        const json = await handleGetResponseAndCheckStatus(`/jobs?technology=${tech}`, 200)

        assert.ok(
            json.data.every(job => job.data.technology.includes(tech)),
            `Todos los trabajos deben incluir la tecnologia: ${tech}`
        )
        
    })

    test('Debe respetar el límite de resultados', async () => {
        const limit = 2
        const json = await handleGetResponseAndCheckStatus(`/jobs?limit=${limit}`, 200)

        assert.strictEqual(json.limit, limit)
        assert.strictEqual(json.data.length, limit)
    })

    test('Debe aplicar offset correctamente busca Analista de datos', async () => {
        const offset = 1
        const json = await handleGetResponseAndCheckStatus(`/jobs?offset=${offset}`, 200)

        const firstJob = json.data[0]
        assert.strictEqual( firstJob.id,'d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57' )
    })

})

/* Como hicimos un handle para el GET, podemos hacer uno para el post */
const handlePostResponseAndCheckStatus = async ({ path = '/', body }, status = 201) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    const response = await fetch(`${BASE_URL}${normalizedPath}`, {
        method: 'POST',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(body)
    })

    assert.strictEqual(response.status, status) 
    const json = await response.json()

    return json
}

describe('POST/jobs', () => {
    test('Añadir un trabajo nuevo con buen formato', async ()=> {
        const newJob = {
            titulo: 'Junior Frontend con background de Diseño gráfico',
            empresa: 'Innova',
            ubicacion: 'Belgica',
            descripcion: 'Buscamos un junior con excelente manejo de CSS y que pueda centrar bien los div y que no se duerma en sus horas de trabajo, para nuestra vacante de trainee por tres años con posibilidad de extencion de contrato de planta',
            data : {
                technology : ['jinja', 'react'],
                modalidad : 'remoto',
                nivel : 'junior'
            }
        }

        const json = await handlePostResponseAndCheckStatus({
            path: '/jobs',
            body: newJob
        })
        
        //Verificar que el job devuelto tiene un id generado
        assert.ok(json.newJob.id,' este job tiene un id generado' ) // 
       
        //Verificar que los datos coinciden con lo enviado

        assert.strictEqual(json.newJob.titulo, newJob.titulo)
        assert.strictEqual(json.newJob.empresa, newJob.empresa)
        assert.strictEqual(json.newJob.ubicacion, newJob.ubicacion)
        assert.strictEqual(json.newJob.descripcion, newJob.descripcion)
        assert.deepStrictEqual(json.newJob.data, newJob.data)
    })

    test('Probar con titulo de menos de 3 caracteres', async () => {
        const newJob = {
            titulo: 'de',
            empresa: 'Innova',
            ubicacion: 'Espanya',
            descripcion: 'Buscamos un junior',
            data : {
                technology : ['jinja', 'react'],
                modalidad : 'remoto',
                nivel : 'junior'
            }
        }

        await handlePostResponseAndCheckStatus({
            path: '/jobs',
            body: newJob
        }, 400)
    })

    test('Probar con titulo de más de 100 caracteres', async () => {
        const newJob = {
            titulo: 'e'.repeat(101),
            empresa: 'Innova',
            ubicacion: 'Espanya',
            descripcion: 'Buscamos un junior',
            data : {
                technology : ['jinja', 'react'],
                modalidad : 'remoto',
                nivel : 'junior'
            }
        }

        await handlePostResponseAndCheckStatus({
            path: '/jobs',
            body: newJob
        }, 400)
    })

    test('Probar sin campo titulo', async () => {
        const newJob = {
            empresa: 'Innova',
            ubicacion: 'Espanya',
            descripcion: 'Buscamos un junior',
            data : {
                technology : ['jinja', 'react'],
                modalidad : 'remoto',
                nivel : 'junior'
            }
        }

        await handlePostResponseAndCheckStatus({
            path: '/jobs',
            body: newJob
        }, 400)
    })

    test('Probar con titulo que no sea string', async () => {
         const newJob = {
            titulo: 6666666,
            empresa: 'Innova',
            ubicacion: 'Espanya',
            descripcion: 'Buscamos un junior',
            data : {
                technology : ['jinja', 'react'],
                modalidad : 'remoto',
                nivel : 'junior'
            }
        }

        await handlePostResponseAndCheckStatus({
            path: '/jobs',
            body: newJob
        }, 400)
    })

    test('Probar sin campo descripcion', async () => {
        const newJob = {
            titulo: 'Backend',
            empresa: 'Innova',
            ubicacion: 'Espanya',
            data : {
                technology : ['zod', 'testing'],
                modalidad : 'remoto',
                nivel : 'junior'
            }
        }

        await handlePostResponseAndCheckStatus({
            path: '/jobs',
            body: newJob
        }, 201)
    })
})

describe('GET/jobs/:id', () => {
    test('Devolver el trabajo con ID especificado', async () => {
        // Para no hardcodear el ID, podemos obtener uno real y usarlo
        // const validId = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'
        const firstJson = await handleGetResponseAndCheckStatus('/jobs')
        const randomId = firstJson.data[Math.floor(Math.random() * firstJson.total)]

        const job = await handleGetResponseAndCheckStatus(`/jobs/${randomId.id}`)
        assert.strictEqual(job.id, randomId.id)
    })

    test('Debe enviar 404 cuando el ID no existe', async () => {
        const invalidID ='6660000000'
        const json = await handleGetResponseAndCheckStatus(`/jobs/${invalidID}`, 404)
        assert.ok(json.error)
    })

})

/* Handle para PUT*/
const handlePutResponseAndCheckStatus = async ({ path = '/', body }, status = 204) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    const response = await fetch(`${BASE_URL}${normalizedPath}`, {
        method: 'PUT',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(body)
    })

    assert.strictEqual(response.status, status) 
    return response 
}

describe('PUT/jobs/:id', () => {
    test('Debe recibir 204 y actualizar el trabajo', async () => {
        const vId = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'

        const updatedJob = {
            titulo: 'Nuevo Titulo',
            empresa: 'Nueva Empresa',
            ubicacion: 'Nueva Ubicación',
            descripcion: 'Nueva descripción',
            data: {
                technology: ['nuevo', 'nuevo'],
                modalidad: 'remoto',
                nivel: 'junior'
            }
        }

        // PUT
        const putResp = await handlePutResponseAndCheckStatus({
            path: `/jobs/${vId}`,
            body: updatedJob
        }, 204)

        assert.strictEqual(putResp.status, 204)

        // GET para verificar que se actualizó
        const jobData = await handleGetResponseAndCheckStatus(`/jobs/${vId}`, 200)

     
        assert.strictEqual(jobData.titulo, updatedJob.titulo)
        assert.strictEqual(jobData.empresa, updatedJob.empresa)
        assert.strictEqual(jobData.ubicacion, updatedJob.ubicacion)
        assert.strictEqual(jobData.descripcion, updatedJob.descripcion)

        assert.deepStrictEqual(jobData.data.technology, updatedJob.data.technology)
        assert.strictEqual(jobData.data.modalidad, updatedJob.data.modalidad)
        assert.strictEqual(jobData.data.nivel, updatedJob.data.nivel)
    })

    test('Debe devolver 404 cuando el ID no existe', async () => {
        const invalidId = 'id-inexistente-123'

        const updatedJob = {
            titulo: 'No importa',
            empresa: 'No importa',
            ubicacion: 'No importa',
            descripcion: 'No importa',
            data: {
                technology: ['x'],
                modalidad: 'remoto',
                nivel: 'junior'
            }
        }

        const response = await handlePutResponseAndCheckStatus({
            path: `/jobs/${invalidId}`,
            body: updatedJob
        }, 404)

        assert.strictEqual(response.status, 404)
    })
})

/* Handle para PATCH*/
    const handlePatchResponseAndCheckStatus = async ({ path = '/', body }, status = 204) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    const response = await fetch(`${BASE_URL}${normalizedPath}`, {
        method: 'PATCH',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(body)
    })

    assert.strictEqual(response.status, status) 
    return response 
}


    describe('PATCH/jobs/:id',() =>{
        test('Debe recibir 204 y actualizar solo los campos enviados', async () => {
            const validId = 't1u6q7r0-5p29-1q60-s6t1-0x3o4p6q7s9t' 

            const updatedJob = {
                titulo : 'Nuevo Títulooooo',
                ubicacion: 'Nueva Ubicaciónnnnnnnn'
            }

            const patchResp = await handlePatchResponseAndCheckStatus({
                path:`/jobs/${validId}`,
                body: updatedJob
            }, 204)
            assert.strictEqual(patchResp.status, 204)

            const jobData = await handleGetResponseAndCheckStatus(`/jobs/${validId}`, 200)

            assert.strictEqual(jobData.titulo, updatedJob.titulo)
            assert.strictEqual(jobData.ubicacion, updatedJob.ubicacion)

        })

        test('Debe devolver 404 cuando el ID no existe (en PATCH)', async () => {
            const invId = 'id-inexistente-2555'

            const updatedJob = {
                titulo: 'No valido',
                ubicacion:'No valida'
            }

            const response = await handlePatchResponseAndCheckStatus({
            path: `/jobs/${invId}`,
            body: updatedJob
            }, 404)
            assert.strictEqual(response.status, 404)
        })

    })
        
/* Handle para DELETE*/
    const handleDeleteResponseAndCheckStatus = async ({ path = '/', body }, status = 204) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    const response = await fetch(`${BASE_URL}${normalizedPath}`, {
        method: 'DELETE',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(body)
    })

    assert.strictEqual(response.status, status) 
    return response 
}

/* Handle para status*/
    const handleStatusOnly = async ({ path = '/', body }, status = 204) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    const res = await fetch(`${BASE_URL}${normalizedPath}`)

    assert.strictEqual(res.status, status) 
    return {status: res.status}
}



describe('DELETE/jobs/:id', () => {
    test('Debe recibir 204 y eliminar el trabajo', async () => {
        const vaId = '7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4' 
        const delResp = await handleDeleteResponseAndCheckStatus({
            path: `/jobs/${vaId}`,
        }, 204)

        assert.strictEqual(delResp.status, 204)

       
        const getResp = await handleStatusOnly(`/jobs/${vaId}`, 404)
        assert.strictEqual(getResp.status, 404)
    })
})


