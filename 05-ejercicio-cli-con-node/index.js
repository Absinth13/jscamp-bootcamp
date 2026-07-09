import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {join} from 'node:path'

const content = await readFile('./archivo.txt', 'utf-8')
console.log(content)

const sources = join('src','files', 'documents')
await mkdir(sources,{recursive:true})


const scontent = content.toUpperCase()
const srcFilePath= join (sources, 'secret.txt')
await writeFile(srcFilePath, scontent)
console.log('Archivo secreto y en mayúsculas')
