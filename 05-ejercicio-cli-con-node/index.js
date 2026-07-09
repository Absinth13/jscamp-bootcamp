import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {join} from 'node:path'

let content = ''

if(process.permission.has('fs.read','secret.txt' )){
    const content = await readFile('secret.txt', 'utf-8')
    console.log('Contenido de secret.txt:')
    console.log(content)
} else{
    console.log('Debes habilitar los permisos necesarios para leer ese archivo')
}


if(process.permission.has('fs.write','src/files/documents')){

const source = join ('src','files' ,'documents')
await mkdir(source, {recursive:true})


await writeFile(join(source, 'secret2.txt'), content)
console.log('Archivo secreto2')

}else{
    console.log('No tienes acceso a este directorio')
}
