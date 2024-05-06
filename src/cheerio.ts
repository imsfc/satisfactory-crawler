import { Cheerio, AnyNode, load } from 'cheerio'
import { isString } from 'radash'

export function toText($element: string | Cheerio<AnyNode>) {
  let text = ''
  if (isString($element)) {
    text = $element
  } else {
    const html = $element.html()
    if (html) {
      const $ = load(html)
      $('br').replaceWith('\n')
      text = $.text()
    }
  }

  return text
    .trim()
    .replace(/[\n\r]+/g, '\n')
    .split('\n')
    .map((str) => str.trim())
    .join('\n')
}

const regNumGap = /[,\s]/g
const regStrNum = /(\d+(\.\d+)?)/

export function toNumber($element: string | Cheerio<AnyNode>): number {
  const str = isString($element) ? $element : toText($element)
  const result = regStrNum.exec(str.replace(regNumGap, ''))
  if (result?.[0]) {
    return parseFloat(result[0])
  }
  return NaN
}
