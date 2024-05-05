import { load } from 'cheerio'
import { http } from './http.ts'

// /images/5/50/Large_Billboard.png
const reg1 = /^\/images\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\/([^/?#]+)$/

// /images/thumb/5/50/Large_Billboard.png/64px-Large_Billboard.png
const reg2 =
  /^\/images\/thumb\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\/([^/?#]+)\/[^/?#]+$/

// /wiki/File:Large_Billboard.png
const reg3 = /^\/wiki\/File:[^/?#]+$/

// 解析并下载图片，返回文件名
export async function resolveImage(url: string) {
  if (reg1.test(url)) {
    return await http.file(url)
  }

  if (reg2.test(url)) {
    const res = reg2.exec(url)
    if (res?.length === 4) {
      return await resolveImage(`/images/${res[1]}/${res[2]}/${res[3]}`)
    }
  }

  if (reg3.test(url)) {
    const $ = load(await http.html(url))
    return await resolveImage(decodeURIComponent($('#file > a').attr('href')!))
  }

  throw new Error(`[ 解析图片 ] [ URL 匹配失败 ] { url: ${url} }`)
}
