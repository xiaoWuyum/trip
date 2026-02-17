export type Role = 'merchant' | 'admin' | 'user'

export type HotelStatus = 'pending' | 'active' | 'rejected' | 'offline'

export interface User {
  id: string
  username: string
  role: Role
}

export interface RoomType {
  id: string
  name: string
  area?: number
  bedType?: string
  price: number
  stock: number
  facilities?: string[]
}

export interface Hotel {
  _id: string
  merchantId: string
  name: string
  city: string
  address: string
  star: number
  phone?: string
  description?: string
  facilities?: string[]
  tags?: string[]
  images?: string[]
  roomTypes?: RoomType[]
  status: HotelStatus
  auditRemark?: string
  createdAt: string
  updatedAt: string
}

export interface HotelWithMerchant extends Hotel {
  merchant?: Pick<User, 'id' | 'username'>
}

const STORAGE_KEYS = {
  users: 'easystay_users',
  hotels: 'easystay_hotels',
  orders: 'easystay_orders'
} as const

function nowIso() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ensureMockSeed() {
  const users = readJson<User[]>(STORAGE_KEYS.users, [])
  if (users.length === 0) {
    writeJson<User[]>(STORAGE_KEYS.users, [
      { id: '1', username: 'merchant', role: 'merchant' },
      { id: '2', username: 'admin', role: 'admin' },
      { id: '3', username: 'user', role: 'user' }
    ])
  }

  const hotels = readJson<Hotel[]>(STORAGE_KEYS.hotels, [])
  if (hotels.length === 0) {
    const seed: Hotel[] = [
      {
        _id: 'h_1',
        merchantId: '1',
        name: '易宿精品酒店（国贸店）',
        city: '北京',
        address: '朝阳区建国路 88 号',
        star: 4,
        phone: '010-12345678',
        description: '近地铁，适合商务出行。',
        facilities: ['WiFi', '停车场', '健身房'],
        tags: ['商务', '近地铁'],
        images: [],
        roomTypes: [
          { id: 'r_1', name: '豪华大床房', area: 28, bedType: '1.8m 大床', price: 398, stock: 20, facilities: ['含早', '有窗'] },
          { id: 'r_2', name: '标准双床房', area: 30, bedType: '1.2m 双床', price: 428, stock: 16, facilities: ['含早'] }
        ],
        status: 'active',
        createdAt: nowIso(),
        updatedAt: nowIso()
      },
      {
        _id: 'h_2',
        merchantId: '1',
        name: '易宿轻奢酒店（西湖店）',
        city: '杭州',
        address: '西湖区龙井路 1 号',
        star: 5,
        phone: '0571-12345678',
        description: '湖景房，适合度假。',
        facilities: ['WiFi', '泳池'],
        tags: ['度假', '湖景'],
        images: [],
        roomTypes: [{ id: 'r_3', name: '湖景大床房', area: 35, bedType: '2.0m 大床', price: 688, stock: 10 }],
        status: 'pending',
        createdAt: nowIso(),
        updatedAt: nowIso()
      }
    ]
    writeJson<Hotel[]>(STORAGE_KEYS.hotels, seed)
  }
}

export function getUsers() {
  ensureMockSeed()
  return readJson<User[]>(STORAGE_KEYS.users, [])
}

export function getHotelsRaw() {
  ensureMockSeed()
  return readJson<Hotel[]>(STORAGE_KEYS.hotels, [])
}

export function setHotelsRaw(hotels: Hotel[]) {
  writeJson<Hotel[]>(STORAGE_KEYS.hotels, hotels)
}

export function listHotels(params?: { status?: HotelStatus }) {
  const users = getUsers()
  const hotels = getHotelsRaw()
  const filtered = params?.status ? hotels.filter((h) => h.status === params.status) : hotels
  return filtered
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((h) => ({
      ...h,
      merchant: users.find((u) => u.id === h.merchantId) ? { id: h.merchantId, username: users.find((u) => u.id === h.merchantId)!.username } : undefined
    })) as HotelWithMerchant[]
}

export function listMyHotels(merchantId: string) {
  return listHotels().filter((h) => h.merchantId === merchantId)
}

export function getHotelById(id: string) {
  const hotels = getHotelsRaw()
  return hotels.find((h) => h._id === id) || null
}

export function createHotel(merchantId: string, payload: Partial<Hotel>) {
  const hotels = getHotelsRaw()
  const createdAt = nowIso()
  const newHotel: Hotel = {
    _id: uid('h'),
    merchantId,
    name: payload.name || '',
    city: payload.city || '',
    address: payload.address || '',
    star: Number(payload.star || 1),
    phone: payload.phone,
    description: payload.description,
    facilities: normalizeStringArray(payload.facilities),
    tags: normalizeStringArray(payload.tags),
    images: normalizeStringArray(payload.images),
    roomTypes: normalizeRoomTypes(payload.roomTypes),
    status: 'pending',
    auditRemark: '',
    createdAt,
    updatedAt: createdAt
  }
  setHotelsRaw([newHotel, ...hotels])
  return newHotel
}

export function updateHotel(merchantId: string, id: string, payload: Partial<Hotel>) {
  const hotels = getHotelsRaw()
  const idx = hotels.findIndex((h) => h._id === id)
  if (idx < 0) throw new Error('酒店不存在')
  if (hotels[idx].merchantId !== merchantId) throw new Error('无权限')
  const updated: Hotel = {
    ...hotels[idx],
    ...payload,
    facilities: normalizeStringArray(payload.facilities ?? hotels[idx].facilities),
    tags: normalizeStringArray(payload.tags ?? hotels[idx].tags),
    images: normalizeStringArray(payload.images ?? hotels[idx].images),
    roomTypes: normalizeRoomTypes(payload.roomTypes ?? hotels[idx].roomTypes),
    updatedAt: nowIso()
  }
  const next = hotels.slice()
  next[idx] = updated
  setHotelsRaw(next)
  return updated
}

export function auditHotel(id: string, status: 'active' | 'rejected', auditRemark?: string) {
  const hotels = getHotelsRaw()
  const idx = hotels.findIndex((h) => h._id === id)
  if (idx < 0) throw new Error('酒店不存在')
  const updated: Hotel = {
    ...hotels[idx],
    status,
    auditRemark: status === 'rejected' ? (auditRemark || '').trim() : '',
    updatedAt: nowIso()
  }
  const next = hotels.slice()
  next[idx] = updated
  setHotelsRaw(next)
  return updated
}

export function toggleHotelOnline(id: string) {
  const hotels = getHotelsRaw()
  const idx = hotels.findIndex((h) => h._id === id)
  if (idx < 0) throw new Error('酒店不存在')
  const current = hotels[idx]
  const nextStatus: HotelStatus = current.status === 'offline' ? 'active' : 'offline'
  const updated: Hotel = { ...current, status: nextStatus, updatedAt: nowIso() }
  const next = hotels.slice()
  next[idx] = updated
  setHotelsRaw(next)
  return updated
}

function normalizeStringArray(input: unknown): string[] {
  if (Array.isArray(input)) return input.map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof input === 'string') return input.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

function normalizeRoomTypes(input: unknown): RoomType[] {
  if (!Array.isArray(input)) return []
  return input
    .map((x: any) => ({
      id: x.id || uid('r'),
      name: String(x.name || ''),
      area: x.area === undefined ? undefined : Number(x.area),
      bedType: x.bedType === undefined ? undefined : String(x.bedType),
      price: Number(x.price || 0),
      stock: Number(x.stock || 0),
      facilities: Array.isArray(x.facilities) ? x.facilities.map(String) : undefined
    }))
    .filter((r) => r.name)
}

