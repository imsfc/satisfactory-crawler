import path from 'node:path'
import fs from 'node:fs/promises'
import * as cheerio from 'cheerio'
import { CrawlHTMLSingleResult, createCrawl } from 'x-crawl'
import { isString } from 'radash'

export const OUTPUT_DIR = './output'

export const crawl = createCrawl({
  enableRandomFingerprint: true,
  baseUrl: 'https://satisfactory.wiki.gg/',
  maxRetry: 3,
})

export async function createDir(directory: string) {
  const _directory = path.join(OUTPUT_DIR, directory)
  try {
    await fs.mkdir(_directory, { recursive: true })
  } catch (err) {}
  return _directory
}

export async function saveFile(filePath: string, content: string) {
  const _filePath = path.join(OUTPUT_DIR, filePath)
  const _directory = path.dirname(_filePath)
  try {
    await fs.mkdir(_directory, { recursive: true })
    await fs.writeFile(_filePath, content)
  } catch (err) {}
}

export function getCheerio(res: CrawlHTMLSingleResult) {
  if (!res.isSuccess || !res.data?.html) {
    throw new Error('获取 HTML 失败')
  }
  return cheerio.load(res.data.html)
}

export async function crawlFile(url: string, dir: string) {
  const fileName = path.basename(url)
  try {
    await fs.access(path.join(dir, fileName), fs.constants.F_OK)
    // 文件已存在：跳过
    return fileName
  } catch (err) {
    // 文件不存在：下载
    await crawl.crawlFile({
      url,
      fileName: path.basename(url, path.extname(url)),
      storeDir: dir,
    })
  }
  return fileName
}

export async function crawlFilePageImg(url: string, dir: string) {
  const fileName = path.basename(url).replace(/^File:/, '')
  try {
    await fs.access(path.join(dir, fileName), fs.constants.F_OK)
    // 文件已存在：跳过
    return fileName
  } catch (err) {
    // 文件不存在：解析并下载
    const $ = getCheerio(await crawl.crawlHTML(url))
    return await crawlFile($('#file a').attr('href')!, dir)
  }
}

export function parseText($element: cheerio.Cheerio<cheerio.AnyNode>) {
  $element.filter('br').replaceWith(' ')
  $element.find('br').replaceWith(' ')
  return $element
    .text()
    .trim()
    .replace(/[\s\t\n\r]+/g, ' ')
}

const extractNumbersFromStringReg = /\d+/g
export function extractNumbersFromString(str: string) {
  return str.match(extractNumbersFromStringReg)
}

export function parseNumber(
  $element: string | cheerio.Cheerio<cheerio.AnyNode>,
): number {
  const str = isString($element) ? $element : $element.text()
  const numStr = extractNumbersFromString(str)?.join('')
  if (!numStr) {
    return NaN
  }
  return parseFloat(numStr)
}
