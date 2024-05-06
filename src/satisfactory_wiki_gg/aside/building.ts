import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
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

  const obj: AsideBuilding = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 耗电量
      if (label === 'Power usage') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.power_usage = _val
          return
        }
      }

      // 发电量
      if (label === 'Power generated') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.power_generated = _val
          return
        }
      }

      // 可超频
      if (label === 'Overclock\u00adable') {
        const _yes = value === 'Yes'
        const _no = value === 'No'
        if (_yes || _no) {
          obj.overclockable = _yes
          return
        }
      }

      // 传送带输入
      if (label === 'Conveyor\ninputs') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.conveyor_inputs = _val
          return
        }
      }

      // 传送带输出
      if (label === 'Conveyor\noutputs') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.conveyor_outputs = _val
          return
        }
      }

      // 管道输入
      if (label === 'Pipeline\ninputs') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.pipeline_inputs = _val
          return
        }
      }

      // 管道输出
      if (label === 'Pipeline\noutputs') {
        const _val = toNumber(value)
        if (!isNaN(_val)) {
          obj.pipeline_outputs = _val
          return
        }
      }

      // 存储空间
      if (label === 'Inventory size') {
        obj.inventory_size = resolveInventorySize(value)
        return
      }

      throw new Error(
        `[ 解析 AsideBuilding ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
