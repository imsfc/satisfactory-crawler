import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
import { toText } from '~/cheerio.ts'
import { AsideGas } from '~/satisfactory_wiki_gg/type.ts'

// 气体信息
export function getAsideGas(el: Element): AsideGas | undefined {
  const $ = load(el)

  const obj: AsideGas = {}

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
        `[ 解析 AsideGas ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
