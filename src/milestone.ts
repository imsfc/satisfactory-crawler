import * as cheerio from 'cheerio'
import { sum } from 'radash'
import {
  crawl,
  crawlFilePageImg,
  createDir,
  getCheerio,
  parseText,
} from './util'

export interface CostItem {
  itemName: string
  quantity: number
}

export interface Reward {
  name: string
  list: string[]
}

export interface Milestone {
  name: string
  image: string
  cost: CostItem[]
  time: number
  rewards: Reward[]
}

export interface Tier {
  name: string
  description: string
  milestones: Milestone[]
}

function parseCost($element: cheerio.Cheerio<cheerio.AnyNode>): CostItem {
  return {
    itemName: parseText($element.find('a')),
    quantity: parseInt(parseText($element).split('×')[0].trim()),
  }
}

function parseTime($element: cheerio.Cheerio<cheerio.AnyNode>): number {
  return sum(
    parseText($element)
      .split(':')
      .reverse()
      .map((value, index) => {
        return {
          value: parseInt(value) * Math.pow(60, index),
        }
      }),
    ({ value }) => value,
  )
}

function parseRewards(
  $: cheerio.CheerioAPI,
  $element: cheerio.Cheerio<cheerio.AnyNode>,
): Reward[] {
  const rewards: Reward[] = []

  $element.find('b').each((_, element) => {
    const $a = $(element).prev('a')
    if ($a.length > 0) {
      $a.before('\\br\\')
    }
  })

  parseText($element)
    .replace(/^\\br\\|\\br\\$/g, '')
    .split('\\br\\')
    .forEach((str) => {
      const [name, list] = str.split(':')
      rewards.push({
        name: name.trim(),
        list: list.split(',').map((str) => str.trim()),
      })
    })
  return rewards
}

async function parseMilestoneTableRow(
  $: cheerio.CheerioAPI,
  $element: cheerio.Cheerio<cheerio.AnyNode>,
): Promise<Milestone> {
  const [$milestone, $cost, $time, $rewards] = $element
    .toArray()
    .map((element) => $(element))

  const image = await crawlFilePageImg(
    $milestone.find('a').attr('href')!,
    await createDir('milestones'),
  )

  return {
    name: parseText($milestone),
    image,
    cost: [parseCost($cost)],
    time: parseTime($time),
    rewards: parseRewards($, $rewards),
  }
}

async function parseMilestoneTable(
  $: cheerio.CheerioAPI,
  $element: cheerio.Cheerio<cheerio.AnyNode>,
): Promise<Milestone[]> {
  const list: [cheerio.Cheerio<cheerio.AnyNode>][] = []

  $element
    .find('tr')
    .slice(1)
    .each((_, element) => {
      const $tr = $(element)
      const $td = $tr.find('td')
      if ($tr.hasClass('firstRow')) {
        list.push([$td.slice(1)])
      } else {
        list[list.length - 1].push($td)
      }
    })

  const milestones: Milestone[] = await Promise.all(
    list.map((item) => parseMilestoneTableRow($, item[0])),
  )

  list.forEach((item, index) => {
    item.slice(1).forEach((element) => {
      milestones[index].cost.push(parseCost(element))
    })
  })

  return milestones
}

export async function getMilestones(): Promise<Tier[]> {
  const $ = getCheerio(await crawl.crawlHTML('/wiki/Milestones'))

  const $tiers = $('#mw-content-text .mw-parser-output > h2:contains("Tier ")')

  return await Promise.all(
    $tiers.toArray().map(async (element): Promise<Tier> => {
      const tierName = parseText($(element))

      const $tierContents = $(element).nextUntil('h2')

      const $firstP = $tierContents.filter('p').first()
      if ($firstP.length === 0) {
        throw new Error('找不到第一个p元素')
      }
      const tierDescription = parseText($firstP)

      const $milestones = $tierContents.filter('.milestoneTable').first()
      if ($milestones.length === 0) {
        throw new Error('找不到里程碑表格')
      }
      const milestones: Milestone[] = await parseMilestoneTable($, $milestones)

      return {
        name: tierName,
        description: tierDescription,
        milestones,
      }
    }),
  )
}
