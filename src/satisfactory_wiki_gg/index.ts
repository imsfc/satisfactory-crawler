import { map } from 'radash'
import { getLinks } from './links.ts'
import { getAside } from './aside.ts'

const links = await getLinks()

Deno.writeTextFile(
  './tmp.json',
  JSON.stringify(
    await map(links, async (url) => {
      return await getAside(url)
    }),
  ),
)
