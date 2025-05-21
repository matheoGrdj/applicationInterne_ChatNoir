import { readFile } from 'fs/promises'

export default defineEventHandler(async () => {
  const data = await readFile('public/data/images.json', 'utf-8')
  return JSON.parse(data)
})
