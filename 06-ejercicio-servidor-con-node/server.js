import { createServer } from 'node:http'
import {json} from 'node:stream/consumers'
import {randomUUID} from 'node:crypto'


process.loadEnvFile()

const port = process.env.PORT || 3000

function sendJson(res, statusCode, data){
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; chartset=utf-8')
  res.end(JSON.stringify(data))
}


const users = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    name: 'Miguel',
    age: 28,
  },
  {
    id: 'f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b',
    name: 'Mateo',
    age: 34,
  },
  {
    id: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
    name: 'Pablo',
    age: 22,
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
    name: 'Lucía',
    age: 31,
  },
  {
    id: '7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e',
    name: 'Ana',
    age: 26,
  },
  {
    id: '5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a',
    name: 'Juan',
    age: 29,
  },
  {
    id: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d',
    name: 'Sofía',
    age: 25,
  },
  {
    id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
    name: 'Carlos',
    age: 37,
  },
  {
    id: '4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f',
    name: 'Elena',
    age: 23,
  },
  {
    id: '0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b',
    name: 'Diego',
    age: 30,
  },
]

const server = createServer(async (req, res) => {
  const { method, url } = req
  const newUrL = new URL(url, `http://localhost:${port}`)
 
  // GET /users filtros + paginación
  if (method === 'GET' && newUrL.pathname === '/users') {
  
  const nameQry = newUrL.searchParams.get('name')
  const limit = parseInt(newUrL.searchParams.get('limit')) || users.length
  const offset = parseInt(newUrL.searchParams.get('offset'))|| 0
  const minAge = parseInt(newUrL.searchParams.get('minAge'))
  const maxAge = parseInt(newUrL.searchParams.get('maxAge'))
  
  let filteredUsers = users
 //Filtrado por nombre
  if (nameQry) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().startsWith(nameQry.toLowerCase())
      )
     return sendJson(res, 200, filteredUsers)
  }

  //Filtro por edad 
  if(!isNaN(minAge)){
    filteredUsers = filteredUsers.filter(user => user.age >= minAge)
  }
  if(!isNaN(maxAge)){
    filteredUsers = filteredUsers.filter(user => user.age <= maxAge)
  }
  //paginación 
  const pagUsers = filteredUsers.slice(offset, offset + limit)
  return sendJson(res, 200,pagUsers)
}

  // GET /health
  if (method === 'GET' && newUrL.pathname === '/health') {
    return sendJson(res, 200, { status: 'ok', uptime: process.uptime() })
  }

  // POST /users
  if (method === 'POST' && newUrL.pathname === '/users') {
    const body = await json(req)
    
    if (!body || !body.name && !body || !body.age){
       return sendJson(res, 404, { error: 'Name and age is required' })
    } 
            
    const newUser = {
      name: body.name,
      age: body.age,
      id: randomUUID(),
    }

    users.push(newUser)
    return sendJson(res, 201, { message: 'Usuario creado', user: newUser })
  }

  // Si no coincide ninguna ruta marcar error
  return sendJson(res, 404, { error: 'Not Found' })
})

server.listen(port, () => {
  const address = server.address()
  console.log(`Servidor escuchando en http://localhost:${address.port}`)
})