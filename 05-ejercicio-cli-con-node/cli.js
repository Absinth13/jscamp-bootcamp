import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

//Segundo ejercicio ascendente descendente 
const argu = process.argv.slice(2)
const isAsc = argu.includes('--asc')
const isDesc = argu.includes('--desc')


//Tercer ejercicio filtrar archivos y carpetas
const isFiles = argu.includes('--files')
const isFolders = argu.includes('--folders')
const dir = argu.find(arg => !arg.startsWith('--')) ?? '.'


const formatBytes = (size) =>{
    if(size < 1024) return `${size} B`
   return `${(size/1024).toFixed(2)} KB`
}

const files = await readdir(dir)


const entries = await Promise.all(
    files.map(async(name) =>{
    const fullPath = join(dir, name)
    const info = await stat(fullPath)
    
    return{
        name, 
        isDir: info.isDirectory(),
        size: formatBytes(info.size)
    }
    })
)

let filteredEntries = entries
if (isFiles) filteredEntries = entries.filter(entry => !entry.isDir)
if (isFolders) filteredEntries = entries.filter(entry => entry.isDir)


if (isAsc) filteredEntries.sort((a, b) => a.name.localeCompare(b.name))
if (isDesc) filteredEntries.sort((a, b) => b.name.localeCompare(a.name))

for (const entry of entries){

const icon= entry.isDir ? '🗂️' : '📄'
const size = entry.isDir ? '-' : `${entry.size}`
console.log(`${icon}   ${entry.name.padEnd(25)}    ${size}`)


}
 


