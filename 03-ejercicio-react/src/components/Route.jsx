import {useRouter} from "../hooks/useRouter.jsx";

// Este array está fuera del componente, eso significa que no se va a reinicializar en cada renderizado. Por lo que sus valores se van a mantener
const VALID_PATHS = new Set()

export function Route ({path, component: Component}){
    const {currentPath} = useRouter()

    // 1. Si el path existe, lo guardamos en el conjunto de paths disponibles para navegar
    if(path) VALID_PATHS.add(path)

    // 2. Si el path actual coincide con el path de la ruta, renderizamos el componente
    if (currentPath === path) return <Component />

    // 3. Si no tiene path (ruta por defecto) y el path actual no está registrado, renderizamos el componente (ej: 404) que pasamos como prop
    if(!path && !VALID_PATHS.has(currentPath)){
        return <Component />
    }

    return null
}