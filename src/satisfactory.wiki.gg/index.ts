import { CrawlHTMLSingleResult } from 'x-crawl'
import { crawl } from './crawl'
import { getCheerio, parseText, reCrawlHTML } from '../util'

function getBuilding(name: string, res: CrawlHTMLSingleResult) {
  const $ = getCheerio(res)

  const elementArr = $('.portable-infobox')
    .toArray()
    .filter((element) => name === parseText($(element).find('.pi-title')))

  if (elementArr.length === 0) {
    throw new Error(`获取详情失败: ${name}`)
  }

  const $element = $(elementArr[0])

  const description = parseText($element.find('.pi-data').first())

  return {
    description,
  }
}

export async function getGGBuilding(names: string[]) {
  const _resArr = await crawl.crawlHTML(names.map((name) => `/wiki/${name}`))
  const resArr = await reCrawlHTML(crawl, _resArr)

  return names.map((name, i) => getBuilding(name, resArr[i]))
}
