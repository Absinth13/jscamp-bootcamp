import {Header} from "./components/Header.jsx";
import {Footer} from "./components/Footer.jsx";
import {HomePage} from "./pages/Home.jsx"
import {SearchPage} from "./pages/Search.jsx"
import {Route} from "./components/Route.jsx"
import {NotFoundPage} from "./pages/404.jsx"

function App() {
return (
    <>
      <Header />
      
      <Route path= "/search" component={SearchPage}/>
      <Route path= "/" component={HomePage}/>
      {/* Podemos renderizar el componente sin ningún path y así poder mostrar una página 404. Dentro está la lógica */}
      <Route component={NotFoundPage}/>
      
      {/* Esto esta bien porque funciona, pero si tenemos muchos paths, podría ser complicado de mantener. Una alternativa es lo que te voy a mostrar dentro del componente Route */}
      {/* {currentPath !== "/" && currentPath !== "/search" && (
      <NotFoundPage />
)} */}
   
      <Footer />
    </>
  )
}

export default App;