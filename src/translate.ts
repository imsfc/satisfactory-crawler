import { construct, crush, isArray, isObject, isString } from 'radash'

const _dict = new Map()

function add(key: string, value: string) {
  if (_dict.has(key)) {
    throw new Error(`重复翻译 ${key}`)
  }
  _dict.set(key, value)
}

export function translateObj(obj: any) {
  if (isArray(obj)) {
    return obj.map((obj) => translateObj(obj))
  }

  if (isObject(obj)) {
    const _obj = crush(obj)
    const newObj = {}
    for (const key in _obj) {
      const val = _obj[key]
      // 跳过图片
      if (key.endsWith('.image')) {
        newObj[key] = val
        continue
      }

      // 跳过非字符串
      if (!isString(val)) {
        newObj[key] = val
        continue
      }

      const newVal = _dict.get(val)
      if (!newVal) {
        throw new Error(`缺少翻译 ${val}`)
      }

      newObj[key] = newVal
    }
    return construct(newObj)
  }

  return obj
}

// phase
add('Platform', '平台')
add('Framework', '框架')
add('Systems', '系统')
add('Propulsion', '推进')

// phase unlock
add('Tiers 3 and 4', '层级3 和 层级4')
add('Tiers 5 and 6', '层级5 和 层级6')
add('Tiers 7 and 8', '层级7 和 层级8')
add("'Employee of the Planet' Cup in the AWESOME Shop", '“星球雇员”咖啡杯')

// phase items
add('Smart Plating', '智能护板')
add('Versatile Framework', '多功能框架')
add('Automated Wiring', '自动线路')
add('Modular Engine', '模块化引擎')
add('Adaptive Control Unit', '自适应控制单元')
add('Assembly Director System', '组装编导系统')
add('Magnetic Field Generator', '磁场发生器')
add('Nuclear Pasta', '核子团')
add('Thermal Propulsion Rocket', '热推进火箭')

// milestones
add('Tier 0: Onboarding', '层级0')
add('Tier 1', '层级1')
add('Tier 2', '层级2')
add('Tier 3', '层级3')
add('Tier 4', '层级4')
add('Tier 5', '层级5')
add('Tier 6', '层级6')
add('Tier 7', '层级7')
add('Tier 8', '层级8')
