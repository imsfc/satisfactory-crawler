import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
import { toNumber, toText } from '~/cheerio.ts'
import { AsideFuel } from '~/satisfactory_wiki_gg/type.ts'

// 燃料信息
export function getAsideFuel(el: Element): AsideFuel | undefined {
  const $ = load(el)

  const obj: AsideFuel = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 能量
      if (label === 'Energy') {
        const _val = toNumber(value)
        if (!Number.isNaN(_val)) {
          obj.energy = _val
          return
        }
      }

      // 堆叠能量
      if (label === 'Stack energy') {
        const _val = toNumber(value)
        if (!Number.isNaN(_val)) {
          obj.stack_energy = _val
          return
        }
      }

      // 设备消耗速率等
      if (label === '') {
        // todo
        return
      }

      throw new Error(
        `[ 解析 AsideFuel ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
