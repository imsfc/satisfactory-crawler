export interface ItemWithQuantity {
  itemName: string
  quantity: number
}

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

export type AsideDimensionsValue =
  | number // 单值
  | number[] // 多值
  | { min: number; max: number } // 可变范围

export type AsideDimensionsLength =
  | AsideDimensionsValue
  | { visual: AsideDimensionsValue; hitbox: AsideDimensionsValue }

export interface AsideDimensions {
  width?: AsideDimensionsLength
  length?: AsideDimensionsLength
  height?: AsideDimensionsLength
  area?: AsideDimensionsLength
  stackable?: boolean
  underwater?: number
  above_water?: number
}

export interface AsideItem {
  stack_size?: number
  sink_points?: number
  radioactive?: number
}

export interface AsideEquipment {
  equipment_slot?: 'head' | 'body' | 'hands' | 'back' | 'legs'
  damage?: number
}

export interface AsideFuel {
  energy?: number
  stack_energy?: number
}

export interface AsideLiquid {
  abbreviation?: string
}

export interface AsideGas {
  abbreviation?: string
}

export interface AsideVehicle {
  maximum_speed?: number
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
  ingredients?: ItemWithQuantity[]
  item?: AsideItem
  equipment?: AsideEquipment
  fuel?: AsideFuel
  liquid?: AsideLiquid
  gas?: AsideGas
  vehicle?: AsideVehicle
}
