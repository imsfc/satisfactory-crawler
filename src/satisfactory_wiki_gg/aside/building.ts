import { Element, load } from 'cheerio'
import { toText } from '~/cheerio.ts'
import { AsideBuilding } from '~/satisfactory_wiki_gg/type.ts'

// 建筑：耗电，发电，接口数量，存储空间
export function getAsideBuilding(el: Element): AsideBuilding {
  const $ = load(el)

  const obj: AsideBuilding = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 耗电量
      if (label === 'Power usage') {
        return
      }

      // 发电量
      if (label === 'Power generated') {
        return
      }

      // 可超频
      if (label === 'Overclock\u00adable') {
        return
      }

      // 传送带输入
      if (label === 'Conveyor\ninputs') {
        return
      }

      // 传送带输出
      if (label === 'Conveyor\noutputs') {
        return
      }

      // 管道输入
      if (label === 'Pipeline\ninputs') {
        return
      }

      // 管道输出
      if (label === 'Pipeline\noutputs') {
        return
      }

      // 存储空间
      if (label === 'Inventory size') {
        return
      }

      throw new Error(
        `[ 解析 AsideBuilding ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return obj
}
