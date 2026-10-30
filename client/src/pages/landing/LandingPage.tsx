import React from 'react';
import { LandingHeader } from './components/LandingHeader';
import { HeroCinematicCore } from './components/HeroCinematicCore';
import { ScrollStorylineStage } from './components/ScrollStorylineStage';
import { ThreeWorldsExperience } from './components/ThreeWorldsExperience';
import { LiveEligibilitySimulator } from './components/LiveEligibilitySimulator';
import { ApplicationMilestonesJourney } from './components/ApplicationMilestonesJourney';
import { CinematicFinale } from './components/CinematicFinale';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060B12] text-slate-100 selection:bg-[#0F766E]/40 selection:text-[#72F4D1] font-sans overflow-x-hidden">
      {/* 1. Production Navigation Header (Zero Public Role Switcher) */}
      <LandingHeader />

      {/* 2. Massive Editorial Hero Scene with Dominant Orbital Canvas */}
      <HeroCinematicCore />

      {/* 3. Pinned Scroll-Driven Storytelling Sequence (GSAP ScrollTrigger) */}
      <ScrollStorylineStage />

      {/* 4. The Three Worlds Stage: Real Student, Recruiter & Admin Workstations */}
      <ThreeWorldsExperience />

      {/* 5. Live Explainable Cutoff Simulator (Human-Friendly Criteria Sandbox) */}
      <LiveEligibilitySimulator />

      {/* 6. Living Career Milestone Journey (Immutable State Machine Audit) */}
      <ApplicationMilestonesJourney />

      {/* 7. Cinematic Finale ("Your next opportunity starts here") & Directory Footer */}
      <CinematicFinale />
    </div>
  );
};
