import { CrawlHTMLSingleResult } from 'x-crawl'
import { clone, toFloat } from 'radash'
import { Crawl } from '../crawl'
import { cheerioLoad, toNumber, toText } from '../cheerio'

const crawl = new Crawl('https://satisfactory-calculator.com')

interface Lang<T> {
  en: T
  zh: T
}

type Breadcrumb = string[]

interface Link {
  name: string
  link: string
  breadcrumb: Breadcrumb
}

interface Cost {
  name: string
  quantity: number
  perMinute: number
}

interface Repice {
  name: string
  input: Cost[]
  output: Cost[]
}

interface Detail {
  description: string
  usedToCraft: Repice[]
}

const nameAlias = new Map<string, string>()

nameAlias.set('S.A.M. Ore', 'SAM Ore')
nameAlias.set('S.A.M. 矿石', 'SAM 矿石')

function getName(name: string): string {
  return nameAlias.get(name) ?? name
}

function getList(res: CrawlHTMLSingleResult) {
  const $ = cheerioLoad(res.data?.html)

  const elements = $(
    'body > main > .container-fluid:nth-child(2) > .row > div',
  ).toArray()

  const buildings: Link[] = []

  let currentBreadcrumb: Breadcrumb = []

  elements.forEach((element) => {
    const $element = $(element)

    const isBreadcrumb = $element.find('.breadcrumb').length > 0
    if (isBreadcrumb) {
      currentBreadcrumb = []
      $element
        .find('.breadcrumb > .breadcrumb-item')
        .toArray()
        .forEach((element) => {
          currentBreadcrumb.push(toText($(element)))
        })
    }

    const isCard = $element.find('.card > .card-body > h6 > a').length > 0
    if (isCard) {
      const $a = $element.find('.card > .card-body > h6 > a')
      const name = toText($a)
      buildings.push({
        name: getName(name),
        link: decodeURIComponent($a.attr('href')!),
        breadcrumb: clone(currentBreadcrumb),
      })
    }
  })

  return buildings
}

export async function getSCList() {
  const list = [
    'buildings',
    'architecture',
    'structures',
    'items',
    'tools',
    'vehicles',
    'fauna',
    'statues',
    'ficsmas',
  ]

  const resArr = await crawl.crawlHTML(
    list.map((path) => [`/en/${path}`, `/zh/${path}`]).flat(),
  )

  const ret: Lang<Link>[] = []

  list.forEach((path, _i) => {
    const i = _i * 2

    const enList = getList(resArr[i])
    const zhList = getList(resArr[i + 1])

    if (enList.length !== zhList.length) {
      throw new Error(`数量不一致: ${path}`)
    }

    enList.forEach((en, index) => {
      const zh = zhList[index]
      ret.push({ en, zh })
    })
  })

  return ret
}

function getCostList(arr: string[]): Cost[] {
  const ret: Cost[] = []
  arr.forEach((str) => {
    const [quantity, name] = str.split(/x|m³/)
    if (quantity && name) {
      ret.push({
        name: toText(name),
        quantity: toNumber(quantity),
        perMinute: 0,
      })
    }
  })
  return ret
}

function getDetail(res: CrawlHTMLSingleResult): Detail {
  const $ = cheerioLoad(res.data?.html)

  const $description = $(
    'body > main > .container-fluid:nth-child(2) > .row:nth-child(2) > div > .media > .media-body > .card > .card-body',
  )

  const description = toText($description)

  const $usedToCraft = $(
    'body > main > .container-fluid > .row > div > .card',
  ).filter((_, element) => {
    const title = toText($(element).find('.card-header > strong'))
    return ['Used to craft', '用于制作'].includes(title)
  })

  const usedToCraft: Repice[] = []

  if ($usedToCraft.length === 1) {
    const names = $usedToCraft
      .find('table tbody tr:nth-child(2n + 1)')
      .toArray()
    const infos = $usedToCraft.find('table tbody tr:nth-child(2n)').toArray()

    names.forEach((name, i) => {
      const $info = $(infos[i])

      if (!toNumber($info.find('td:nth-child(2) div:nth-child(1)'))) {
        return
      }
      if (!toNumber($info.find('td:nth-child(3) div:nth-child(1)'))) {
        return
      }

      const input = getCostList(
        $info
          .find('td:nth-child(1) div')
          .toArray()
          .map((element) => toText($(element))),
      )
      const output = getCostList(
        $info
          .find('td:nth-child(4) div')
          .toArray()
          .map((element) => toText($(element))),
      )

      let duration = 0

      if (input.length !== 0) {
        const perMin = toNumber($info.find('td:nth-child(2) div:nth-child(1)'))
        duration = input[0].quantity / perMin
      }

      input.forEach((cost) => {
        cost.perMinute = cost.quantity / duration
      })

      output.forEach((cost) => {
        cost.perMinute = cost.quantity / duration
      })

      usedToCraft.push({
        name: toText($(name)),
        input,
        output,
      })
    })
  }

  return {
    description,
    usedToCraft,
  }
}

export async function getSCDetails(
  urls: Lang<string[]>,
): Promise<Lang<Detail>[]> {
  const resArr = await crawl.crawlHTML([...urls.en, ...urls.zh])

  return urls.en.map((_, i) => {
    const en = getDetail(resArr[i])
    const zh = getDetail(resArr[i + urls.en.length])

    return {
      en,
      zh,
    }
  })
}
