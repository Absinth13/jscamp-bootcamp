import{useState, useEffect} from 'react'
import{useParams, useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom'
import snarkdown from 'snarkdown'
import styles from './Detail.module.css'
import { useAuthStore } from "../store/authStore"
import { useFavoritesStore } from "../store/favoritesStore"

function JobSection({title, content}){
    const html = snarkdown(content || "")
    
    return(
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}> 
            {title}
            </h2>

            <div className={`${styles.sectionContent} prose`} 
            dangerouslySetInnerHTML= {{__html:html}}/>

        </section>
    )

}

function DetailPageBreadCrumb({job}){
    return(
        <div className={styles.container}>
            <nav className={styles.breadcrumb}>
                <Link to="/search" className={styles.breadcrumbButton}>
                 Empleos
                </Link>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbCurrent}>{job.titulo}</span>
            </nav>
        </div> 
    )
}

function DetailPageHeader({ job, children }) {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>{job.titulo}</h1>
        <p className={styles.meta}>{job.empresa} - {job.ubicacion}</p>
      </header>
    <div className={styles.headerActions}>
     <DetailApplyButton/>
     <DetailFavoriteButton jobId={job.id}/>
     </div>
    </>
  )
}

function DetailApplyButton(){
  const {isLoggedIn} = useAuthStore()
    return (
        <button disabled={!isLoggedIn} className={styles.applyButton}>
          {isLoggedIn ? "Aplicar ahora" : "Inicia sesión para aplicar"}
        </button>
      )
}

function DetailFavoriteButton({ jobId }) {
  const { isFavorite, toggleFavorite } = useFavoritesStore()
  return(
     <button onClick ={() => toggleFavorite(jobId)} 
             aria-label={isFavorite(jobId) ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
             {isFavorite(jobId) ? '❤️' : '🤍'}
     </button>
  )
}


export default function JobDetail({}){
    const {jobId} = useParams()
   
    const navigate = useNavigate()

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null) 

    useEffect(() =>{
     fetch(`https://jscamp-api.vercel.app/api/jobs/${jobId}`)
        .then(response => {
            if (!response.ok) throw new Error ('Error, trabajo no encontrado')
                return response.json()
            })
             
            .then(json =>{ 
                
                setJob(json)
    
            })
            .catch(error =>{
                setError(error.message)

            })

            .finally(() =>{
                setLoading(false)
            })

    }, [jobId])

    if (loading){
         return (
           <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0" }}>
             <div className={styles.loading}>
               <p className={styles.loadingText}>Cargando...</p>
             </div>
           </div>
         )
    }
       
    if (error || !job ){
       return (
             <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
               <div className={styles.error}>
                 <h2 className={styles.errorTitle}>Oferta no encontrada</h2>
                 <button
                   onClick={() => navigate("/")}
                   className={styles.errorButton}>
                   Volver al inicio
                 </button>
               </div>
             </div>
           ) 
    }
  console.log(job)

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
      <DetailPageBreadCrumb job={job} />
      <DetailPageHeader job={job} />

      <JobSection title="Descripción del puesto" content={job.content.description} />
      <JobSection title="Responsabilidades" content={job.content.responsibilities} />
      <JobSection title="Requisitios" content={job.content.requirements} />
      <JobSection title="Acerca de la empresa" content={job.content.about} />
    </div>
  )
}