import {useRouter} from "../hooks/useRouter.jsx";

export function Route ({path, component: Component}){
    const {currentPath} = useRouter()
    if (!path){
        return <Component/>
    }

    if (currentPath === path) {
    return <Component />
  }
return null
}