import { getBuildings } from './buildings'
import { getMilestones } from './milestone'
import { getPhases } from './phases'
import { translateObj } from './translate'
import { saveFile } from './util'

const phases = await getPhases()
await saveFile('phases.json', JSON.stringify(phases))
await saveFile('zh/phases.json', JSON.stringify(translateObj(phases)))

const milestones = await getMilestones()
await saveFile('milestones.json', JSON.stringify(milestones))
// await saveFile('zh/milestones.json', JSON.stringify(translateObj(milestones)))

const [buildings, recipes] = await getBuildings()
await saveFile('buildings.json', JSON.stringify(buildings))
await saveFile('recipes.json', JSON.stringify(recipes))
