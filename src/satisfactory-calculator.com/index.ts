import { CrawlHTMLSingleResult } from 'x-crawl'
import { clone } from 'radash'
import { crawl } from './crawl'
import { getCheerio, parseText } from '../util'

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

interface Detail {
  description: string
}

function getList(res: CrawlHTMLSingleResult) {
  const $ = getCheerio(res)

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
          currentBreadcrumb.push(parseText($(element)))
        })
    }

    const isCard = $element.find('.card > .card-body > h6 > a').length > 0
    if (isCard) {
      const $a = $element.find('.card > .card-body > h6 > a')
      buildings.push({
        name: parseText($a),
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

function getDetail(res: CrawlHTMLSingleResult) {
  const $ = getCheerio(res)

  const $description = $(
    'body > main > .container-fluid:nth-child(2) > .row:nth-child(2) > div > .media > .media-body > .card > .card-body',
  )

  return {
    description: parseText($description),
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
