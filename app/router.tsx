// app/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import * as Sentry from '@sentry/react'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
  })

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.replayIntegration(), Sentry.tanstackRouterBrowserTracingIntegration(router)],

    // Setting a sample rate is required for sending performance data.
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control.
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0,
  });

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
