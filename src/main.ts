import { getMilestones } from './milestone'
import { getPhases } from './phases'
import { saveFile } from './util'

const phases = await getPhases()
saveFile('phases.json', JSON.stringify(phases))

const milestones = await getMilestones()
saveFile('milestones.json', JSON.stringify(milestones))
