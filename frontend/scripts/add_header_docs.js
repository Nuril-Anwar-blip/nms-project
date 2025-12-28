import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '../src')

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (entry.isFile()) processFile(full)
    }
}

function processFile(file) {
    const ext = path.extname(file)
    if (!['.ts', '.tsx', '.css'].includes(ext)) return
    const rel = path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/')
    const data = fs.readFileSync(file, 'utf8')
    // Skip JSON and files that already have our doc header
    if (data.startsWith('/** AUTO-DOC:')) return

    let header = ''
    if (ext === '.css') {
        header = `/* AUTO-DOC: ${rel}\n * Deskripsi: File stylesheet untuk frontend.\n */\n\n`
    } else {
        header = `/** AUTO-DOC: ${rel}\n * Deskripsi: Komponen / modul frontend.\n * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.\n */\n\n`
    }

    fs.writeFileSync(file, header + data, 'utf8')
    console.log('Prepended doc header to', rel)
}

walk(ROOT)

console.log('Completed adding headers')
