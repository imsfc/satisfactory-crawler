import * as cheerio from 'cheerio'
import { CostItem } from './milestone'
import { crawl, crawlFile, createDir, getCheerio, parseText } from './util'

const bans = [
  // 设备指示灯
  'Indicator Light',
  // 间歇泉
  'Geyser',
  // 广告牌
  'Signs',
]

interface Building {
  name: string
  image: string
  description: string
  unlockedBy: string
  className: string
  building: {
    powerUsage: number
    overclockAble: boolean
    conveyorInputs: number
    conveyorOutputs: number
    pipelineInputs: number
    pipelineOutputs: number
  }
  dimensions: {
    width: number | [number, number]
    length: number | [number, number]
    height: number | [number, number]
    area: number | [number, number]
  }
}

interface Recipe {
  name: string
  ingredients: CostItem[]
  duration: number
  producedIn: string
  products: CostItem[]
  unlockedBy: string
}

function parseCost(
  $: cheerio.CheerioAPI,
  $element: cheerio.Cheerio<cheerio.AnyNode>,
): CostItem[] {
  const list: CostItem[] = []
  $element.find('.recipe-item').each((_, element) => {
    list.push({
      itemName: parseText($(element).find('.item-name')),
      quantity: parseInt(parseText($(element).find('.item-amount'))),
    })
  })
  return list
}

async function parseRecipes(
  $: cheerio.CheerioAPI,
  $element: cheerio.Cheerio<cheerio.AnyNode>,
): Promise<Recipe[]> {
  if ($element.length === 0) {
    return []
  }

  const list: Recipe[] = []
  $element
    .find('tr')
    .slice(1)
    .each((_, element) => {
      const [$name, $ingredients, $duration, $products, $unlockedBy] = $(
        element,
      )
        .find('td')
        .toArray()
        .map((element) => $(element))
      list.push({
        name: parseText($name),
        ingredients: parseCost($, $ingredients),
        duration: parseInt(parseText($duration)),
        producedIn: parseText($element.parent().find('.pi-title')),
        products: parseCost($, $products),
        unlockedBy: parseText($unlockedBy),
      })
    })
  return list
}

async function parseBuildings(url: string): Promise<[Building[], Recipe[]]> {
  const $ = getCheerio(await crawl.crawlHTML(url))

  const list = await Promise.all(
    $('#mw-content-text aside')
      .toArray()
      .filter((element) => {
        const $element = $(element)
        const text = parseText($element.find('.pi-title'))

        // 过滤掉 bans
        if (bans.find((ban) => text.includes(ban))) {
          return false
        }

        return true
      })
      .map(async (element): Promise<Building | null> => {
        const $element = $(element)

        // if ($element.find('.pi-header:contains("Dimensions")').length === 0) {
        //   return null
        // }

        // if ($element.find('.pi-header:contains("Ingre­dients")').length === 0) {
        //   return null
        // }

        const name = parseText($element.find('.pi-title'))

        const image = await crawlFile(
          decodeURIComponent($element.find('.pi-image a').attr('href')!),
          await createDir('buildings'),
        )

        const description = parseText($element.find('.pi-data').first())
        const unlockedBy = parseText(
          $element
            .find('.pi-data:contains("Unlocked by")')
            .find('.pi-data-value'),
        )
        const className = parseText(
          $element
            .find('.pi-data:contains("Class name")')
            .find('.pi-data-value'),
        )

        const powerUsage = parseInt(
          parseText(
            $element
              .find('.pi-data:contains("Power usage")')
              .find('.pi-data-value'),
          ) || '0',
        )

        const overclockAble =
          parseText(
            $element
              .find('.pi-data:contains("Overclock")')
              .filter('.pi-data:contains("able")')
              .find('.pi-data-value'),
          ).indexOf('Yes') >= 0

        const conveyorInputs = parseInt(
          parseText(
            $element
              .find('.pi-data:contains("Conveyor")')
              .filter('.pi-data:contains("inputs")')
              .find('.pi-data-value'),
          ) || '0',
        )

        const conveyorOutputs = parseInt(
          parseText(
            $element
              .find('.pi-data:contains("Conveyor")')
              .filter('.pi-data:contains("outputs")')
              .find('.pi-data-value'),
          ) || '0',
        )

        const pipelineInputs = parseInt(
          parseText(
            $element
              .find('.pi-data:contains("Pipeline")')
              .filter('.pi-data:contains("inputs")')
              .find('.pi-data-value'),
          ) || '0',
        )

        const pipelineOutputs = parseInt(
          parseText(
            $element
              .find('.pi-data:contains("Pipeline")')
              .filter('.pi-data:contains("outputs")')
              .find('.pi-data-value'),
          ) || '0',
        )

        function parseSize(str: string): number | [number, number] {
          const [a, b] = str.split('-')
          if (b) {
            return [parseInt(a), parseInt(b)]
          }
          return parseInt(a)
        }

        const width = parseSize(
          parseText(
            $element.find('.pi-data:contains("Width")').find('.pi-data-value'),
          ) || '0',
        )
        const length = parseSize(
          parseText(
            $element.find('.pi-data:contains("Length")').find('.pi-data-value'),
          ) || '0',
        )
        const height = parseSize(
          parseText(
            $element.find('.pi-data:contains("Height")').find('.pi-data-value'),
          ) || '0',
        )
        const area = parseSize(
          parseText(
            $element.find('.pi-data:contains("Area")').find('.pi-data-value'),
          ) || '0',
        )

        return {
          name,
          image,
          description,
          unlockedBy: unlockedBy,
          className,
          building: {
            powerUsage,
            overclockAble,
            conveyorInputs,
            conveyorOutputs,
            pipelineInputs,
            pipelineOutputs,
          },
          dimensions: {
            width,
            length,
            height,
            area,
          },
        }
      }),
  )

  const buildings: Building[] = []
  list.forEach((item) => {
    if (item) {
      buildings.push(item)
    }
  })

  const $recipeTable = $('#Recipes')
    .parent()
    .nextAll()
    .filter('.recipetable')
    .first()

  const recipes = await parseRecipes($, $recipeTable)

  return [buildings, recipes]
}

export async function getBuildings(): Promise<[Building[], Recipe[]]> {
  const $ = getCheerio(await crawl.crawlHTML('/wiki/Category:Buildings'))

  const list = await Promise.all(
    $('#mw-pages .mw-category-group a')
      .toArray()
      .filter((element) => {
        const text = parseText($(element))

        // 过滤掉翻译页面
        if (text.includes('/')) {
          return false
        }

        // 过滤掉 bans
        if (bans.find((ban) => text.includes(ban))) {
          return false
        }

        return true
      })
      .map(async (element) => {
        const $element = $(element)
        return await parseBuildings(decodeURIComponent($element.attr('href')!))
      }),
  )

  return [
    list.map((item) => item[0]).flat(),
    list.map((item) => item[1]).flat(),
  ]
}
