
/* Recuerda que el modelo SOLO debe manejar la lógica de los datos, en este caso nuestro JSON */

import crypto from 'node:crypto'
import { DEFAULTS } from '../config.js'
import jobs from '../jobs.json' with { type: 'json' }

export class JobModel {
  // EN vez de valores hardcodeados, usaremos los que vienen de la constante global
 static async getAll({ texto, titulo, level, limit, technology, page, type, ubicacion }) {


    const filteredJobs = jobs.filter(job => {
      const normalizeText = (text) => {
      return text
       ?.toLowerCase()
       .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
       .trim()
}

      const jobTitulo = job.titulo?.toLowerCase() ?? ''
      const descripcion = job.descripcion?.toLowerCase() ?? ''
      const tecnologias = Array.isArray(job.data?.technology)
            ? job.data.technology.map(t => t.toLowerCase())
            : []
      const jobLevel = job.data?.nivel?.toLowerCase() ?? ''
      const searchTerm = texto?.toLowerCase() ?? ''
      const jobUbicacion = normalizeText(job.ubicacion)
      const ubicacionNormalized = normalizeText(ubicacion)
      const jobType = job.data?.modalidad?.toLowerCase() ?? ''
      
      const normalizeType = (t) => {
        if (!t) return null

        const map = {
          "remote": "remoto",
          "full-time": "remoto",
          "onsite": "presencial",
          "hybrid": "híbrido"
        }

        return map[t.toLowerCase()] ?? t.toLowerCase()
      }

      const normalizedType = normalizeType(type)
      
      // Podemos simplificar un poco esto, a ver que opinas:
      // De esta manera podemos agregar validaciones por separado
      const isInvalidText = texto && !jobTitulo.includes(searchTerm) && !descripcion.includes(searchTerm)
      const isInvalidTitle = titulo && !jobTitulo.includes(titulo.toLowerCase())
      const isInvalidLevel = level && jobLevel !== level.toLowerCase()
      const isInvalidTechnology = technology && !tecnologias.includes(technology.toLowerCase())
      const isInvalidUbicacion = ubicacion && jobUbicacion !== ubicacionNormalized
      const isInvalidType = normalizedType && jobType !== normalizedType

      if (
            isInvalidText ||
            isInvalidTitle ||
            isInvalidLevel ||
            isInvalidTechnology ||
            isInvalidType ||
            isInvalidUbicacion
          ) {
            return false
          }

          return true

        


      /* if (texto) {
        if (!jobTitulo.includes(searchTerm) && !descripcion.includes(searchTerm)) {
          return false
        }
      } */

     
      /* if (titulo) {
        if (!jobTitulo.includes(titulo.toLowerCase())) {
          return false
        }
      } */


      /* if (level) {
        if (jobLevel !== level.toLowerCase()) {
          return false
        }
      } */


      /* if (technology) {
        if (!tecnologias.includes(technology.toLowerCase())) {
          return false
        }
      } */
    })

    const pageNumber = Number(page) || 1
    const limitNumber = Number(limit) || DEFAULTS.LIMIT_PAGINATION
    const offsetNumber = (pageNumber - 1) * limitNumber

    const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

    return {data:paginatedJobs, total: filteredJobs.length, limit:limitNumber, offset:offsetNumber, page: pageNumber}  

    
  }

  static async getById(id) {
    return jobs.find(job => job.id === id)
  }

  static async create({titulo, empresa, ubicacion, data, ...props}){
    const newJob = {
      ...props, // <- Por si queremos agregar `content`, etc.
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
