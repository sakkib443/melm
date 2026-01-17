"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// Modern Theme Homepage Components
import {
  Hero,
  AboutFounder,
  AgencyIntro,
  ExpertiseCards,
  ScrollingTicker,
  Services,
  ProjectCounter,
  Portfolio,
  Testimonials,
  ClientLogos,
  BlogSection,
  FooterCTA
} from "@/components/pageComponents/home/modern";

export default function HomePage() {
  // TODO: This will be dynamic based on admin settings
  const activeTheme = "modern"; // "modern" | "classic" | "bold"

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <Navbar />

      <main>
        {/* Modern Theme Homepage - Aleric Agency Style */}
        <Hero />
        <AboutFounder />
        <AgencyIntro />
        <ExpertiseCards />
        <ScrollingTicker />
        <Services />
        <ProjectCounter />
        <Portfolio />
        <Testimonials />
        <ClientLogos />
        <BlogSection />
        <FooterCTA />
      </main>
    </div>
  );
}
