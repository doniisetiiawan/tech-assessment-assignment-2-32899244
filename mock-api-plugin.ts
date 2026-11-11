import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'

/**
 * Full-frontend persistence: a tiny in-dev-server "backend" backed by db.json.
 * Implements the spec §2 endpoints with the `success/data/message/errors`
 * envelope and spec §14 statuses (201/400/404/422). Auth/permission/HTTPS
 * items are N/A — everything runs locally under `npm run dev`.
 */

interface DbDepartment {
  id: string
  name: string
  metrics: { repositories: number; deployments: number } | null
}

interface DbMember {
  id: string
  departmentId: string
  name: string
  email: string
  avatar: string | null
  jobTitle: string
  accountStatus: 'active' | 'inactive' | 'suspended'
  accessLevel: 'full_workspace' | 'limited_workspace' | 'read_only'
  employmentType:
    | 'full_time_permanent'
    | 'contract'
    | 'part_time'
    | 'temporary'
    | 'internship'
    | 'freelance'
  bio: string | null
  joinedAt: string
  lastSeenAt: string | null
  accessExpiryAt: string | null
}

interface Db {
  currentUser: { id: string; name: string; email: string; jobTitle: string; avatar: string | null }
  departments: DbDepartment[]
  members: DbMember[]
}

const ACCOUNT_STATUSES = ['active', 'inactive', 'suspended'] as const
const ACCESS_LEVELS = ['full_workspace', 'limited_workspace', 'read_only'] as const
const EMPLOYMENT_TYPES = [
  'full_time_permanent',
  'contract',
  'part_time',
  'temporary',
  'internship',
  'freelance',
] as const

const ACTIVE_WINDOW_MS = 5 * 60 * 1000 // "active now" = seen within last 5 minutes
const EXPIRY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000 // "expiring soon" = within 30 days

// helper functions

function memberToApi(member: DbMember, db: Db, withMetrics: boolean) {
  const department = db.departments.find((d) => d.id === member.departmentId)
  const dept = department
    ? {
        id: department.id,
        name: department.name,
        ...(withMetrics ? { metrics: department.metrics } : {}),
      }
    : null
  return { ...member, departmentId: undefined, department: dept }
}

function computeStats(db: Db) {
  const now = Date.now()
  const totalMembers = db.members.length
  const activeAccounts = db.members.filter((m) => m.accountStatus === 'active')
  const activeNow = activeAccounts.filter(
    (m) => m.lastSeenAt !== null && now - new Date(m.lastSeenAt).getTime() <= ACTIVE_WINDOW_MS,
  ).length
  const pendingInvites = db.members.filter((m) => m.accountStatus === 'inactive').length
  const expiringSoon = db.members.filter(
    (m) =>
      m.accessExpiryAt !== null &&
      new Date(m.accessExpiryAt).getTime() - now <= EXPIRY_WINDOW_MS &&
      new Date(m.accessExpiryAt).getTime() > now,
  ).length
  const monthStart = new Date(now).setUTCDate(1) // new members this calendar month (UTC)
  const newMembersThisMonth = db.members.filter(
    (m) => new Date(m.joinedAt).getTime() >= monthStart,
  ).length
  const activePercentage =
    activeAccounts.length === 0
      ? 0
      : Math.round((activeNow / activeAccounts.length) * 100) // denominator = active accounts, never totalMembers
  return {
    totalMembers,
    activeNow,
    departments: db.departments.length,
    pendingInvites,
    newMembersThisMonth,
    activePercentage,
    expiringSoon,
  }
}

function validateMemberPayload(body: Record<string, unknown>, db: Db, partial: boolean) {
  const errors: Record<string, string[]> = {}

  const check = (field: string, ok: boolean, message: string) => {
    if (!ok) (errors[field] ??= []).push(message)
  }

  const required = (field: string) => {
    const value = body[field]
    check(field, typeof value === 'string' && value.trim() !== '', `${field} is required.`)
    return typeof value === 'string' ? value.trim() : undefined
  }

  const name = partial && body.name === undefined ? undefined : required('name')
  const jobTitle = partial && body.jobTitle === undefined ? undefined : required('jobTitle')
  const departmentId =
    partial && body.departmentId === undefined ? undefined : required('departmentId')

  let email: string | undefined
  if (!partial || body.email !== undefined) {
    email = required('email')
    if (email) {
      check('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Email format is invalid.')
      const normalized = email.toLowerCase()
      check(
        'email',
        !db.members.some((m) => m.email.toLowerCase() === normalized),
        'Email is already used in this organization.',
      )
    }
  }

  if (departmentId !== undefined) {
    check(
      'departmentId',
      db.departments.some((d) => d.id === departmentId),
      'Department does not belong to this organization.',
    )
  }

  for (const [field, allowed] of [
    ['accountStatus', ACCOUNT_STATUSES],
    ['accessLevel', ACCESS_LEVELS],
    ['employmentType', EMPLOYMENT_TYPES],
  ] as const) {
    const value = body[field]
    if (value !== undefined && !allowed.includes(value as never)) {
      check(field, false, `${field} must be one of: ${allowed.join(', ')}.`)
    }
  }

  const bio = body.bio
  if (bio !== undefined && bio !== null && typeof bio !== 'string') {
    check('bio', false, 'bio must be a string.')
  }

  if (body.avatar !== undefined && body.avatar !== null && typeof body.avatar !== 'string') {
    check('avatar', false, 'avatar must be a string or null.')
  }

  return { errors, name, email, jobTitle, departmentId }
}

function nextMemberId(db: Db): string {
  const max = db.members.reduce((acc, m) => {
    const n = Number.parseInt(m.id.replace('MEM-', ''), 10)
    return Number.isNaN(n) ? acc : Math.max(acc, n)
  }, 2000)
  return `MEM-${max + 1}`
}

export function mockApiPlugin(dbFile = path.resolve(import.meta.dirname, 'db.json')): Plugin {
  let cache: Db | null = null

  async function loadDb(): Promise<Db> {
    if (!cache) cache = JSON.parse(await readFile(dbFile, 'utf-8')) as Db
    return cache
  }

  async function saveDb(): Promise<void> {
    if (cache) await writeFile(dbFile, JSON.stringify(cache, null, 2) + '\n', 'utf-8')
  }

  return {
    name: 'members-mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url ?? '').split('?')[0]
        if (!url.startsWith('/api/v1/')) return next()

        const db = await loadDb()
        const method = req.method ?? 'GET'
        const send = (
          status: number,
          body: Record<string, unknown>,
          headers: Record<string, string> = {},
        ) => {
          res.statusCode = status
          for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        const readBody = (): Promise<Record<string, unknown>> =>
          new Promise((resolve) => {
            let raw = ''
            req.on('data', (chunk: Buffer) => (raw += chunk))
            req.on('end', () => {
              try {
                resolve(raw ? JSON.parse(raw) : {})
              } catch {
                resolve(null as unknown as Record<string, unknown>)
              }
            })
          })

        // --- GET /api/v1/auth/me
        if (url === '/api/v1/auth/me' && method === 'GET') {
          return send(200, { success: true, data: db.currentUser })
        }

        // --- GET /api/v1/departments
        if (url === '/api/v1/departments' && method === 'GET') {
          return send(200, { success: true, data: db.departments })
        }

        // --- POST /api/v1/members/bulk-delete (registered BEFORE /members/:id)
        if (url === '/api/v1/members/bulk-delete' && method === 'POST') {
          const body = await readBody()
          if (!body) return send(400, { success: false, message: 'Invalid JSON body.' })
          const ids = body.memberIds
          if (
            !Array.isArray(ids) ||
            ids.length === 0 ||
            !ids.every((id) => typeof id === 'string')
          ) {
            return send(422, {
              success: false,
              message: 'Validation failed',
              errors: { memberIds: ['memberIds must be a non-empty array of strings.'] },
            })
          }
          const unique = [...new Set(ids)]
          const notFound = unique.filter((id) => !db.members.some((m) => m.id === id))
          if (notFound.length > 0) {
            return send(422, {
              success: false,
              message: 'Validation failed',
              errors: { memberIds: [`Members not found: ${notFound.join(', ')}.`] },
            })
          }
          // All-or-nothing: only reached when every ID exists.
          const deletedNames = new Map(unique.map((id) => [id, db.members.find((m) => m.id === id)!]))
          db.members = db.members.filter((m) => !unique.includes(m.id))
          await saveDb()
          return send(200, {
            success: true,
            message: 'Members deleted successfully',
            data: {
              deletedCount: unique.length,
              deletedMembers: [...deletedNames.values()].map((m) => ({ id: m.id, name: m.name })),
              // No real session mechanism in the mock — honesty rule (spec §9):
              // flags omitted rather than claimed true.
            },
          })
        }

        // --- GET /api/v1/members/stats (registered BEFORE /members/:id)
        if (url === '/api/v1/members/stats' && method === 'GET') {
          return send(200, { success: true, data: computeStats(db) })
        }

        const memberMatch = url.match(/^\/api\/v1\/members\/([^/]+)$/)

        // --- GET /api/v1/members
        if (url === '/api/v1/members' && method === 'GET') {
          return send(200, {
            success: true,
            data: db.members.map((m) => memberToApi(m, db, false)),
            meta: { total: db.members.length },
          })
        }

        // --- POST /api/v1/members
        if (url === '/api/v1/members' && method === 'POST') {
          const body = await readBody()
          if (!body) return send(400, { success: false, message: 'Invalid JSON body.' })
          const { errors, name, email, jobTitle, departmentId } = validateMemberPayload(
            body,
            db,
            false,
          )
          if (Object.keys(errors).length > 0) {
            return send(422, { success: false, message: 'Validation failed', errors })
          }
          const now = new Date().toISOString()
          const member: DbMember = {
            id: nextMemberId(db),
            departmentId: departmentId!,
            name: name!,
            email: email!,
            avatar: (body.avatar as string | null | undefined) ?? null,
            jobTitle: jobTitle!,
            accountStatus: (body.accountStatus as DbMember['accountStatus']) ?? 'active',
            accessLevel: (body.accessLevel as DbMember['accessLevel']) ?? 'full_workspace',
            employmentType: (body.employmentType as DbMember['employmentType'])
              ?? 'full_time_permanent',
            bio: (body.bio as string | null | undefined) ?? null,
            joinedAt: now,
            lastSeenAt: now,
            accessExpiryAt: null,
          }
          db.members.push(member)
          await saveDb()
          return send(201, {
            success: true,
            message: 'Member created successfully',
            data: memberToApi(member, db, true),
          })
        }

        if (memberMatch) {
          const id = decodeURIComponent(memberMatch[1])
          const member = db.members.find((m) => m.id === id)

          // --- GET /api/v1/members/:id
          if (method === 'GET') {
            if (!member) return send(404, { success: false, message: 'Member not found.' })
            return send(200, { success: true, data: memberToApi(member, db, true) })
          }

          // --- PATCH /api/v1/members/:id
          if (method === 'PATCH') {
            if (!member) return send(404, { success: false, message: 'Member not found.' })
            const body = await readBody()
            if (!body) return send(400, { success: false, message: 'Invalid JSON body.' })
            const { errors, name, email, jobTitle, departmentId } = validateMemberPayload(
              body,
              db,
              true,
            )
            if (email !== undefined) {
              const normalized = email.toLowerCase()
              if (db.members.some((m) => m.id !== id && m.email.toLowerCase() === normalized)) {
                ;(errors.email ??= []).push('Email is already used in this organization.')
              }
            }
            if (Object.keys(errors).length > 0) {
              return send(422, { success: false, message: 'Validation failed', errors })
            }
            if (name !== undefined) member.name = name
            if (email !== undefined) member.email = email
            if (jobTitle !== undefined) member.jobTitle = jobTitle
            if (departmentId !== undefined) member.departmentId = departmentId
            if (body.accountStatus !== undefined)
              member.accountStatus = body.accountStatus as DbMember['accountStatus']
            if (body.accessLevel !== undefined)
              member.accessLevel = body.accessLevel as DbMember['accessLevel']
            if (body.employmentType !== undefined)
              member.employmentType = body.employmentType as DbMember['employmentType']
            if (body.bio !== undefined) member.bio = body.bio as string | null
            if (body.avatar !== undefined) member.avatar = body.avatar as string | null
            await saveDb()
            // Department may have changed — always return fresh department + metrics.
            return send(200, {
              success: true,
              message: 'Member updated successfully',
              data: memberToApi(member, db, true),
            })
          }

          // --- DELETE /api/v1/members/:id
          if (method === 'DELETE') {
            if (!member) return send(404, { success: false, message: 'Member not found.' })
            db.members = db.members.filter((m) => m.id !== id)
            await saveDb()
            return send(200, {
              success: true,
              message: 'Member deleted successfully',
              data: {
                id: member.id,
                name: member.name,
                // No real session mechanism in the mock — honesty rule (spec §9):
                permissionsRevoked: false,
                sessionsRevoked: false,
                accessTokensRevoked: false,
              },
            })
          }
        }

        return send(404, { success: false, message: `No route: ${method} ${url}` })
      })
    },
  }
}
