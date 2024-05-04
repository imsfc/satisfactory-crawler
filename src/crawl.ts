import fs from 'node:fs'
import path from 'node:path'
import { CrawlApp, CrawlHTMLSingleResult, createCrawl } from 'x-crawl'
import { isString } from 'radash'
import { hash, readCache, saveCache } from './util'

function readCaches(urls: string[]): (CrawlHTMLSingleResult | null)[] {
  return urls.map((url) => {
    const content = readCache(hash(url))
    return content ? JSON.parse(content) : content
  })
}

function saveCaches(urls: string[], res: CrawlHTMLSingleResult[]) {
  urls.forEach((url, i) => {
    saveCache(hash(url), JSON.stringify(res[i]))
  })
}

export class Crawl {
  crawlApp: CrawlApp
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.crawlApp = createCrawl({
      enableRandomFingerprint: true,
      intervalTime: 5,
      maxRetry: 3,
    })
  }

  private url(url: string) {
    return url.includes(this.baseUrl) ? url : new URL(url, this.baseUrl).href
  }

  async crawlHTML(urls: string): Promise<CrawlHTMLSingleResult>
  async crawlHTML(urls: string[]): Promise<CrawlHTMLSingleResult[]>
  async crawlHTML(
    urls: string | string[],
  ): Promise<CrawlHTMLSingleResult | CrawlHTMLSingleResult[]> {
    const single = isString(urls)
    const _urls = single ? [this.url(urls)] : urls.map((url) => this.url(url))

    const _cacheResArr = readCaches(_urls)
    const noCacheUrls = _urls.filter((url, i) => !_cacheResArr[i])
    const noCatchResArr = await this.crawlApp.crawlHTML(noCacheUrls)

    console.info(
      `crawlHTML 命中缓存：${_urls.length - noCatchResArr.length}/${
        _urls.length
      }`,
    )

    const resArr = _urls.map((url, i) => {
      const _i = noCacheUrls.indexOf(url)
      return _i >= 0 ? noCatchResArr[_i] : _cacheResArr[i]!
    })

    const redirectArr = resArr.filter(({ data }) =>
      [301, 302, 307, 308].includes(data?.statusCode!),
    )
    if (redirectArr.length === 0) {
      saveCaches(_urls, resArr)
      return single ? resArr[0] : resArr
    }

    console.info(`crawlHTML 重定向：${redirectArr.length}/${resArr.length}`)

    const redirectResArr = await this.crawlHTML(
      redirectArr.map(({ data }) => data?.headers.location!),
    )

    const newResArr = resArr.map((res) => {
      const i = redirectArr.indexOf(res)
      return i >= 0 ? redirectResArr[i] : res
    })

    saveCaches(_urls, newResArr)
    return single ? newResArr[0] : newResArr
  }
  async crawlFile(urls: string, dir: string): Promise<string>
  async crawlFile(urls: string[], dir: string): Promise<string[]>
  async crawlFile(
    urls: string | string[],
    dir: string,
  ): Promise<string | string[]> {
    const single = isString(urls)
    const _urls = single ? [this.url(urls)] : urls.map((url) => this.url(url))

    const downloadUrls = _urls.filter((url) => {
      const fileName = path.basename(url)
      try {
        fs.accessSync(path.join(dir, fileName), fs.constants.F_OK)
        return false
      } catch (err) {
        return true
      }
    })

    console.info(
      `crawlFile 命中缓存：${_urls.length - downloadUrls.length}/${
        _urls.length
      }`,
    )

    await this.crawlApp.crawlFile({
      targets: downloadUrls,
      fileNames: downloadUrls.map((url) =>
        path.basename(url, path.extname(url)),
      ),
      storeDirs: dir,
    })

    const fileNames = _urls.map((url) => path.basename(url))

    return single ? fileNames[0] : fileNames
  }
}
