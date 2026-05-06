import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import http from 'http'
import app from '../../backend/src/app.js'

let server
let baseUrl

beforeAll(async () => {
  server = http.createServer(app)
  await new Promise((resolve) => server.listen(0, resolve))
  const address = server.address()
  const port = address.port
  baseUrl = `http://127.0.0.1:${port}`
})

afterAll(() => {
  if (server && server.close) server.close()
})

describe('backend health endpoint', () => {
  it('returns 200 and healthy message', async () => {
    const res = await fetch(`${baseUrl}/health`)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toHaveProperty('message', 'Server is healthy')
  })
})
