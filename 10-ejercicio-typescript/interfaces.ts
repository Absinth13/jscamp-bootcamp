/* En este archivo deberás tipar las interfaces de los servicios de búsqueda y aplicación a empleo */
import type { Job } from './objects'
import type { ApplicationStatus, ExperienceLevel, Technology } from './types'
//import type { AdvancedSearchOptions} from './optionals'

import {
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
  searchJobs,
} from './functions.ts'

// Interface para servicios de búsqueda
export interface JobSearchService {
  /* Deberás definir los tipos de las funciones */
  searchJobs(jobs: Job[], searchTerm: string ): Job[]
  filterByExperience(jobs: Job[], level: ExperienceLevel): Job[]
  filterByTechnology(jobs: Job[], tech: Technology): Job[]
  filterByMinSalary(jobs: Job[], minSalary: number): Job[]
  //advancedSearch(jobs: Job[], options: AdvancedSearchOptions): Job[];
  
}

export const searchService: JobSearchService = {
  searchJobs,
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
  
}

// Interface para aplicación a empleo
export interface JobApplication {
  id: string
  jobId: string
  candidateId: string // Ojo que había una `d` de más
  status: ApplicationStatus 
  appliedDate: Date
  coverLetter?: string
}

// Interface que extiende Job con propiedades adicionales
export interface DetailedJob extends Job { // Debe extender de Job
  benefits: string[]
  requirements: string[]
  applicationDeadline?: Date
}
