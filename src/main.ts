import { getMilestones } from './milestone'
import { saveFile } from './util'

const milestones = await getMilestones()

saveFile('milestones.json', JSON.stringify(milestones))
