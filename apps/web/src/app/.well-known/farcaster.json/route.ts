import { NextResponse } from 'next/server';

export async function GET() {
  const header = process.env.FARCASTER_HEADER;
  const payload = process.env.FARCASTER_PAYLOAD;
  const signature = process.env.FARCASTER_SIGNATURE;

  if (!header || !payload || !signature) {
    return NextResponse.json(
      { error: 'Farcaster account association environment variables are not configured.' },
      { status: 500 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  // Official Mini App manifest format per Farcaster docs
  const response = {
    accountAssociation: {
      header: header,
      payload: payload,
      signature: signature,
    },
    frame: {
      version: "1",
      name: "Speed Scrabbler",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/opengraph-image.png`,
      buttonTitle: "Play Speed Scrabbler",
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#ffffff"
    },
  };

  return new NextResponse(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}