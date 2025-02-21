// app/routes/__root.tsx
import {
  Outlet,
  createRootRoute,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'
import indexCss from '../index.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Chat',
      },
    ],
    links: [{ rel: "stylesheet", href: indexCss }],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div className="error-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  ),
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        <Scripts />
      </body>
    </html>
  )
}
