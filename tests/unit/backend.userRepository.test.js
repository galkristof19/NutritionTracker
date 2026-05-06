import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the db query module used by repository
vi.mock('../../backend/src/config/db.js', () => ({
  query: vi.fn(),
}))

import * as userRepo from '../../backend/src/repositories/userRepository.js'
import { query } from '../../backend/src/config/db.js'

describe('backend userRepository', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getUserByEmail returns user when found', async () => {
    query.mockResolvedValue({ rows: [{ uid: 'u1', email: 'a@b', name: 'A' }] })
    const user = await userRepo.getUserByEmail('a@b')
    expect(user.email).toBe('a@b')
  })

  it('getUserByEmail returns null when not found', async () => {
    query.mockResolvedValue({ rows: [] })
    const user = await userRepo.getUserByEmail('x@x')
    expect(user).toBeNull()
  })

  it('userExists returns true when rows present', async () => {
    query.mockResolvedValue({ rows: [{ uid: 'u1' }] })
    const exists = await userRepo.userExists('u1')
    expect(exists).toBe(true)
  })

  it('userExists returns false when no rows', async () => {
    query.mockResolvedValue({ rows: [] })
    const exists = await userRepo.userExists('u2')
    expect(exists).toBe(false)
  })

  it('getUserByUid throws NotFoundError when not present', async () => {
    query.mockResolvedValue({ rows: [] })
    await expect(userRepo.getUserByUid('nope')).rejects.toThrow()
  })
})
