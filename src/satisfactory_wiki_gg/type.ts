export interface InventorySize {
  value: number
  unit: 'm3' | 'slots'
}

export interface AsideBuilding {
  power_usage?: number
  power_generated?: number
  overclockable?: boolean
  conveyor_inputs?: number
  conveyor_outputs?: number
  pipeline_inputs?: number
  pipeline_outputs?: number
  inventory_size?: InventorySize
}

export interface AsideDimensions {
  width?: number
  length?: number
  height?: number
  area?: number
  stackable?: boolean
  underwater?: number
  above_water?: number
}

export interface AsideItem {
  stack_size?: number
}

export interface Aside {
  // basic
  name?: string
  image?: string
  desc?: string
  unlocked_by?: string
  class_name?: string
  // group
  building?: AsideBuilding
  dimensions?: AsideDimensions
  item?: AsideItem
}
