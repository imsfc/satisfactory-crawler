import { Element, load } from 'cheerio'
import { isEmpty } from 'radash'
import { toNumber, toText } from '~/cheerio.ts'
import {
  AsideDimensions,
  AsideDimensionsLength,
} from '~/satisfactory_wiki_gg/type.ts'

const regUnderwater = /Underwater:\s*(\d+)\s*m/
const regAbovewater = /Above\s*water:\s*(\d+)\s*m/

/**
 * 示例：1-40 m
 * 实际上破折号是 0x2013 (unicode \u2013)
 * 空格是(160) 而非 ASCII 的空格(32)
 */
const lenOrAreaReplace: [string | RegExp, string][] = [
  ['(cannot be placed beneath anything)', ''],
  [/^2n\+1\sm$/, '3 m'],
  [/^2n\+2\sm$/, '4 m'],
  [/^\(1\/3\/5\/7\)\+2\sm$/, '(3/5/7/9) m'],
]
const regLenOrArea = /^(\d+(\.\d+)?)\s+m2?$/
const regLenOrAreaMulti1 = /^\((\d+(\/\d+)+)\)\s+m2?$/
const regLenOrAreaMulti2 = /^(\d+(\s+\/\s+\d+)+)\s+m2?$/
const regLenOrAreaRange = /^(\d+(\.\d+)?)[-\u2013](\d+(\.\d+)?)\s+m2?$/
function resolveLenOrArea(text: string): AsideDimensionsLength {
  let _text = text

  // 替换文本
  lenOrAreaReplace.forEach(([searchValue, replaceValue]) => {
    _text = _text.replace(searchValue, replaceValue)
  })

  // 单值
  if (regLenOrArea.test(_text)) {
    const result = regLenOrArea.exec(_text)
    return toNumber(result?.[1]!)
  }

  // 多值1 带括号
  if (regLenOrAreaMulti1.test(_text)) {
    const result = regLenOrAreaMulti1.exec(_text)

    if (result?.[1]) {
      return result[1].split('/').map(toNumber)
    }
  }

  // 多值2 无括号有空格
  if (regLenOrAreaMulti2.test(_text)) {
    const result = regLenOrAreaMulti2.exec(_text)

    if (result?.[1]) {
      return result[1].split('/').map(toNumber)
    }
  }

  // 范围
  if (regLenOrAreaRange.test(_text)) {
    const result = regLenOrAreaRange.exec(_text)

    const min = toNumber(result?.[1]!)
    const max = toNumber(result?.[3]!)
    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      return { min, max }
    }
  }

  // 模型和碰撞不一致的
  if (text.includes('Visual:') && text.includes('Hitbox:')) {
    const [visual, hitbox] = text.split('\n').map(toNumber)
    if (visual && hitbox) {
      return { visual, hitbox }
    }
  }

  return NaN
}

// 尺寸：宽，长，高，面积，可堆叠，水下高度, 水上高度
export function getAsideDimensions(el: Element): AsideDimensions | undefined {
  const $ = load(el)

  const obj: AsideDimensions = {}

  $(':root > .pi-data')
    .toArray()
    .forEach((el) => {
      const label = toText($(el).find('.pi-data-label'))
      const value = toText($(el).find('.pi-data-value'))

      // 宽
      if (label === 'Width') {
        const _val = resolveLenOrArea(value)
        if (!Number.isNaN(_val)) {
          obj.width = _val
          return
        }
      }

      // 长
      if (label === 'Length') {
        const _val = resolveLenOrArea(value)
        if (!Number.isNaN(_val)) {
          obj.length = _val
          return
        }
      }

      // 高
      if (label === 'Height') {
        const _val = resolveLenOrArea(value)
        if (!Number.isNaN(_val)) {
          obj.height = _val
          return
        }
      }

      // 面积
      if (label === 'Area') {
        const _val = resolveLenOrArea(value)
        if (!Number.isNaN(_val)) {
          obj.area = _val
          return
        }
      }

      // 可堆叠
      if (label === '' && value === 'Stackable') {
        obj.stackable = true
        return
      }

      // 水下高度 和 水上高度
      if (
        label === '' &&
        (regUnderwater.test(value) || regAbovewater.test(value))
      ) {
        if (regUnderwater.test(value)) {
          const result = regUnderwater.exec(value)
          const _val = toNumber(result?.[1]!)
          if (!Number.isNaN(_val)) {
            obj.underwater = _val
          }
        }

        if (regAbovewater.test(value)) {
          const result = regAbovewater.exec(value)
          const _val = toNumber(result?.[1]!)
          if (!Number.isNaN(_val)) {
            obj.above_water = _val
          }
        }

        return
      }

      throw new Error(
        `[ 解析 AsideDimensions ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return !isEmpty(obj) ? obj : undefined
}
