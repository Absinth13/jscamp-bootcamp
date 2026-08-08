/* Aquí deberás tipar los parámetros y el valor de retorno de las funciones, teniendo en cuenta que existen parámetros opcionales y valores por defecto */

import type {ExperienceLevel , Technology, WorkMode} from './types'
import type { Job } from './objects'

import {
  searchJobs,
  filterByExperience,
  filterByTechnology,
  filterByMinSalary,
} from './functions'

// Función de búsqueda avanzada con opcionales
export type AdvancedSearchOptions = {
  text?: string
  level?: ExperienceLevel
  technology?: Technology
  minSalary?: number
  workMode?: WorkMode
}

export function advancedSearch(jobs: Job[], options:AdvancedSearchOptions ): Job[] {
  let results = jobs

  if (options.text) {
    results = searchJobs(results, options.text)
  }

  if (options.level) {
    results = filterByExperience(results, options.level)
  }

  if (options.technology) {
    results = filterByTechnology(results, options.technology)
  }

  if (options.minSalary) {
    results = filterByMinSalary(results, options.minSalary)
  }

  if (options.workMode) {
    results = results.filter((job) => job.workMode === options.workMode)
  }

  return results
}

// Función con valores por defecto
export function getRecentJobs(jobs: Job[], days: number = 30): Job[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return jobs.filter((job) => job.postedDate >= cutoffDate)
}
