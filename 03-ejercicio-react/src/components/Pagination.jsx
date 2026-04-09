import styles from './Pagination.module.css'
export function Pagination({currentPage =1, totalPages=10 , onPageChange}){

  const pages = Array.from({length: totalPages}, (_, i)=> i + 1)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages
  
  const stylePrevButton = isFirstPage ? {pointerEvents : 'none', opacity: 0.4} : {}
  const styleNextButton = isLastPage ? {pointerEvents : 'none', opacity:0.4} : {}

  const handlePrevClick = (event) =>{
    event.preventDefault()
    /* Esto está genial! Pero... que pasa si tenemos mas funcionalidades que agregar dentro del if? Queda un poco feo. Hay una manera de programar que nos permite evaluar el caso negativo primero y luego el caso positivo, así no tenemos que colocar lógica dentro de `if` */
    /* if(!isFirstPage){
      onPageChange(currentPage -1)
    } */

    // 1. Esto se lee como: "Si no es la primera página, entonces cambia de página"
    // 2. Esto se lee como: "Si es la primera página, no hagas nada"
    if(!isFirstPage){
      onPageChange(currentPage -1)
    }

    // Pero si lo cambiamos, podemos leerlo así:
    // 1. Esto se lee como: "Si es la primera página, no hagas nada"
    // 2. Esto se lee como: "Si no es la primera página, entonces cambia de página"
    if(isFirstPage) return
    onPageChange(currentPage -1)
  }

  const handleNextClick = (event)=> {
    event.preventDefault()
    if (isLastPage) return
    onPageChange(currentPage + 1)
  }

  const handleChangePage = (event, page) =>{
    event.preventDefault()
    
    if (page === currentPage) return
    onPageChange(page)
  }


return(
     <nav className={styles.pagination}>
      { !isFirstPage && (
           <a href="#" style={stylePrevButton} onClick={handlePrevClick}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M15 6l-6 6l6 6" />
              </svg>
            </a> ) }

            {pages.map(page => (
              <a key={page} data-page={page} href="#" className={currentPage === page ? styles.isActive :''} 
                 onClick={(event) => handleChangePage(event, page)}>
                {page}
              </a>
            ))} 
              
            {isLastPage === false &&(
            <a href="#" style={styleNextButton} onClick={handleNextClick}>  
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"stroke="currentColor"
                strokeWidth="1.5"strokeLinecap="round" strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M9 6l6 6l-6 6" />
              </svg> 
              
            </a> )}
          </nav> 
    )
  }