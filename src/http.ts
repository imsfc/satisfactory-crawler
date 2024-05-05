import { ensureDir } from '@std/fs'
import { basename, dirname, join } from '@std/path'
import { HTTP_CACHE_DIR, HTTP_FILE_DIR } from '~/const.ts'
import { hash } from '~/util.ts'

export class Http {
  private base: string

  constructor(base: string) {
    this.base = base
  }

  // 自动添加 baseURL
  private url(url: string) {
    try {
      new URL(url)
      return url
    } catch (_) {
      return new URL(url, this.base).href
    }
  }

  async html(url: string) {
    const _url = this.url(url)
    const _urlHash = await hash(_url)

    // 缓存文件路径
    const cachePath = join(HTTP_CACHE_DIR, _urlHash)

    // 读取缓存
    try {
      return await Deno.readTextFile(cachePath)
    } catch (error) {
      // 抛出 非 文件不存在 错误
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error
      }
    }

    // 发起请求
    const response = await fetch(_url)
    if (!response.ok) {
      throw new Error(
        `[ HTTP 请求失败 ] { status: ${response.status}, url: ${_url} }`,
      )
    }
    const html = await response.text()

    // 写入缓存
    await ensureDir(dirname(cachePath))
    await Deno.writeTextFile(cachePath, html)

    return html
  }

  async file(url: string) {
    const _url = this.url(url)
    const _urlHash = await hash(_url)

    const fileName = basename(_url)
    const outputPath = join(HTTP_FILE_DIR, fileName)
    await ensureDir(dirname(outputPath))

    // 缓存文件路径
    const cachePath = join(HTTP_CACHE_DIR, _urlHash)

    // 尝试复制缓存文件
    try {
      await Deno.copyFile(cachePath, outputPath)
      return fileName
    } catch (error) {
      // 抛出 非 文件不存在 错误
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error
      }
    }

    // 下载文件
    const response = await fetch(_url)
    if (!response.ok) {
      throw new Error(
        `[ HTTP 下载失败 ] { status: ${response.status}, url: ${_url} }`,
      )
    }
    const buffer = Buffer.from(await response.arrayBuffer())

    // 写入文件和缓存
    await Deno.writeFile(outputPath, buffer)
    await Deno.writeFile(cachePath, buffer)

    return fileName
  }
}
