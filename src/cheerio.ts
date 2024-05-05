import { Cheerio, AnyNode } from 'cheerio'
import { isString } from 'radash'

export function toText($element: string | Cheerio<AnyNode>) {
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

export function toNumber($element: string | Cheerio<AnyNode>): number {
  const str = isString($element) ? $element : toText($element)
  const numStr = extractNumbersFromString(str)
  return numStr ? parseFloat(numStr) : NaN
}
