import { CostItem } from './milestone'
import { crawl, getCheerio, parseText } from './util'

interface Phase {
  phase: number
  name: string
  cost: CostItem[]
  deliveryUnlocks: string
}

function parseCost($element): CostItem[] {
  const list: CostItem[] = []
  $element.find('br').replaceWith('\\br\\')
  parseText($element)
    .split('\\br\\')
    .forEach((item) => {
      let [quantity, itemName] = item.split('×')
      list.push({
        itemName: itemName.trim(),
        quantity: parseInt(quantity.match(/\d+/g)!.join('')),
      })
    })
  return list
}

export async function getPhases(): Promise<Phase[]> {
  const $ = getCheerio(await crawl.crawlHTML('/wiki/Space_Elevator'))

  const $table = $('#Project_Assembly_phases')
    .parent()
    .nextAll()
    .filter('table')
    .first()

  const phases: Phase[] = []

  $table
    .find('tr')
    .slice(1)
    .each((_, element) => {
      const [$phase, $name, $cost, $deliveryUnlocks] = $(element)
        .find('td')
        .toArray()
        .map((element) => $(element))
      phases.push({
        phase: parseInt(parseText($phase)),
        name: parseText($name),
        cost: parseCost($cost),
        deliveryUnlocks: parseText($deliveryUnlocks),
      })
    })

  return phases
}
