import { getBuildings } from './buildings'
import { getMilestones } from './milestone'
import { getPhases as getProjectAssemblyPhases } from './phases'
import { translateObj } from './translate'
import { saveFile } from './util'

const projectAssemblyPhases = await getProjectAssemblyPhases()
await saveFile(
  'project-assembly-phases.json',
  JSON.stringify(projectAssemblyPhases),
)
await saveFile(
  'zh/project-assembly-phases.json',
  JSON.stringify(translateObj(projectAssemblyPhases)),
)

const milestones = await getMilestones()
await saveFile('milestones.json', JSON.stringify(milestones))
await saveFile(
  'zh/milestones.json',
  JSON.stringify(
    translateObj(
      milestones,
      /^description$|^milestones\.\d+\.image$|itemName$|rewards\.\d+\.name$|rewards\.\d+\.list/,
    ),
  ),
)

const [buildings, recipes] = await getBuildings()
await saveFile('buildings.json', JSON.stringify(buildings))
await saveFile(
  'zh/buildings.json',
  JSON.stringify(
    translateObj(buildings, /^description$|^image$|^className$|unlockedBy/),
  ),
)
await saveFile('recipes.json', JSON.stringify(recipes))
