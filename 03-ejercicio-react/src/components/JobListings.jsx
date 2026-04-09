 import { JobCard } from './JobCard.jsx'

 
  export function JobListings({jobs}){
    /* Genial! Podemos separar esto en dos `if`, así queda más legible */

    // 1. si no hay resultados, mostramos un mensaje
    if(jobs.length === 0) {
      return (
        <p style={{ textAlign: 'center', width: '100%', padding: '1rem', textWrap:'balance' }}>
          "No se han encontrado empleos que coincidan con los criterios de búsqueda".🥲
        </p>
      )
    }

    // 2. si hay resultados, los mostramos
    return (
      <>
      <div className="jobs-listings">
        {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
          </div>
        </>
    ) 
  }