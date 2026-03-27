import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tempo - Run Claude Code Overnight',
  description: 'Automated Claude Code runner with rate limit handling. Start a task, go to sleep, wake up to results.',
  keywords: ['claude', 'claude code', 'automation', 'ai', 'coding', 'developer tools'],
  authors: [{ name: 'Tempo' }],
  icons: {
    icon: '/tempo-iconlogo.png',
    apple: '/tempo-iconlogo.png',
  },
  openGraph: {
    title: 'Tempo - Run Claude Code Overnight',
    description: 'Automated Claude Code runner with rate limit handling.',
    type: 'website',
  },
}

export default function TempoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
