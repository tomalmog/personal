import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    time: new Date().toISOString(),
    env: {
      hasKvUrl: !!process.env.TEMPO_KV_REST_API_URL,
      hasKvToken: !!process.env.TEMPO_KV_REST_API_TOKEN,
    }
  })
}
