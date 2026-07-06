import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate} from 'react-router-dom'
import { Pagination } from '../components/Pagination.jsx'
import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { JobListings } from '../components/JobListings.jsx'

   
const RESULTS_PER_PAGE = 4

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => {
    
    return {
      technology: searchParams.get('technology') || '',
      location: searchParams.get('type') || '',
      experienceLevel: searchParams.get('level') || ''
    }
  })
  const [textToFilter, setTextToFilter] = useState(() => searchParams.get('text') || '')
  

  const [currentPage, setCurrentPage] = useState(() => {
   
    const page = Number(searchParams.get('page'))
    return Number.isNaN(page) ? 1 : page
  })

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()


 useEffect(() =>{
     async function fetchJobs(){
       try {
         setLoading(true)
 
         const params = new URLSearchParams()
         function appendParamIfExist(key, value) {
         if (value) params.append(key, value)
        }
 
        appendParamIfExist('text', textToFilter)
        appendParamIfExist('technology', filters.technology)
        appendParamIfExist('type', filters.location)
        appendParamIfExist('level', filters.experienceLevel)
     
        const queryParams = params.toString()
      
        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${queryParams}`)
        const json = await response.json()

        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [filters, currentPage, textToFilter])

  useEffect(() => {
    setSearchParams((params)=> {

    if (textToFilter) params.set('text', textToFilter)
    if (filters.technology) params.set('technology', filters.technology)
    if (filters.location) params.set('type', filters.location)
    if (filters.experienceLevel) params.set('level', filters.experienceLevel)

    if (currentPage > 1) params.set('page', currentPage)

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    return params
    })
    

  }, [filters, currentPage, textToFilter, setSearchParams])

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

  return {
    loading,
    jobs,
    total,
    totalPages,
    currentPage,
    textToFilter,
    handlePageChange,
    handleSearch,
    handleTextFilter
  }
}

export default function SearchPage() {
  const {
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    textToFilter,
    handlePageChange,
    handleSearch,
    handleTextFilter
  } = useFilters()

  const title = loading
    ? `Cargando... - DevJobs`
    : `Resultados: ${total}, Página ${currentPage} - DevJobs`

  return (
    <main>
      <title>{title}</title>
      <meta name="description" content="Explora miles de oportunidades laborales en el sector tecnológico. Encuentra tu próximo empleo en DevJobs." />

      <SearchFormSection
        initialText={textToFilter}
        onSearch={handleSearch}
        onTextFilter={handleTextFilter}
      />

      <section>
        <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

        {
          loading ? <p>Cargando empleos...</p> : <JobListings jobs={jobs} />
        }
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>
    </main>
  )
}
