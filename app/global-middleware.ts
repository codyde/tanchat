import { registerGlobalMiddleware, createMiddleware, createIsomorphicFn } from '@tanstack/start'
import { loggingMiddleware } from './middleware'
import * as Sentry from '@sentry/node'

createIsomorphicFn().server(() => {
    console.log('Sentry init')
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
    })
}).client(() => {
    console.log('Sentry init client')
})()


const sentryMiddleware = createMiddleware().server(async ({ next }) => {
    
    console.log('Sentry middleware')
    try {
        console.log('Sentry middleware try')
        return await next()
    } catch (error) {
        Sentry.captureException(error)
        console.log('Sentry middleware error', error)
        throw error
    }
})

registerGlobalMiddleware({
    middleware: [ sentryMiddleware, loggingMiddleware],
})