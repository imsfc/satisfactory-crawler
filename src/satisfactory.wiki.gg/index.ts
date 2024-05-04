import { CrawlHTMLSingleResult } from 'x-crawl'
import { Crawl } from '../crawl'
import { cheerioLoad, toText } from '../cheerio'

const crawl = new Crawl('https://satisfactory.wiki.gg')

interface Detail {
  description: string
}

const detailHandle = new Map<string, (name, res) => Detail>()

function getDetail(name: string, res: CrawlHTMLSingleResult): Detail {
  const $ = cheerioLoad(res.data?.html)

  const elementArr = $('.portable-infobox')
    .toArray()
    .filter((element) => name === toText($(element).find('.pi-title')))

  if (elementArr.length === 0) {
    throw new Error(`获取详情失败: ${name}`)
  }

  const $element = $(elementArr[0])

  const description = toText($element.find('.pi-data').first())

  return {
    description,
  }
}

export async function getGGDetails(names: string[]): Promise<Detail[]> {
  const resArr = await crawl.crawlHTML(names.map((name) => `/wiki/${name}`))

  return names.map(
    (name, i) =>
      detailHandle.get(name)?.(name, resArr[i]) ?? getDetail(name, resArr[i]),
  )
}
