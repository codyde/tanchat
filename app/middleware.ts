import { createMiddleware } from '@tanstack/start'

const loggingMiddleware = createMiddleware().server(async ({ next, data }) => {
  console.log('Request received:', data)
  const result = await next()
  console.log('Response processed:', result)
  return result
})

export { loggingMiddleware }