export type Role = 'merchant' | 'admin'

export interface User {
  id: string
  username: string
  role: Role
}

const USERS_KEY = 'easystay_users'
const PASSWORDS_KEY = 'easystay_passwords'

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

function ensureSeed() {
  const users = readJson<User[]>(USERS_KEY, [])
  if (users.length === 0) {
    writeJson<User[]>(USERS_KEY, [
      { id: '1', username: 'merchant', role: 'merchant' },
      { id: '2', username: 'admin', role: 'admin' }
    ])
  }

  const passwords = readJson<Record<string, string>>(PASSWORDS_KEY, {})
  if (Object.keys(passwords).length === 0) {
    writeJson<Record<string, string>>(PASSWORDS_KEY, {
      '1': '123456',
      '2': '123456'
    })
  }
}

export async function mockLogin(payload: { username: string; password: string }) {
  ensureSeed()
  const users = readJson<User[]>(USERS_KEY, [])
  const passwords = readJson<Record<string, string>>(PASSWORDS_KEY, {})

  const user = users.find((u) => u.username === payload.username)
  if (!user) throw new Error('账号或密码错误')
  if ((passwords[user.id] || '') !== payload.password) throw new Error('账号或密码错误')

  await new Promise((r) => setTimeout(r, 200))
  return {
    user,
    token: `mock_token_${user.id}`
  }
}

export async function mockRegister(payload: { username: string; password: string; role: Role }) {
  ensureSeed()
  const users = readJson<User[]>(USERS_KEY, [])
  const passwords = readJson<Record<string, string>>(PASSWORDS_KEY, {})

  const username = String(payload.username || '').trim()
  const password = String(payload.password || '')
  if (!username) throw new Error('请输入用户名')
  if (!password) throw new Error('请输入密码')
  if (users.some((u) => u.username === username)) throw new Error('用户名已存在')

  const user: User = { id: uid('u'), username, role: payload.role }
  writeJson<User[]>(USERS_KEY, [user, ...users])
  writeJson<Record<string, string>>(PASSWORDS_KEY, { ...passwords, [user.id]: password })

  await new Promise((r) => setTimeout(r, 200))
  return {
    user,
    token: `mock_token_${user.id}`
  }
}
