import { getSCList, getSCDetails } from './satisfactory-calculator.com'
import { getGGDetails } from './satisfactory.wiki.gg'
import { saveFile } from './util'

const diff: { type: string; key: string; diff: [string, string] }[] = []

const scList = await getSCList()
saveFile('tmp/scList.json', JSON.stringify(scList))

const scDetails = await getSCDetails({
  en: scList.map(({ en }) => en.link),
  zh: scList.map(({ zh }) => zh.link),
})
saveFile('tmp/scDetails.json', JSON.stringify(scDetails))

// 建筑
{
  const scListFiltered = scList.filter(
    ({ en }) => en.breadcrumb[0] === 'Buildings',
  )
  const ggDetails = await getGGDetails(scListFiltered.map(({ en }) => en.name))
  scListFiltered.forEach((item, i) => {
    const _i = scList.indexOf(item)
    if (scDetails[_i].en.description !== ggDetails[i].description) {
      diff.push({
        type: '建筑',
        key: scList[_i].zh.name,
        diff: [scDetails[_i].en.description, ggDetails[i].description],
      })
    }
  })
}

// 物品
// {
//   const scListFiltered = scList.filter(({ en }) => en.breadcrumb[0] === 'Items')
//   const ggDetails = await getGGDetails(scListFiltered.map(({ en }) => en.name))
//   scListFiltered.forEach((item, i) => {
//     const _i = scList.indexOf(item)
//     if (scDetails[_i].en.description !== ggDetails[i].description) {
//       diff.push({
//         type: '物品',
//         key: scList[_i].zh.name,
//         diff: [scDetails[_i].en.description, ggDetails[i].description],
//       })
//     }
//   })
// }

saveFile('diff.json', JSON.stringify(diff))
