 import { JobCard } from './JobCard.jsx'

 
  export function JobListings({jobs}){
    return (
      <>
      <h2 style={{textAlign:'center'}}>Resultados de búsqueda</h2>

        <div className="jobs-listings">
        {jobs.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%' }}>
            "No se han encontrado empleos que coincidan con los criterios de búsqueda".
          </p>
        ) : (
          jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        )}
          </div>
        </>
    ) 
  }