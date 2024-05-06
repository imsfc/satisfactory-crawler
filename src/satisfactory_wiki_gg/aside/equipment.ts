import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
import { toText } from '~/cheerio.ts'
import { AsideEquipment } from '~/satisfactory_wiki_gg/type.ts'

// 装备信息
export function getAsideEquipment(el: Element): AsideEquipment | undefined {
  const $ = load(el)

  const obj: AsideEquipment = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 装备槽位
      if (label === 'Equipment slot') {
        // 头部
        // 身体
        if (value === 'Body') {
          obj.equipment_slot = 'body'
          return
        }
        // 手部
        if (value === 'Hand' || value === 'Hands' || value === 'hands') {
          obj.equipment_slot = 'hands'
          return
        }
        // 后背
        if (value === 'Back') {
          obj.equipment_slot = 'back'
          return
        }
        // 腿部
        if (value === 'Legs') {
          obj.equipment_slot = 'legs'
          return
        }
      }

      // 伤害
      if (label === 'Damage') {
        // todo
        // const _val = toNumber(value)
        // if (!Number.isNaN(_val)) {
        //   obj.damage = _val
        // }
        return
      }

      // 射速
      if (label === 'Rate of fire') {
        // todo
        return
      }

      // 重装时间
      if (label === 'Reload time') {
        // todo
        return
      }

      // 重装时间
      if (label === 'Reload time') {
        // todo
        return
      }

      // 每秒伤害
      if (label === 'DPS') {
        // todo
        return
      }

      // 范围
      if (label === 'Range') {
        // todo
        return
      }

      // 弹药
      if (label === 'Ammo') {
        // todo
        return
      }

      // 弹匣容量
      if (label === 'Magazine size') {
        // todo
        return
      }

      throw new Error(
        `[ 解析 AsideEquipment ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
