import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
import { toNumber, toText } from '~/cheerio.ts'
import { AsideItem } from '~/satisfactory_wiki_gg/type.ts'

// 物品信息：堆叠数量
export function getAsideItem(el: Element): AsideItem | undefined {
  const $ = load(el)

  const obj: AsideItem = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 堆叠数量
      if (label === 'Stack size') {
        const _val = toNumber(value)
        if (!Number.isNaN(_val)) {
          obj.stack_size = _val
          return
        }
      }

      // 资源槽点数
      if (label === 'Sink points') {
        const _val = toNumber(value)
        if (!Number.isNaN(_val)) {
          obj.sink_points = _val
          return
        }
      }

      // 放射性
      if (label === 'Radioactive') {
        const _val = toNumber(value)
        if (!Number.isNaN(_val)) {
          obj.radioactive = _val
          return
        }
      }

      // 缩写：忽略
      if (label === 'Abbrev\u00adiation') {
        return
      }

      throw new Error(
        `[ 解析 AsideItem ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
