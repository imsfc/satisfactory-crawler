import { load } from 'cheerio'
import { map } from 'radash'
import { toText } from '~/cheerio.ts'
import { http } from '~/satisfactory_wiki_gg/http.ts'
import { Aside } from '~/satisfactory_wiki_gg/type.ts'
import { getAsideBasic } from '~/satisfactory_wiki_gg/aside/basic.ts'
import { getAsideBuilding } from '~/satisfactory_wiki_gg/aside/building.ts'
import { getAsideDimensions } from '~/satisfactory_wiki_gg/aside/dimensions.ts'
import { getAsideIngredients } from '~/satisfactory_wiki_gg/aside/ingredients.ts'
import { getAsideItem } from '~/satisfactory_wiki_gg/aside/item.ts'
import { getAsideEquipment } from '~/satisfactory_wiki_gg/aside/equipment.ts'
import { getAsideFuel } from '~/satisfactory_wiki_gg/aside/fuel.ts'
import { getAsideLiquid } from '~/satisfactory_wiki_gg/aside/liquid.ts'
import { getAsideGas } from '~/satisfactory_wiki_gg/aside/gas.ts'

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
          asideObj.ingredients = getAsideIngredients(group)
          return
        }

        if (groupName === 'Item') {
          asideObj.item = getAsideItem(group)
          return
        }

        if (groupName === 'Equipment') {
          asideObj.equipment = getAsideEquipment(group)
          return
        }

        if (groupName === 'Fuel') {
          asideObj.fuel = getAsideFuel(group)
          return
        }

        if (groupName === 'Liquid') {
          asideObj.liquid = getAsideLiquid(group)
          return
        }

        if (groupName === 'Gas') {
          asideObj.gas = getAsideGas(group)
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
