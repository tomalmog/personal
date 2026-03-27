import { getDisplayDownloadCount } from '@/lib/tempo/redis'
import { NextResponse } from 'next/server'

export async function GET() {
  const count = await getDisplayDownloadCount()
  return NextResponse.json({ count })
}
