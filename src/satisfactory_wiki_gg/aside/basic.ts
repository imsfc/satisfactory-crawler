import { Element, load } from 'cheerio'
import { toText } from '~/cheerio.ts'
import { resolveImage } from '~/satisfactory_wiki_gg/image.ts'
import { Aside } from '~/satisfactory_wiki_gg/type.ts'

// 基本：名称，图片，描述，解锁自，类名
export async function getAsideBasic(el: Element): Promise<Aside> {
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
