import '../styles/globals.css'

export const metadata = {
  title: 'Today',
  description: 'Intelligent to-do manager',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-50 text-gray-900">
          <div className="max-w-4xl mx-auto p-6">{children}</div>
        </main>
      </body>
    </html>
  )
}
