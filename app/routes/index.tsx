// app/routes/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      <div className="grid container mx-auto px-4 pt-20 items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text uppercase">
            <span className="text-white">TanStack</span> Chat
          </h1>
          <p className="text-xl text-gray-400 mb-8 w-2/3 mx-auto">
            Beacuse the world really needed another "chat with AI" app, but hey, at least its fast!
          </p>
          <Link to="/chat" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity">
            Talk Code With Me
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-row mx-auto justify-center gap-8">

        <div className="bg-gray-800 rounded-xl p-8 border border-red-500/20 hover:border-red-500/40 transition-colors w-[400px]">
            <h2 className="text-2xl font-bold mb-4 ">Built with <span className="uppercase">TanStack Start</span></h2>
            <p className="text-gray-400">
              React Router, Server Functions, and more TanStack goodies than you can shake a stick at. 
              Yes, we're that nerdy about our tech stack! 🚀
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-colors w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Powered by Sentry</h2>
            <p className="text-gray-400">
              We catch errors so you don't have to. Actually, who are we kidding? 
              You'll still have to fix them. But at least you'll know about them! 🎯
            </p>
          </div>

          
        </div>
      </div>
    </div>
  )
}
