import { getSCList, getSCDetails } from './satisfactory-calculator.com'
import { getGGBuilding } from './satisfactory.wiki.gg'
import { saveFile } from './util'

const scList = await getSCList()

const scDetails = await getSCDetails({
  en: scList.map(({ en }) => en.link),
  zh: scList.map(({ zh }) => zh.link),
})

const scBuildings = scList.filter(({ en }) => en.breadcrumb[0] === 'Buildings')
const scArchitecture = scList.filter(
  ({ en }) => en.breadcrumb[0] === 'Architecture',
)
const scStructures = scList.filter(
  ({ en }) => en.breadcrumb[0] === 'Structures',
)

const ggBuildingDetails = await getGGBuilding(
  scBuildings.map(({ en }) => en.name),
)

const diff = {}

scBuildings.forEach((scBuilding, i) => {
  const _i = scList.indexOf(scBuilding)
  if (scDetails[_i].en.description !== ggBuildingDetails[i].description) {
    diff[scBuilding.zh.name] = {
      a: scDetails[_i].en.description,
      b: ggBuildingDetails[i].description,
    }
  }
})

saveFile('diff.json', JSON.stringify(diff))
