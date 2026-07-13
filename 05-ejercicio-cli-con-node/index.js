import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

let content = ''

if(process.permission?.has('fs.read','secret.txt' )){ // <- Hacemos un optional changing en `permission?.has` porque si no ponemos el flag `--permission` en nuestro comando de consola, el `process.permission` no va a existir, por lo tanto su método `has` tampoco, y fallará sin entrar en el `else`
    const content = await readFile('secret.txt', 'utf-8')
    console.log('Contenido de secret.txt:')
    console.log(content)
} else{
    console.error('Debes habilitar los permisos necesarios para leer ese archivo')
    console.error(`Prueba ejecutando node --permission --allow-fs-read=secret.txt index.js`) // <- Está bueno darle un ejemplo al usuario de cómo debería hacerlo para que funcione
    process.exit(1) // <- Al haber un if y no un try/catch. Si permission falla, se va a seguir ejecutando el código. En este caso lo mejor es cerrar el proceso en la consola y no seguir ejecutando el resto del código.
}


if(process.permission?.has('fs.write','src/files/documents')){

const source = join ('src','files' ,'documents')
await mkdir(source, {recursive:true})


await writeFile(join(source, 'secret2.txt'), content)
console.log('Archivo secreto2')

}else{
    console.error('No tienes acceso a este directorio') // <- Mostremos esto como un error, no un texto
    console.error(`Prueba ejecutando node --permission --allow-fs-read=secret.txt --allow-fs-write=src/files/documents index.js`)
    process.exit(1)
}
