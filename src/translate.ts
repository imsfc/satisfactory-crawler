import { construct, crush, isArray, isObject, isString } from 'radash'

const _dict = new Map<string, string>()

function add(key: string, value: string) {
  if (_dict.has(key)) {
    throw new Error(`[重复翻译] ${key}`)
  }
  _dict.set(key, value)
}

function translate(val: any) {
  if (!isString(val)) {
    return val
  }
  const newVal = _dict.get(val)
  if (!newVal) {
    throw new Error(`[缺少翻译] ${val}`)
  }
  return newVal
}

export function translateObj(obj: any, ignore?: RegExp) {
  if (isArray(obj)) {
    return obj.map((obj) => translateObj(obj, ignore))
  }

  if (isObject(obj)) {
    const _obj = crush(obj)
    const newObj = {}
    for (const key in _obj) {
      const val = _obj[key]
      // 跳过图片
      if (ignore && ignore.test(key)) {
        newObj[key] = val
        continue
      }

      // 跳过非字符串
      if (!isString(val)) {
        newObj[key] = val
        continue
      }

      try {
        newObj[key] = translate(val)
      } catch (err) {
        throw new Error(`[${key}] ${err.message}`)
      }
    }
    return construct(newObj)
  }

  return translate(obj)
}

// phase
add('Platform', '平台')
add('Framework', '框架')
add('Systems', '系统')
add('Propulsion', '推进')

// phase unlock
add('Tiers 3 and 4', '层级 3 和 层级 4')
add('Tiers 5 and 6', '层级 5 和 层级 6')
add('Tiers 7 and 8', '层级 7 和 层级 8')
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
add('Tier 0: Onboarding', '等级 0')
add('Tier 0', '等级 0')
add('Tier 1', '等级 1')
add('Tier 2', '等级 2')
add('Tier 3', '等级 3')
add('Tier 4', '等级 4')
add('Tier 5', '等级 5')
add('Tier 6', '等级 6')
add('Tier 7', '等级 7')
add('Tier 8', '等级 8')

// milestones Tier 0
add('HUB Upgrade 1', '枢纽升级 1')
add('HUB Upgrade 2', '枢纽升级 2')
add('HUB Upgrade 3', '枢纽升级 3')
add('HUB Upgrade 4', '枢纽升级 4')
add('HUB Upgrade 5', '枢纽升级 5')
add('HUB Upgrade 6', '枢纽升级 6')

// milestones Tier 1
add('Base Building', '基础建筑')
add('Logistics', '物流')
add('Field Research', '实地研究')

// milestones Tier 2
add('Part Assembly', '零件组装')
add('Obstacle Clearing', '障碍清理')
add('Jump Pads', '弹射板')
add('Resource Sink Bonus Program', '资源回收奖励项目')
add('Logistics Mk.2', '2级物流')

// milestones Tier 3
add('Coal Power', '煤炭发电')
add('Vehicular Transport', '载具运输')
add('Basic Steel Production', '基础钢铁生产')
add('Improved Melee Combat', '近距作战改良')

// milestones Tier 4
add('Advanced Steel Production', '进阶钢铁生产')
add('Expanded Power Infrastructure', '电力基建扩展')
add('Hypertubes', '超级管道')
add('Logistics Mk.3', '3级物流')
add('FICSIT Blueprints', 'FICSIT蓝图')

// milestones Tier 5
add('Oil Processing', '石油加工')
add('Industrial Manufacturing', '工业制造')
add('Alternative Fluid Transport', '替代式液体运输')
add('Gas Mask', '防毒面具')

// milestones Tier 6
add('Logistics Mk.4', '4级物流')
add('Jetpack', '喷射背包')
add('Monorail Train Technology', '单轨列车技术')
add('Pipeline Engineering Mk.2', '2级管道工程')

// milestones Tier 7
add('Bauxite Refinement', '铝土矿精炼')
add('Logistics Mk.5', '5级物流')
add('Aeronautical Engineering', '航空工程')
add('Hazmat Suit', '防护服')
add('Hover Pack', '悬浮背包')

// milestones Tier 8
add('Nuclear Power', '核能')
add('Advanced Aluminum Production', '高级铝生产')
add('Leading-edge Production', '前沿产品')
add('Particle Enrichment', '粒子富集')

// buildings 建筑/开采
add('Miner Mk.1', '1级采矿机')
add('Miner Mk.2', '2级采矿机')
add('Miner Mk.3', '3级采矿机')
add('Oil Extractor', '油井')
add('Water Extractor', '抽水站')
add('Resource Well Pressurizer', '矿井增压器')
add('Resource Well Extractor', '矿井采集器')

// buildings 建筑/生产量
add('Smelter', '冶炼器')
add('Foundry', '铸造器')
add('Constructor', '构造器')
add('Assembler', '组装器')
add('Manufacturer', '制造器')
add('Refinery', '精炼厂')
add('Packager', '灌装机')
add('Blender', '搅拌器')
add('Particle Accelerator', '粒子加速器')

// buildings 建筑/发电机
add('Biomass Burner', '生物质燃烧器')
add('Coal Generator', '煤炭发电机')
add('Fuel Generator', '燃油发电机')
add('Geothermal Generator', '地热发电机')
add('Nuclear Power Plant', '核电站')
add('Power Storage', '蓄电池')

// buildings 建筑/特殊
add('The HUB', '枢纽')
add('MAM', '分子分析机')
add('Space Elevator', '太空电梯')
add('Blueprint Designer', '蓝图设计器')
add('AWESOME Sink', 'AWESOME回收器')
add('AWESOME Shop', 'AWESOME商店')

// buildings 建筑/工作站
add('Craft Bench', '制作台')
add('Equipment Workshop', '设备车间')

// buildings 建筑/存储
add('Personal Storage Box', '个人储物盒')
add('Medical Storage Box', '医疗储物盒')
add('Hazard Storage Box', '有害物质储物盒')
add('Storage Container', '存储器')
add('Industrial Storage Container', '工业存储器')
add('Fluid Buffer', '液体缓冲罐')
add('Industrial Fluid Buffer', '工业液体缓冲罐')

// buildings 建筑/对接站
add('Truck Station', '卡车站')
add('Drone Port', '无人机港')
add('Freight Platform', '货运站台')
add('Fluid Freight Platform', '液体货运站台')

// buildings 建筑/塔
add('Lookout Tower', '瞭望塔')
add('Radar Tower', '雷达塔')

// buildings 建筑物/框架

// buildings 建筑物/地基/FICSIT 地基
// buildings 建筑物/地基/网纹金属地基
// buildings 建筑物/地基/混凝土地基
// buildings 建筑物/地基/镀层混凝土地基
// buildings 建筑物/地基/柏油地基

// buildings 建筑物/墙壁/FICSIT 墙壁
// buildings 建筑物/墙壁/FICSIT 墙壁 | 坡形墙壁
// buildings 建筑物/墙壁/FICSIT 墙 | 倾斜墙
// buildings 建筑物/墙壁/FICSIT 墙壁 | 窗户
// buildings 建筑物/墙壁/FICSIT 墙壁 | 门
// buildings 建筑物/墙壁/FICSIT 墙壁 | 传送口墙壁

// buildings 建筑物/墙壁/钢板墙壁
// buildings 建筑物/墙壁/钢板墙壁 | 坡形墙壁
// buildings 建筑物/墙壁/钢板墙壁 | 斜面墙壁
// buildings 建筑物/墙壁/钢板墙壁 | 窗户
// buildings 建筑物/墙壁/钢板墙壁 | 门
// buildings 建筑物/墙壁/钢板墙壁 | 传送口墙壁

// buildings 建筑物/墙壁/混凝土墙壁
// buildings 建筑物/墙壁/混凝土墙壁 | 坡形墙壁
// buildings 建筑物/墙壁/混凝土墙壁 | 斜面墙壁
// buildings 建筑物/墙壁/混凝土墙 | 窗户
// buildings 建筑物/墙壁/混凝土墙壁 | 门
// buildings 建筑物/墙壁/混凝土墙壁 | 传送带连接物

// buildings 建筑物/墙壁/全开

// buildings 建筑物/房顶/FICSIT 房顶
// buildings 建筑物/房顶/金属房顶
// buildings 建筑物/房顶/柏油房顶
// buildings 建筑物/房顶/玻璃房顶

// buildings 建筑物/梁
add('Beam Support', '梁基座')
add('Metal Beam', '金属梁')
add('Painted Beam', '漆刷梁')
add('Beam Connector', '梁连接器')
add('Beam Connector Double', '双重梁连接器')

// buildings 建筑物/支柱
// add('Small Pillar Support', '小型支柱基座')
// add('Small Metal Pillar', '小型金属支柱')
// add('Small Concrete Pillar', '小型混凝土支柱')
// add('Small Frame Pillar', '小型框架支柱')
// add('Big Pillar Support', '小型支柱基座')
// add('Big Metal Pillar', '小型金属支柱')
// add('Big Concrete Pillar', '小型混凝土支柱')
// add('Big Frame Pillar', '小型框架支柱')

// buildings 建筑物/附加装置
add('Ladder', '直梯')
// add('Industrial Railing', '工业栏杆')
// add('Modern Railing', '现代栏杆')
// add('Road Barrier', '路障')
// add('Stairs Left', '左楼梯')
// add('Stairs Right', '右楼梯')

// buildings 建筑物/天桥
// add('Catwalk Straight', '直行天桥')
// add('Catwalk Corner', '拐角天桥')
// add('Catwalk T-Crossing', '丁字天桥')
// add('Catwalk Crossing', '十字天桥')
// add('Catwalk Ramp', '天桥斜坡')
// add('Catwalk Stairs', '天桥楼梯')

// buildings 建筑物/步行道
// add('Walkway Straight', '直步行道')
// add('Walkway Turn', '拐角步行道')
// add('Walkway T-Crossing', '丁字步行道')
// add('Walkway Crossing', '十字步行道')
// add('Walkway Ramp', '步行道斜坡')

// buildings 建筑框架/物流/传送带支架
add('Conveyor Pole', '传送带立架')
add('Stackable Conveyor Pole', '传送带叠架')
add('Conveyor Ceiling Mount', '传送带吊架')
add('Conveyor Wall Mount', '传送带壁架')
add('Conveyor Lift Floor Hole', '垂直传送带地板孔')

// buildings 建筑框架/物流/传送带
add('Conveyor Belt Mk.1', '1级传送带')
add('Conveyor Belt Mk.2', '2级传送带')
add('Conveyor Belt Mk.3', '3级传送带')
add('Conveyor Belt Mk.4', '5级传送带')
add('Conveyor Belt Mk.5', '5级传送带')

// buildings 建筑框架/物流/垂直传送带
add('Conveyor Lift Mk.1', '1级垂直传送带')
add('Conveyor Lift Mk.2', '2级垂直传送带')
add('Conveyor Lift Mk.3', '3级垂直传送带')
add('Conveyor Lift Mk.4', '5级垂直传送带')
add('Conveyor Lift Mk.5', '5级垂直传送带')

// buildings 建筑框架/物流/引导设备
add('Conveyor Merger', '传送合并器')
add('Conveyor Splitter', '传送分离器')
add('Smart Splitter', '智能分离器')
add('Programmable Splitter', '可编程分离器')

// buildings 建筑框架/物流/引导设备
add('Power Line', '电源线')
add('Power Pole Mk.1', '1级电线杆')
add('Power Pole Mk.2', '2级电线杆')
add('Power Pole Mk.3', '3级电线杆')
// add('Wall Outlet Mk.1', '1级墙插')
// add('Double Wall Outlet Mk.1', '1级双面墙插')
// add('Wall Outlet Mk.2', '2级墙插')
// add('Double Wall Outlet Mk.2', '2级双面墙插')
// add('Wall Outlet Mk.3', '3级墙插')
// add('Double Wall Outlet Mk.3', '3级双面墙插')
add('Power Switch', '电源开关')
add('Priority Power Switch', '分级电源开关')
add('Power Tower', '输电塔')
add('Power Tower Platform', '平台输电塔')

// buildings 建筑框架/火车
add('Railway', '铁轨')
// add('Railroad Switch Control', '铁轨道岔控制杆')
add('Block Signal', '区间信号灯')
add('Path Signal', '路径信号灯')
add('Train Station', '火车站')
add('Empty Platform', '空站台')
add('Empty Platform With Catwalk', '带天桥空站台')

// buildings 建筑框架/管道
add('Pipeline Mk.1 (No Indicator)', '1级管道 (无流量计)')
add('Pipeline Mk.1', '1级管道')
add('Pipeline Mk.2 (No Indicator)', '2级管道 (无流量计)')
add('Pipeline Mk.2', '2级管道')
add('Valve', '阀门')
add('Pipeline Junction Cross', '管道交叉接头')
add('Pipeline Pump Mk.1', '1级管道泵')
add('Pipeline Pump Mk.2', '2级管道泵')

// buildings 建筑框架/管道/管道支架
add('Pipeline Support', '管道支架')
add('Stackable Pipeline Support', '管道叠架')
// add('Pipeline Wall Support', '管道壁架')
add('Pipeline Wall Hole', '管道穿墙孔')
add('Pipeline Floor Hole', '管道地板孔')

// buildings 建筑框架/超级管道
add('Hypertube', '超级管道')
add('Hypertube Entrance', '超级管道入口')
add('Hypertube Support', '超级管道支架')
add('Stackable Hypertube Support', '超级管道叠架')
add('Hypertube Wall Support', '超级管道壁架')
add('Hypertube Wall Hole', '超级管道穿墙孔')
add('Hypertube Floor Hole', '超级管道地板孔')

// buildings 建筑框架/灯光
add('Ceiling Light', '吸顶灯')
add('Street Light', '路灯')
add('Flood Light Tower', '泛光灯塔')
add('Wall Mounted Flood Light', '泛光壁灯')
add('Lights Control Panel', '灯光控制面板')

// buildings 建筑框架/标志牌
// add('Label Sign 2m', '标签牌 2m')
// add('Label Sign 3m', '标签牌 3m')
// add('Label Sign 4m', '标签牌 4m')
// add('Portrait Sign', '竖向牌')
// add('Square Sign 0.5m', '方形牌 0.5m')
// add('Square Sign 1m', '方形牌 1m')
// add('Square Sign 2m', '方形牌 2m')
// add('Display Sign', '展示牌')
// add('Small Billboard', '小型告示牌')
// add('Large Billboard', '大型告示牌')

// buildings 建筑框架/平板
add('U-Jelly Landing Pad', '酸性凝胶着陆垫')
add('Jump Pad', '弹射板')

// buildings 其他
add('Portable Miner', '便携式采矿器')
