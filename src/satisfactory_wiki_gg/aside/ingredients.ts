import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
import { toNumber, toText } from '~/cheerio.ts'
import { ItemWithQuantity } from '~/satisfactory_wiki_gg/type.ts'

// 成本：物品名称 × 数量
export function getAsideIngredients(
  el: Element,
): ItemWithQuantity[] | undefined {
  const $ = load(el)

  const obj: ItemWithQuantity[] = []

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      if (label === '') {
        // \u00d7 "×"
        const arr = value.split('\u00d7')
        if (arr.length === 2) {
          const quantity = toNumber(arr[0])
          const itemName = toText(arr[1])
          if (!Number.isNaN(quantity) && itemName) {
            obj.push({ itemName, quantity })
            return
          }
        }
      }

      throw new Error(
        `[ 解析 AsideIngredients ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
