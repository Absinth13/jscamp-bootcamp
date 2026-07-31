import { JobModel } from "../models/job.js"
import { DEFAULTS } from "../config.js"

export class JobController {
    static async getAll(req, res){

        const { text, technology, type, level, limit = DEFAULTS.LIMIT_PAGINATION, offset = DEFAULTS.OFFSET_PAGINATION } = req.query

        const { paginatedJobs, limitNumber, offsetNumber } = await JobModel.getAll({ text, technology, type, level, limit, offset }) 

        return res.json({ data: paginatedJobs, total: paginatedJobs.length, limit: limitNumber, offset: offsetNumber})
    }

    static async getId(req, res){
        console.log("ID recibido:", req.params.id)
     
        const { id } = req.params

        const {status, job} = await JobModel.getId(id)

        if(!job){
            return res.status(400).json({error:'Job not found'})
        }
        
        return res.status(status).json(job)
    }

    static async create(req, res){
        
        const { titulo, empresa, ubicacion, descripcion, data } = req.body

        const {status, newJob} = await JobModel.create({ titulo, empresa, ubicacion, descripcion, data })
        
        return res.status(status).json({ newJob })
    }

    static async update(req, res){

        const { id } = req.params
        const sentJob = req.body
        

        const { status, error } = await JobModel.update({ id, sentJob })
        
        if (error) {
        return res.status(status).json({ error })
         }

         return res.status(status).json({ message: 'Job updated successfully' }) 
         }
    
    
    static async partialUpdate(req, res){
        const { id } = req.params
        const sentJob = req.body

        const { status, error } = await JobModel.partialUpdate({ id, sentJob })
        
        return error
            ? res.status(status).json(error)
            : res.status(status).send()
    }

    static async delete(req, res){

        const { id } = req.params
        
        const { status, error } = await JobModel.delete(id)

        return error
            ? res.status(status).json(error)
            : res.status(status).send()
    }
}
