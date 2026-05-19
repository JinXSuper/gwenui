import { NextResponse } from 'next/server';

export async function GET() {
  const registryData = {
    version: "0.1.0",
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        "id": "auth-login",
        "name": "Auth — Login",
        "description": "A clean, full-page authentication layout with email/password form, social login slots, and subtle Framer Motion animations.",
        "tier": "basic",
        "version": "1.0.0",
        "license": "ELv2",
        "files": [
          {
            "path": "auth-login/index.tsx",
            "url": "https://raw.githubusercontent.com/jinxsuper/gwenui/main/blocks/auth-login/index.tsx"
          }
        ],
        "dependencies": ["framer-motion", "lucide-react"],
        "devDependencies": [],
        "requiresTailwind": true,
        "requiresGwenTheme": true
      },
      {
        "id": "parallax-hero",
        "name": "Parallax Hero",
        "description": "A cinematic parallax hero section with depth layers, mouse-tracking 3D tilt, and scroll-driven animations.",
        "tier": "supreme",
        "version": "1.0.0",
        "license": "MIT+CommonsClause",
        "files": [
          {
            "path": "parallax-hero/index.tsx",
            "url": "https://raw.githubusercontent.com/jinxsuper/gwenui/main/blocks/parallax-hero/index.tsx"
          }
        ],
        "dependencies": ["framer-motion", "@react-three/fiber", "@react-three/drei", "three"],
        "devDependencies": ["@types/three"],
        "requiresTailwind": true,
        "requiresGwenTheme": true
      }
    ]
  };

  return NextResponse.json(registryData, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
