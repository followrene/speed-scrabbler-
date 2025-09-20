import { NextResponse } from 'next/server';

export async function GET() {
  const debugInfo = {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    computed_url: process.env.NEXT_PUBLIC_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
    all_env_vars: Object.keys(process.env).filter(key => key.includes('VERCEL') || key.includes('URL')).reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {} as Record<string, string | undefined>)
  };

  return NextResponse.json(debugInfo, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
