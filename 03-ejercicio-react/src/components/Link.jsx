import {useRouter} from "../hooks/useRouter.jsx"

export function Link ({href, children, ...restOfProps}){
    const {navigateTo} = useRouter()
    const handleClick = (event) => {
        event.preventDefault()
        navigateTo(href)
    }
    return (
        <a href={href} {...restOfProps} onClick={handleClick}>
         {children}   
        </a>
    )
}