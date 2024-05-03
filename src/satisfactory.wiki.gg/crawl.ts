import { createCrawl } from 'x-crawl'

export const crawl = createCrawl({
  enableRandomFingerprint: true,
  baseUrl: 'https://satisfactory.wiki.gg/',
  intervalTime: 5,
  maxRetry: 3,
})
