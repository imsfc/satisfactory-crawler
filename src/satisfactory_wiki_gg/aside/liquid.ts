import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
import { toText } from '~/cheerio.ts'
import { AsideLiquid } from '~/satisfactory_wiki_gg/type.ts'

// 液体信息
export function getAsideLiquid(el: Element): AsideLiquid | undefined {
  const $ = load(el)

  const obj: AsideLiquid = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 缩写：忽略
      if (label === 'Abbrev\u00adiation') {
        // obj.abbreviation = value
        return
      }

      throw new Error(
        `[ 解析 AsideLiquid ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
