import { Element, load } from 'cheerio'
import { toNumber, toText } from '~/cheerio.ts'
import { AsideBuilding, InventorySize } from '~/satisfactory_wiki_gg/type.ts'

const reg_m3 = /^(\d+) m³$/
const reg_slots = /^(\d+) slots$/
// 解析存储空间
function resolveInventorySize(text: string): InventorySize | undefined {
  if (reg_m3.test(text)) {
    const result = reg_m3.exec(text)
    return {
      value: toNumber(result?.[1]!),
      unit: 'm3',
    }
  }

  if (reg_slots.test(text)) {
    const result = reg_slots.exec(text)
    return {
      value: toNumber(result?.[1]!),
      unit: 'slots',
    }
  }
}

// 建筑：耗电，发电，接口数量，存储空间
export function getAsideBuilding(el: Element): AsideBuilding | undefined {
  const $ = load(el)

  let flag = false
  const obj: AsideBuilding = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 耗电量
      if (label === 'Power usage') {
        obj.power_usage = toNumber(value)
        flag = true
        return
      }

      // 发电量
      if (label === 'Power generated') {
        obj.power_generated = toNumber(value)
        flag = true
        return
      }

      // 可超频
      if (label === 'Overclock\u00adable') {
        obj.overclockable = value === 'Yes'
        flag = true
        return
      }

      // 传送带输入
      if (label === 'Conveyor\ninputs') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.conveyor_inputs = _val
          flag = true
        }
        return
      }

      // 传送带输出
      if (label === 'Conveyor\noutputs') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.conveyor_outputs = _val
          flag = true
        }
        return
      }

      // 管道输入
      if (label === 'Pipeline\ninputs') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.pipeline_inputs = _val
          flag = true
        }
        return
      }

      // 管道输出
      if (label === 'Pipeline\noutputs') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.pipeline_outputs = _val
          flag = true
        }
        return
      }

      // 存储空间
      if (label === 'Inventory size') {
        obj.inventory_size = resolveInventorySize(value)
        flag = true
        return
      }

      throw new Error(
        `[ 解析 AsideBuilding ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return flag ? obj : undefined
}
