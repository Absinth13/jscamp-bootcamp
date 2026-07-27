import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'

export const jobsRouter = Router() 


jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getId )
jobsRouter.post('/', JobController.create)
jobsRouter.put('/:id',JobController.fullUpdate)
jobsRouter.patch('/:id', JobController.partialUpdate)
jobsRouter.delete('/:id', JobController.delete)


   
