import { createCrawl } from 'x-crawl'

export const crawl = createCrawl({
  enableRandomFingerprint: true,
  baseUrl: 'https://satisfactory-calculator.com/',
  intervalTime: 5,
  maxRetry: 3,
})
