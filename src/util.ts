import path from 'node:path'
import fs from 'node:fs/promises'
import * as cheerio from 'cheerio'
import { CrawlApp, CrawlHTMLSingleResult } from 'x-crawl'
import { isArray, isString } from 'radash'

export const OUTPUT_DIR = './output'

export async function reCrawlHTML(
  crawl: CrawlApp,
  res: CrawlHTMLSingleResult | CrawlHTMLSingleResult[],
) {
  const resArr = isArray(res) ? res : [res]

  let redirectArr = resArr.filter(({ data }) =>
    [301, 302, 307, 308].includes(data?.statusCode!),
  )
  if (redirectArr.length === 0) {
    return resArr
  }

  const resArr2 = await crawl.crawlHTML(
    redirectArr.map(({ data }) => {
      const location = data?.headers.location!
      const urlObj = new URL(location)
      const pathAndQuery = urlObj.pathname + urlObj.search + urlObj.hash
      return pathAndQuery
    }),
  )

  const resArr3 = resArr.map((res) => {
    const index = redirectArr.indexOf(res)

    if (index === -1) {
      return res
    }

    return resArr2[index]
  })

  return await reCrawlHTML(crawl, resArr3)
}

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

export function parseText($element: cheerio.Cheerio<cheerio.AnyNode>) {
  $element.filter('br').replaceWith('\n')
  $element.find('br').replaceWith('\n')
  return $element
    .text()
    .trim()
    .replace(/[\n\r]+/g, '\n')
    .split('\n')
    .map((str) => str.trim())
    .join('\n')
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
