// app/routes/index.tsx
import * as fs from 'node:fs'
import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

const filePath = 'count.txt'

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
  )
}

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
  return readCount()
})

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount()
    await fs.promises.writeFile(filePath, `${count + data}`)
  })

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text">
            TanChat
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Because every API deserves a chat interface... even the questionable ones 🤔
          </p>
          <Link to="/chat" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity">
            Talk Code With Me
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sentry Card */}
          <div className="bg-gray-800 rounded-xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Powered by Sentry</h2>
            <p className="text-gray-400">
              We catch errors so you don't have to. Actually, who are we kidding? 
              You'll still have to fix them. But at least you'll know about them! 🎯
            </p>
          </div>

          {/* TanStack Card */}
          <div className="bg-gray-800 rounded-xl p-8 border border-red-500/20 hover:border-red-500/40 transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Built with TanStack</h2>
            <p className="text-gray-400">
              React Router, Server Functions, and more TanStack goodies than you can shake a stick at. 
              Yes, we're that nerdy about our tech stack! 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>Built for testing API integrations. Use responsibly... or don't, we're not your parent. 🤷‍♂️</p>
      </div>
    </div>
  )
}
