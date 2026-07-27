
/* Recuerda que el modelo SOLO debe manejar la lógica de los datos, en este caso nuestro JSON */
import jobs from '../jobs.json' with { type: 'json' }
import crypto from 'node:crypto'

export class JobModel {
  static async getAll({ texto, titulo, level, limit = 10, technology, offset = 0 }) {

    const filteredJobs = jobs.filter(job => {

      const jobTitulo = job.titulo?.toLowerCase() ?? ''
      const descripcion = job.descripcion?.toLowerCase() ?? ''
      const tecnologias = job.data?.technology ?? []
      const jobLevel = job.data?.nivel?.toLowerCase() ?? ''

      if (texto) {
        const searchTerm = texto.toLowerCase()
        if (!jobTitulo.includes(searchTerm) && !descripcion.includes(searchTerm)) {
          return false
        }
      }

     
      if (titulo) {
        if (!jobTitulo.includes(titulo.toLowerCase())) {
          return false
        }
      }


      if (level) {
        if (jobLevel !== level.toLowerCase()) {
          return false
        }
      }


      if (technology) {
        if (!tecnologias.includes(technology.toLowerCase())) {
          return false
        }
      }

      return true
    })

    const limitNumber = Number(limit)
    const offsetNumber = Number(offset)

    const paginatedJobs= filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

    return {data:paginatedJobs, total: filteredJobs.length, limit:limitNumber, offset:offsetNumber }  

    
  }

  static async getById(id){
    const job = jobs.find(job => job.id === id)
    return job
  }

  static async create({titulo, empresa, ubicacion, data}){
    const newJob = {
    id: crypto.randomUUID(),
    titulo, 
    empresa, 
    ubicacion,
    data
  }

    jobs.push(newJob)

    return(newJob)

    }



    static async fullUpdate(id, updateData) {
    const jobIndex = jobs.findIndex(job => job.id === id)
     if (jobIndex === -1) return null

    jobs[jobIndex] = {
    ...updateData,
    id  
    }

    return jobs[jobIndex]
    }

    static async partialUpdate(id, partialData) {
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return null

    jobs[jobIndex] = {
    ...jobs[jobIndex],
    ...partialData 
    }

   return jobs[jobIndex]
}
  static async delete (id){
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return null
    jobs.splice(jobIndex, 1)
    return true
  }



}
