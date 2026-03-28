import {Header} from "./components/Header.jsx";
import {Footer} from "./components/Footer.jsx";
import {HomePage} from "./pages/Home.jsx"
import {SearchPage} from "./pages/Search.jsx"
import {Route} from "./components/Route.jsx"
import {useRouter} from "./hooks/useRouter.jsx"

import {NotFoundPage} from "./pages/404.jsx"

function App() {
  const {currentPath} = useRouter()
  
return (
    <>
      <Header />
      
      <Route path= "/search" component={SearchPage}/>
      <Route path= "/" component={HomePage}/>
      
      {currentPath !== "/" && currentPath !== "/search" && (
      <NotFoundPage />
)}
        
   
      <Footer />
    </>
  )
}

export default App;