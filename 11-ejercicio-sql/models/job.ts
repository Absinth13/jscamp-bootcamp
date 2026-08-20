import crypto from 'node:crypto'
import { db } from '../db/database.js'
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    let query = `
    SELECT 
    j.*,
    GROUP_CONCAT(jt.technology, ',') AS technologies
    FROM jobs j 
    JOIN job_technologies jt ON j.id = jt.job_id  `

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

    if (filters?.limit){
    query += ' LIMIT ? '
    params.push(filters.limit)
    }

   if (filters?.offset){
   query += ' OFFSET ? '
   params.push(filters.offset)
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
  

   
    return []
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

    
    return undefined
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

    insertJob.run(
      newJob.id,
      newJob.title,
      newJob.company,
      newJob.location,
      newJob.description,
      newJob.data.modality,
      newJob.data.level
    )

    const insertTech = db.prepare(`
      INSERT INTO job_technologies (job_id, technology)
      VALUES (?, ?)
    `)

    for (const tech of newJob.data.technology) {
      insertTech.run(newJob.id, tech)
    }

  
    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
   const result = db. prepare('DELETE FROM jobs WHERE id = ?').run(id)
    return false
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
   const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id) as Job
   if(!job) return null

   const fields: string[] = []
   const values: any[] = []
 
  if (input.title !== undefined) {
    fields.push('title = ?')
    values.push(input.title)
  }

  if (input.company !== undefined) {
    fields.push('company = ?')
    values.push(input.company)
  }

  if (input.location !== undefined) {
    fields.push('location = ?')
    values.push(input.location)
  }

  if (input.description !== undefined) {
    fields.push('description = ?')
    values.push(input.description)
  }

  if (input.data?.modality !== undefined) {
    fields.push('modality = ?')
    values.push(input.data.modality)
  }

  if (input.data?.level !== undefined) {
    fields.push('level = ?')
    values.push(input.data.level)
  }

  if (fields.length === 0) return job

  const sql = `
    UPDATE jobs
    SET ${fields.join(', ')}
    WHERE id = ?
  `

  db.prepare(sql).run(...values, id)

  // Tecnologías en caso de aparecer
  if (input.data?.technology) {
    db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)

    const insertTech = db.prepare(`
      INSERT INTO job_technologies (job_id, technology)
      VALUES (?, ?)
    `)

    for (const tech of input.data.technology) {
      insertTech.run(id, tech)
    }
  } 
  return job
    
  }
}

