import {useEffect, useState } from "react";
import {SearchFormSection} from "../components/SearchFromSection.jsx";
import { JobListings } from "../components/JobListings.jsx";
import {Pagination} from "../components/Pagination.jsx"; 

const RESULTS_PER_PAGE = 4

const useFilters = () =>{
  const [filters, setFilters] = useState ({
    
      technology: '',
      location: '',
      experienceLevel: '',
  })
  const [textToFilter, setTextToFilter]= useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [jobs,setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    async function fetchJobs(){
      try {
        setLoading(true)
       const params = new URLSearchParams () 
       if (textToFilter) params.append ('text', textToFilter)
       if (filters.technology)params.append('technology', filters.technology)
       if (filters.location)params.append('type', filters.location)
       if (filters.experienceLevel)params. append('level',filters.experienceLevel)

      const offset = (currentPage -1) * RESULTS_PER_PAGE
      params.append('limit', RESULTS_PER_PAGE)
      params.append('offset', offset)
      const queryParams = params.toString()
      
// await new Promise ((resolve) => setTimeout(resolve, 1500)) para cuando se abre con 3G

        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${queryParams}`)
        const json = await response.json()

        setJobs(json.data)
        setTotal(json.total)
      } catch(error){
        console.error('error fetching jobs' , error)
      }finally {
        setLoading(false)
      }
    } 
    fetchJobs()
  }, [filters, textToFilter, currentPage])

 

const totalPages = Math.ceil(total / RESULTS_PER_PAGE) 


  const handlePageChange = (page) => {
   setCurrentPage(page)
  }

  const handleSearch = (filters) => {
    setFilters(filters)
    setCurrentPage(1)

  }

  const handleTextFilter = (newTextToFilter) => {
    setTextToFilter(newTextToFilter)
    setCurrentPage(1)
  }

  return{
    loading,
    jobs,
    total,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter
  }
}

export function SearchPage() {
  const{
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter
  
}= useFilters()

const title = loading
? `Cargando... -DevJobs`
:`Resultados: ${total}, Página ${currentPage} - DevJobs`
//me muestra el resultado en la pestaña dependiendo en que página este
 return (
<main>
  <title>{title}</title>
       <SearchFormSection onSearch={handleSearch} onTextFilter= {handleTextFilter}/>

        <section>
          <h2 style={{textAlign:'center'}}>Resultados de búsqueda</h2>
          {
            loading ? <p>Cargando empleos...</p> : <JobListings jobs={jobs}/> 
          }
          
          <Pagination currentPage = {currentPage} totalPages= {totalPages} onPageChange={handlePageChange}/>
        </section>
</main>
)
}

