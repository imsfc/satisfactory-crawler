import * as cheerio from 'cheerio'
import { isString } from 'radash'

export function cheerioLoad(html?: string) {
  if (!html) {
    throw new Error('获取 HTML 失败')
  }
  return cheerio.load(html)
}

export function toText($element: string | cheerio.Cheerio<cheerio.AnyNode>) {
  let text = ''
  if (isString($element)) {
    text = $element
  } else {
    $element.filter('br').replaceWith('\n')
    $element.find('br').replaceWith('\n')
    text = $element.text()
  }

  return text
    .trim()
    .replace(/[\n\r]+/g, '\n')
    .split('\n')
    .map((str) => str.trim())
    .join('\n')
}

function extractNumbersFromString(str: string) {
  return str.match(/\d+/g)?.join('')
}

export function toNumber(
  $element: string | cheerio.Cheerio<cheerio.AnyNode>,
): number {
  const str = isString($element) ? $element : toText($element)
  const numStr = extractNumbersFromString(str)
  return numStr ? parseFloat(numStr) : NaN
}
