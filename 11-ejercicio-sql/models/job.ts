import crypto from 'node:crypto'
import { db } from '../db/database.js'
import type { CreateJobDTO, Job, JobFilters, UpdateJobDTO } from '../types'

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    let query = `
    SELECT 
    j.*,
    GROUP_CONCAT(jt.technology, ',') AS technologies
    FROM jobs j 
    -- Remplazamos el JOIN por LEFT JOIN para no excluir jobs sin tecnologías
    -- JOIN job_technologies jt ON j.id = jt.job_id
    LEFT JOIN job_technologies jt ON j.id = jt.job_id  `

    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.technology){
     conditions.push(`
      j.id IN (
      SELECT job_id 
      FROM job_technologies  
      WHERE LOWER(technology) = LOWER(?)
      )
      `)
    
    params.push(filters.technology)
    }

    if(filters?.modality){
      conditions.push(' j.modality = ? ')
      params.push(filters.modality)
    }

    if(filters?.level){
      conditions.push(' j.level = ? ')
      params.push(filters.level)
    }

    if(conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' GROUP BY j.id '

    // Mejoramos el `if` evitando que de resultados truthy como 0 o ''. Y pasamos el valor a Number.
    // if (filters?.limit){
    if (filters?.limit !== undefined){
    query += ' LIMIT ? '
    // params.push(filters.limit)
    params.push(Number(filters.limit))
    }

   // if (filters?.offset){
   if (filters?.offset !== undefined){
   query += ' OFFSET ? '
   // params.push(filters.offset)
   params.push(Number(filters.offset))
   }

    const rows = db.prepare(query).all(...params) as {
      id: string
      title: string
      company: string
      location: string
      description: string
      modality: string
      level: string
      technologies: string
    }[]

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
      technology: row.technologies ? row.technologies.split(',') : [],
      modality: row.modality as 'remote' | 'onsite' | 'hybrid',
      level: row.level as 'junior' | 'mid' | 'senior'
      }
    }))

    // Este return nunca llega a retornarse
    // return []
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
   const query = `
    SELECT j.*, GROUP_CONCAT(jt.technology, ',') AS technologies
    FROM jobs j
    LEFT JOIN job_technologies jt ON j.id = jt.job_id
    WHERE j.id = ?
    GROUP BY j.id `

    const row = db.prepare(query).get(id) as
      | {
          id: string
          title: string
          company: string
          location: string
          description: string
          modality: string
          level: string
          technologies: string
        }
      | undefined

       if (!row) return undefined

    return {
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technologies ? row.technologies.split(',') : [],
        modality: row.modality as 'remote' | 'onsite' | 'hybrid',
        level: row.level as 'junior' | 'mid' | 'senior'
      }
    }

    // aquí lo mismo, nunca llega a retornarse
    // return undefined
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }

    const insertJob = db.prepare(`
      INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    // Envolvemos la incersión de datos en una transaction para hacer un rollback en caso de error
    // insertJob.run(
    //   newJob.id,
    //   newJob.title,
    //   newJob.company,
    //   newJob.location,
    //   newJob.description,
    //   newJob.data.modality,
    //   newJob.data.level
    // )

    const insertTech = db.prepare(`
      INSERT INTO job_technologies (job_id, technology)
      VALUES (?, ?)
    `)

    // for (const tech of newJob.data.technology) {
    //   insertTech.run(newJob.id, tech)
    // }

    const insert = db.transaction(() => {
      insertJob.run(
        newJob.id,
        newJob.title,
        newJob.company,
        newJob.location,
        newJob.description,
        newJob.data.modality,
        newJob.data.level
      )
      for (const tech of newJob.data.technology) {
        insertTech.run(newJob.id, tech)
      }
    })
    insert()

  
    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
   const result = db. prepare('DELETE FROM jobs WHERE id = ?').run(id)
    // No tiene que retornar `false` siempre. SI `result.changes` es mayor a 0 significa que se eliminó una fila, en ese caso si devolvemos true. De lo contrario devolvemos false
    // return false
    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    // Comentamos el código para que te quede. Lo que hicimos fue validar existencias, actualizar y que se devuelve el estado real re-consultado
    // const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id) as Job
    // if(!job) return null
    //
    // const fields: string[] = []
    // const values: any[] = []
    //
    // if (input.title !== undefined) {
    //   fields.push('title = ?')
    //   values.push(input.title)
    // }
    //
    // if (input.company !== undefined) {
    //   fields.push('company = ?')
    //   values.push(input.company)
    // }
    //
    // if (input.location !== undefined) {
    //   fields.push('location = ?')
    //   values.push(input.location)
    // }
    //
    // if (input.description !== undefined) {
    //   fields.push('description = ?')
    //   values.push(input.description)
    // }
    //
    // if (input.data?.modality !== undefined) {
    //   fields.push('modality = ?')
    //   values.push(input.data.modality)
    // }
    //
    // if (input.data?.level !== undefined) {
    //   fields.push('level = ?')
    //   values.push(input.data.level)
    // }
    //
    // if (fields.length === 0) return job
    //
    // const sql = `
    //   UPDATE jobs
    //   SET ${fields.join(', ')}
    //   WHERE id = ?
    // `
    //
    // db.prepare(sql).run(...values, id)
    //
    // // Tecnologías en caso de aparecer
    // if (input.data?.technology) {
    //   db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)
    //
    //   const insertTech = db.prepare(`
    //     INSERT INTO job_technologies (job_id, technology)
    //     VALUES (?, ?)
    //   `)
    //
    //   for (const tech of input.data.technology) {
    //     insertTech.run(id, tech)
    //   }
    // }
    // return job

    if (!db.prepare('SELECT id FROM jobs WHERE id = ?').get(id)) return null

    const updates: string[] = []
    const values: unknown[] = []

    if (input.title !== undefined) { updates.push('title = ?'); values.push(input.title) }
    if (input.company !== undefined) { updates.push('company = ?'); values.push(input.company) }
    if (input.location !== undefined) { updates.push('location = ?'); values.push(input.location) }
    if (input.description !== undefined) { updates.push('description = ?'); values.push(input.description) }
    if (input.data?.modality !== undefined) { updates.push('modality = ?'); values.push(input.data.modality) }
    if (input.data?.level !== undefined) { updates.push('level = ?'); values.push(input.data.level) }

    if (updates.length > 0) {
      db.prepare(`UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`).run(...values, id)
    }

    const technology = input.data?.technology
    if (technology !== undefined) {
      const deleteTech = db.prepare('DELETE FROM job_technologies WHERE job_id = ?')
      const insertTech = db.prepare('INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)')
      // Se reemplazan las tecnologías de forma atómica
      db.transaction(() => {
        deleteTech.run(id)
        for (const tech of technology) insertTech.run(id, tech)
      })()
    }

    // Se re-consulta el job para devolver el estado real en la base
    return (await JobModel.getById(id)) ?? null
  }
}

