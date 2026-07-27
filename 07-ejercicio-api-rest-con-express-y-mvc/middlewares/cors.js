import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:1234',
  'https://midu.dev',
  'http://jscamp.dev',
  'http://localhost:5173'
]

export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => {
    return cors({
    origin:(origin, callback) =>{
      if (!origin ||acceptedOrigins.includes(origin)){
        return callback(null, true)
      }
      return callback(new Error('Origen no permitido'))
    }
  })
}


