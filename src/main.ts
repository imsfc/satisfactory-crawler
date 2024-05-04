import { getSCList, getSCDetails } from './satisfactory-calculator.com'
import { getGGDetails, getGGFiles } from './satisfactory.wiki.gg'
import { dir, saveFile } from './util'

const diff: { type: string; key: string; diff: [string, string] }[] = []

const scList = await getSCList()
saveFile('tmp/scList.json', JSON.stringify(scList))

const scDetails = await getSCDetails({
  en: scList.map(({ en }) => en.link),
  zh: scList.map(({ zh }) => zh.link),
})
saveFile('tmp/scDetails.json', JSON.stringify(scDetails))

// 建筑
const scBuildings = scList.filter(({ en }) => en.breadcrumb[0] === 'Buildings')
// 建筑详情
const ggBuildingDetails = await getGGDetails(
  scBuildings.map(({ en }) => en.name),
)
// 建筑图片
const ggBuildingFiles = await getGGFiles(
  ggBuildingDetails.map(({ imageLink }) => imageLink),
  dir('images/buildings'),
)
// 建筑 diff
scBuildings.forEach((item, i) => {
  const _i = scList.indexOf(item)
  if (scDetails[_i].en.description !== ggBuildingDetails[i].description) {
    diff.push({
      type: '建筑',
      key: scList[_i].zh.name,
      diff: [scDetails[_i].en.description, ggBuildingDetails[i].description],
    })
  }
})
// 建筑最终生成
// todo: 成本，电量，尺寸，接口，槽位
saveFile(
  'gen/buildings.json',
  JSON.stringify(
    scBuildings.map((scItem) => {
      const index = scList.indexOf(scItem)
      return {
        id: scItem.en.name,
        name: scItem.zh.name,
        image: ggBuildingFiles[index],
        category: scItem.zh.breadcrumb[scItem.zh.breadcrumb.length - 1],
        description: scDetails[index].zh.description,
      }
    }),
  ),
)

// 物品
const scItems = scList.filter(({ en }) => en.breadcrumb[0] === 'Items')
// 物品详情
const ggItemDetails = await getGGDetails(scItems.map(({ en }) => en.name))
console.log(ggItemDetails)

saveFile('diff.json', JSON.stringify(diff))
