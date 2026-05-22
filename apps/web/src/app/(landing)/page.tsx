'use client';

import { Hero } from '@/components/Hero';
import { LogoCloudLoop } from '@/components/LogoCloudLoop';
import { BlockPreview } from '@/components/BlockPreview';
import { OpenSourceCTA } from '@/components/OpenSourceCTA';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/ui/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      {/* Hero Section */}
      <Hero />
      
      {/* Tech Stack Marquee */}
      <LogoCloudLoop />

      {/* Block Preview Section */}
      <BlockPreview block="parallax-hero" height={560} />

      {/* Open Source CTA Section */}
      <OpenSourceCTA />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </main>
  );
}
