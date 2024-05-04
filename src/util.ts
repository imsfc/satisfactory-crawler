import path from 'node:path'
import fs from 'node:fs'
import { CACHE_DIR, OUTPUT_DIR } from './const'
import { createHash } from 'node:crypto'

export function hash(content: string): string {
  const hash = createHash('sha256')
  hash.update(content)
  return hash.digest('hex')
}

export function dir(directory: string) {
  const _directory = path.join(OUTPUT_DIR, directory)
  try {
    fs.mkdirSync(_directory, { recursive: true })
  } catch (err) {}
  return _directory
}

function file(dir: string, filePath: string, content: string) {
  const _filePath = path.join(dir, filePath)
  const _directory = path.dirname(_filePath)
  try {
    fs.mkdirSync(_directory, { recursive: true })
    fs.writeFileSync(_filePath, content, { encoding: 'utf-8' })
  } catch (err) {}
}

export function saveFile(filePath: string, content: string) {
  return file(OUTPUT_DIR, filePath, content)
}

export function saveCache(filePath: string, content: string) {
  return file(CACHE_DIR, filePath, content)
}

export function readCache(filePath: string) {
  const _filePath = path.join(CACHE_DIR, filePath)
  try {
    fs.accessSync(_filePath, fs.constants.F_OK)
    return fs.readFileSync(_filePath, { encoding: 'utf-8' })
  } catch (err) {
    return null
  }
}
