import { Element, load } from 'cheerio'
import { map } from 'radash'
import { toText } from '~/cheerio.ts'
import { http } from './http.ts'
import { resolveImage } from './image.ts'

interface InventorySize {
  value: number
  unit: 'm3' | 'slots'
}

interface AsideBuilding {
  power_usage?: number
  power_generated?: number
  overclockable?: boolean
  conveyor_inputs?: number
  conveyor_outputs?: number
  pipeline_inputs?: number
  pipeline_outputs?: number
  inventory_size?: InventorySize
}

interface AsideDimensions {
  width?: number
  length?: number
  height?: number
  area?: number
  stackable?: boolean
  underwater?: number
  above_water?: number
}

interface AsideItem {
  stack_size?: number
}

interface Aside {
  // basic
  name?: string
  image?: string
  desc?: string
  unlocked_by?: string
  class_name?: string
  // group
  building?: AsideBuilding
  dimensions?: AsideDimensions
  item?: AsideItem
}

// 基本：名称，图片，描述，解锁自，类名
async function getAsideBasic(el: Element): Promise<Aside> {
  const $ = load(el)

  const imageUrl = decodeURIComponent($(':root > .pi-image >  a').attr('href')!)
  const image = await resolveImage(imageUrl)

  const name = toText($(':root > .pi-title'))
  const desc = toText($(':root > .pi-data').first())

  const asideObj: Aside = { name, image, desc }

  $(':root > .pi-data')
    .toArray()
    .filter((_, i) => i >= 1)
    .forEach((el) => {
      const $el = $(el)
      const label = toText($el.find('.pi-data-label'))
      const value = toText($el.find('.pi-data-value'))

      if (label === 'Unlocked by') {
        asideObj.unlocked_by = value
        return
      }

      if (label === 'Class name') {
        asideObj.class_name = value
        return
      }

      throw new Error(
        `[ 解析 AsideBasic ] [ 未定义字段 ] { label: ${label}, value: ${value} }`,
      )
    })

  return asideObj
}

export async function getAside(url: string): Promise<Aside[]> {
  const $ = load(await http.html(url))

  const asideArr = $('#mw-content-text > div.mw-parser-output aside').toArray()

  return await map(asideArr, async (aside): Promise<Aside> => {
    return {
      ...(await getAsideBasic(aside)),
    }
  })
}
