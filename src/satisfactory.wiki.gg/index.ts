import { CrawlHTMLSingleResult } from 'x-crawl'
import { Crawl } from '../crawl'
import { cheerioLoad, toText } from '../cheerio'
import { isString } from 'radash'

const crawl = new Crawl('https://satisfactory.wiki.gg')

interface Detail {
  imageLink: string
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

  const imageLink = decodeURIComponent(
    $element.find('.pi-image > a').first().attr('href')!,
  )

  const description = toText($element.find('.pi-data').first())

  return {
    imageLink,
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

export async function getGGFiles(urls: string, dir: string): Promise<string>
export async function getGGFiles(urls: string[], dir: string): Promise<string[]>
export async function getGGFiles(
  urls: string | string[],
  dir: string,
): Promise<string | string[]> {
  if (isString(urls)) {
    return await crawl.crawlFile(urls, dir)
  } else {
    return await crawl.crawlFile(urls, dir)
  }
}
