/* Aquí debe ir la lógica de tu controlador */
import { DEFAULTS } from '../config.js'
import { JobModel } from '../models/job.js'

export class JobController {
    static async getAll(req, res){
        // Ahora se llama `texto`
        const { texto, titulo, level, type, ubicacion, page = 1, limit = DEFAULTS.LIMIT_PAGINATION, 
        technology} = req.query

        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)

        const offset = (pageNum - 1) * limitNum

        const {data, total} = await JobModel.getAll({ texto, titulo, level, limit, technology, offset, type, ubicacion, limit: limitNum, offset })
         res.set('Cache-Control', 'no-store')
         return res.json({ data, total, limit: limitNum, offset, page: pageNum})
    }

    static async getId(req, res){
        const {id} = req.params
        const job = await JobModel.getById(id)
        if(!job) {
            return res.status(404).json({error: 'Job not found'})
        }
        return res.json(job)
    }

    //POST

    static async create(req, res){
    const { titulo, empresa, ubicacion, data} = req.body
    const newJob = await JobModel.create({titulo, empresa, ubicacion, data})
    
    return res.status(201).json(newJob)

    }
    //PUT

    static async fullUpdate(req, res) {
    const { id } = req.params
    const updateData = req.body

    const updatedJob = await JobModel.fullUpdate(id, updateData)

    if (!updatedJob) {
    return res.status(404).json({ message: 'No existe este empleo' })
    }

    return res.json(updatedJob)
    }

    //PATCH

    static async partialUpdate(req, res) {
     const { id } = req.params
    const { titulo } = req.body

    const updatedJob = await JobModel.partialUpdate(id, { titulo })

     if (!updatedJob) {
    return res.status(404).json({ message: 'Empleo no existente' })
    }

    return res.json(updatedJob)
    }

    //DELETE

    static async delete(req, res){
        
     const {id} = req.params
     
     const deleted = await JobModel.delete(id)

       if (!deleted){
      return res.status(404).json({message: 'Este empleo no existe'})
        }
     return res.status(204).send()

        
    }
}






    
