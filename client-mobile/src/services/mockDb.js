import Taro from '@tarojs/taro'

const KEYS = {
  hotels: 'easystay_hotels',
  orders: 'easystay_orders'
}

function nowIso() {
  return new Date().toISOString()
}

function read(key, fallback) {
  try {
    const v = Taro.getStorageSync(key)
    return v ? v : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  Taro.setStorageSync(key, value)
}

export function ensureSeed() {
  const hotels = read(KEYS.hotels, [])
  if (Array.isArray(hotels) && hotels.length > 0) return

  write(KEYS.hotels, [
    {
      _id: 'h_1',
      name: '易宿精品酒店（国贸店）',
      city: '北京',
      address: '朝阳区建国路 88 号',
      star: 4,
      status: 'active',
      basePrice: 398,
      createdAt: nowIso(),
      updatedAt: nowIso()
    },
    {
      _id: 'h_2',
      name: '易宿轻奢酒店（西湖店）',
      city: '杭州',
      address: '西湖区龙井路 1 号',
      star: 5,
      status: 'active',
      basePrice: 688,
      createdAt: nowIso(),
      updatedAt: nowIso()
    }
  ])
}

export function listActiveHotels() {
  ensureSeed()
  const hotels = read(KEYS.hotels, [])
  if (!Array.isArray(hotels)) return []
  return hotels.filter((h) => h && h.status === 'active')
}

