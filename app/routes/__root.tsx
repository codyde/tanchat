// app/routes/__root.tsx
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
  Link,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'
import { Brain } from 'lucide-react'
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
        title: 'TanStack Start Starter',
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
        <nav className="border-b border-orange-500/10 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 ml-1.5 text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text"
                >
                  <Brain className="w-7 h-7 text-orange-500" />
                  TanChat
                </Link>
                <div className="h-5 w-px bg-orange-500/10 mx-6" />
                <div className="flex items-center gap-6">
                  <Link 
                    to="/" 
                    className="text-base font-medium text-gray-300 transition-colors hover:text-orange-500"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/chat" 
                    className="text-base font-medium text-gray-300 transition-colors hover:text-orange-500"
                  >
                    Chat
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <a
                  href="https://github.com/tanstack/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium text-gray-300 transition-colors hover:text-orange-500"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1">
          {children}
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
