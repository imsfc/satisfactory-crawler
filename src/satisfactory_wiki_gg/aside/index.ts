import { load } from 'cheerio'
import { map } from 'radash'
import { toText } from '~/cheerio.ts'
import { http } from '~/satisfactory_wiki_gg/http.ts'
import { Aside } from '~/satisfactory_wiki_gg/type.ts'
import { getAsideBasic } from '~/satisfactory_wiki_gg/aside/basic.ts'
import { getAsideBuilding } from '~/satisfactory_wiki_gg/aside/building.ts'
import { getAsideDimensions } from '~/satisfactory_wiki_gg/aside/dimensions.ts'

export async function getAside(url: string): Promise<Aside[]> {
  const $ = load(await http.html(url))

  const asideArr = $('#mw-content-text > div.mw-parser-output aside').toArray()

  return await map(asideArr, async (aside): Promise<Aside> => {
    const asideObj = await getAsideBasic(aside)

    $(aside)
      .find('.pi-group')
      .toArray()
      .forEach((group) => {
        const groupName = toText($(group).find('.pi-header'))

        if (groupName === 'Building') {
          asideObj.building = getAsideBuilding(group)
          return
        }

        if (groupName === 'Dimensions') {
          asideObj.dimensions = getAsideDimensions(group)
          return
        }

        if (groupName === 'Ingre\u00addients') {
          return
        }

        if (groupName === 'Item') {
          return
        }

        if (groupName === 'Equipment') {
          return
        }

        if (groupName === 'Fuel') {
          return
        }

        if (groupName === 'Liquid') {
          return
        }

        if (groupName === 'Gas') {
          return
        }

        if (groupName === 'Vehicle') {
          return
        }

        throw new Error(
          `[ 解析 AsideGroup ] [ 未定义组 ] { group: ${groupName} }`,
        )
      })

    return asideObj
  })
}
