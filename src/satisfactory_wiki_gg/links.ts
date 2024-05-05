import { load } from 'cheerio'
import { map } from 'radash'
import { http } from './http.ts'

async function getCategoryLinks(url: string): Promise<string[]> {
  const $ = load(await http.html(url))

  // 页面 链接数组
  const pages = $('#mw-pages a')
    .toArray()
    .map((el) => decodeURIComponent($(el).attr('href')!))

  // 子分类 链接数组
  const subcategories = $('#mw-subcategories a')
    .toArray()
    .map((el) => decodeURIComponent($(el).attr('href')!))

  // 递归 获得 子分类 的 页面 链接数组
  const subPages = await map(subcategories, getCategoryLinks)

  return [...pages, ...subPages.flat()]
}

const zhUrlReg = /^\/wiki\/.*\/zh$/

export async function getLinks(): Promise<string[]> {
  const links: string[] = []

  links.push(...(await getCategoryLinks('/wiki/Category:Buildings')))
  links.push(...(await getCategoryLinks('/wiki/Category:Items')))
  links.push(...(await getCategoryLinks('/wiki/Category:Fluids')))

  return [...new Set(links)].filter((url) => {
    // 排除 指示灯
    if (url === '/wiki/Indicator_Light') {
      return false
    }

    // 排除 已删除物品：Vines
    if (url === '/wiki/Vines') {
      return false
    }

    // 排除 中文页面
    if (zhUrlReg.test(url)) {
      return false
    }

    return true
  })
}
