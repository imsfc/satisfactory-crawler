import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
import { toNumber, toText } from '~/cheerio.ts'
import { AsideVehicle } from '~/satisfactory_wiki_gg/type.ts'

// 车辆信息
export function getAsideVehicle(el: Element): AsideVehicle | undefined {
  const $ = load(el)

  const obj: AsideVehicle = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 最大速度
      if (label === 'Maximum speed') {
        if (/^\d+\s*km\/h$/.test(value)) {
          obj.maximum_speed = toNumber(value)
          return
        }
      }

      // 0–50 km/h 加速时间
      if (label === '0\u201350 km/h') {
        // todo
        return
      }

      throw new Error(
        `[ 解析 AsideVehicle ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
