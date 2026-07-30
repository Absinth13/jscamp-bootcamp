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
import {test, describe, before, after} from 'node:test'
import assert from 'node:assert'
import app from './app.js'

let server 
const PORT = 3456 // se hace en un puerto que no utilizamos para evitar conflictos y los test funcionen siempre
const BASE_URL = `http://localhost:${PORT}`

//antes de todos los test se ejecuta para levantar el servidor 
before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, ()=> resolve())
    server.on('error', reject)

    })
  })

// después de todos los test, se ejecuta una vez, para cerrar el servidor
after(async () => {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) return reject(err)
                resolve()
        })
    })
})

describe('GET/jobs', () => {
    test('debe responder con 200 y un array de trabajos', async ()=> {
        const response = await fetch(`${BASE_URL}/jobs`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()
        assert.ok(Array.isArray(json.data), 'La respuesta debe ser un array')
    })
     
    test('debe filtrar por trabajos por tecnologia', async () =>{
        const tech = 'react'
        const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()
        console.log(json)
        assert.ok(
            json.data.every(job => job.data.technology.includes(tech)),
            `Todos los trabajos deben incluir la tecnologia${tech}`
        )
        
    })

    test('Debe respetar el límite de resultados'), async () =>{
        const limit = 2
        const response = await fetch(`${BASE_URL}/jobs=limit=${limit}`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()

        assert.strictEqual(json.limit, limit)
        assert.strictEqual(json.data.length, limit)
    }

    test ('Debe aplicar offset correctamente busca Analista de datos'), async () => {
        const offset = 1
        const response = await fetch(`${BASE_URL}/jobs=offset=${offset}`)
        assert.strictEqual(response.status, 200)

        const json = await response.json()
        const firstJob = json.data[0]
        assert.strictEqual( firstJob.id,'d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57' )
    }

})


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

        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify(newJob)
        })
        //Verificar status code 201
        assert.strictEqual(response.status, 201) 
        const json = await response.json()
        console.log(json)
        
        //Verificar que el job devuelto tiene un id generado
        assert.ok(json.newJob.id,' este job tiene un id generado' ) // 
       
        //Verificar que los datos coinciden con lo enviado

        assert.strictEqual(json.newJob.titulo, newJob.titulo)
        assert.strictEqual(json.newJob.empresa, newJob.empresa)
        assert.strictEqual(json.newJob.ubicacion, newJob.ubicacion)
        assert.strictEqual(json.newJob.descripcion, newJob.descripcion)
        assert.deepStrictEqual(json.newJob.data, newJob.data)
    })

    test('Probar con titulo de menos de 3 caracteres'), async () =>{
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
        const response = await fetch(`${BASE_URL}/jobs`,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newJob)
        })
        assert.strictEqual(response.status,400)
    }

    test('Probar con titulo de más de 100 caracteres'), async () => {
        const newJob = {
            titulo: 'e'.repeat(100),
            empresa: 'Innova',
            ubicacion: 'Espanya',
            descripcion: 'Buscamos un junior',
            data : {
                technology : ['jinja', 'react'],
                modalidad : 'remoto',
                nivel : 'junior'
            }
        }

        const response = await fetch(`${BASE_URL}/jobs`, {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newJob) 
        })

        assert.strictEqual(response.status,400)
    }

    test('Probar sin campo titulo'), async () => {
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

        const response = await fetch(`${BASE_URL}/jobs`, {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newJob) 
        })

        assert.strictEqual(response.status, 400)
    }

    test('Probar con titulo que no sea string '), async () => {
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

        const response = await fetch(`${BASE_URL}/jobs`, {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newJob) 
        })

        assert.strictEqual(response.status, 400)
    }

    test('Probar sin campo descripcion'), async () => {
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

        const response = await fetch(`${BASE_URL}/jobs`, {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newJob) 
        })
        const json = await response.json()
        console.log(json)
        assert.strictEqual(response.status,201)
    }
})

describe('GET/jobs/:id', () => {
    test('Devolver el trabajo con ID especificado'), async () => {
        const validId = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57' 
        const response = await fetch(`${BASE_URL}/jobs/${validId}`)

        assert.strictEqual(response.status, 200)

        assert.strictEqual(job.id,validId)
    }

    test('Debe enviar 404 cuando el ID no existe'), async() =>{
        const invalidID ='6660000000'
        const response = await fetch(`${BASE_URL}/jobs/${invalidID}`)
        assert.strictEqual(response.status,404)

        const json = await response.json()
        console.log(json)
        assert.ok(json.error)
    }

})

describe('PUT/jobs/:id', () => {
    test('Debe recibir 204 y actualizar el trabajo'), async()=>{
        const vId= 'bb8f2a99-6a20-4f9e-912a-16f54a49b8c3'// Especialista en Ciberseguridad 

        const updatedJob ={
           titulo: 'Nuevo Titulo',
            empresa: 'Nueva Empresa',
            ubicacion: 'Nueva Ubicación',
            descripcion: 'Nueva descripción',
            data : {
                technology : ['nuevo', 'nuevo'],
                modalidad : 'remoto',
                nivel : 'junior'
            }
        }

        const response = await fetch(`${BASE_URL}/jobs/${vId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedJob)
        })
        
        assert.strictEqual(response.status,204)
        //Hacer un GET del mismo job y verificar que se actualizó
        const getResp = await fetch(`${BASE_URL}/jobs/${vId}`)
        assert.strictEqual(getResp.status,200)
        
        const jobData = await getResp.json()

        const json= await response.json()
        console.log(json)

        assert.strictEqual(jobData.titulo, updatedJob.titulo)
        assert.strictEqual(jobData.empresa, updatedJob.empresa)
        assert.strictEqual(jobData.ubicacion, updatedJob.ubicacion)
        assert.strictEqual(jobData.descripcion, updatedJob.descripcion)

        assert.deepStrictEqual(jobData.data.technology, updatedJob.data.technology)
        assert.strictEqual(jobData.data.modalidad, updatedJob.data.modalidad)
        assert.strictEqual(jobData.data.nivel,updatedJob.data.nivel)
        }

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

        const response = await fetch(`${BASE_URL}/jobs/${invalidId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedJob)
        })

        assert.strictEqual(response.status, 404)
    })


    describe('PATCH/jobs/:id',() =>{
        test('Debe recibir 204 y actualizar solo los campos enviados', async () => {
            const validId = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405' // Ingeniero de DevOps

            const updatedJob = {
                titulo : 'Nuevo Títulooooo',
                ubicacion: 'Nueva Ubicaciónnnnnnnn'
            }

            const response = await fetch(`${BASE_URL}/jobs/${validId}`,{
                method: 'PATCH',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(updatedJob)
            })
            assert.strictEqual(response.status,204)

            const getResponse = await fetch(`${BASE_URL}/jobs/${validId}`)
            assert.strictEqual(getResponse.status,200)

            const jobData = await getResponse.json()
            assert.strictEqual(jobData.titulo, updatedJob.titulo)
            assert.strictEqual(jobData.ubicacion, updatedJob.ubicacion)

        })

        test('Debe devolver 404 cuando el ID no existe (en PATCH)'), async () =>{
            const invId = 'id-inexistente-2555'

            const updatedJob = {
                titulo: 'No valido',
                ubicacion:'No valida'
            }

            const response = await fetch(`${BASE_URL}/jobs/${invId}`, {
                method: 'PATCH',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify(updatedJob)
            })
            assert.strictEqual(response.status, 404)
        }

    })
        
})

describe('DELETE/jobs/:id', () => {
    test('Debe recibir 204 y eliminar el trabajo', async () => {
        const vaId = '7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4' // Desarrollador de Software Senior
        const response = await fetch(`${BASE_URL}/jobs/${vaId}`, {
            method: 'DELETE'
        })

        assert.strictEqual(response.status, 204)

       
        const getResponse = await fetch(`${BASE_URL}/jobs/${vaId}`)
        assert.strictEqual(getResponse.status, 404)
    })
})

