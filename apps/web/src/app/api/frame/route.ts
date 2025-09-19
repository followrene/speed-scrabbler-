import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Speed Scrabbler</title>
        <meta name="description" content="A word scramble game on Celo with token rewards" />
        
        <!-- Farcaster Frame Tags -->
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${appUrl}/opengraph-image.png" />
        <meta property="fc:frame:button:1" content="Play Speed Scrabbler" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${appUrl}" />
        
        <!-- Open Graph Tags -->
        <meta property="og:title" content="Speed Scrabbler" />
        <meta property="og:description" content="A word scramble game on Celo with token rewards" />
        <meta property="og:image" content="${appUrl}/opengraph-image.png" />
        <meta property="og:url" content="${appUrl}" />
      </head>
      <body>
        <h1>Speed Scrabbler</h1>
        <p>A word scramble game on Celo with token rewards</p>
        <a href="${appUrl}">Play Now</a>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export async function POST(req: NextRequest) {
  // Handle Farcaster frame interactions
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  // Redirect to the main app
  return NextResponse.redirect(appUrl);
}
