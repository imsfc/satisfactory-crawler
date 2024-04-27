import { getBuildings } from './buildings'
import { getMilestones } from './milestone'
import { getPhases } from './phases'
import { saveFile } from './util'

// const phases = await getPhases()
// saveFile('phases.json', JSON.stringify(phases))

// const milestones = await getMilestones()
// saveFile('milestones.json', JSON.stringify(milestones))

const [buildings, recipes] = await getBuildings()
saveFile('buildings.json', JSON.stringify(buildings))
saveFile('recipes.json', JSON.stringify(recipes))
