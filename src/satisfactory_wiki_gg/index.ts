import { map } from 'radash'
import { getLinks } from '~/satisfactory_wiki_gg/links.ts'
import { getAside } from '~/satisfactory_wiki_gg/aside/index.ts'

const links = await getLinks()

Deno.writeTextFile(
  './tmp.json',
  JSON.stringify(
    await map(links, async (url) => {
      return await getAside(url)
    }),
  ),
)
