import React from 'react';
import { EditorialHeader } from './components/EditorialHeader';
import { EditorialHero } from './components/EditorialHero';
import { EditorialScrollStoryline } from './components/EditorialScrollStoryline';
import { EditorialThreeWorlds } from './components/EditorialThreeWorlds';
import { EditorialDashboardTransformation } from './components/EditorialDashboardTransformation';
import { EditorialCareerJourney } from './components/EditorialCareerJourney';
import { EditorialCutoffSandbox } from './components/EditorialCutoffSandbox';
import { EditorialFinale } from './components/EditorialFinale';
import { EditorialFooter } from './components/EditorialFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] selection:bg-[#14432A]/15 selection:text-[#14432A] font-sans overflow-x-hidden">
      {/* 1. Production Academic Editorial Masthead */}
      <EditorialHeader />

      {/* 2. Asymmetric Academic Prestige Hero & Unfolding Dossier */}
      <EditorialHero />

      {/* 3. Refined Scroll-Driven Transformation Sequence */}
      <EditorialScrollStoryline />

      {/* 4. Three Worlds: Candidate, Recruiter & Placement Directorate */}
      <EditorialThreeWorlds />

      {/* 5. Signature Scrolling Sequence: Folio Transformation to Live Dashboard */}
      <EditorialDashboardTransformation />

      {/* 6. Career-Journey Storytelling in Concept A Visual Identity */}
      <EditorialCareerJourney />

      {/* 7. Interactive Explainable Cutoff Sandbox */}
      <EditorialCutoffSandbox />

      {/* 8. Editorial Grand Finale */}
      <EditorialFinale />

      {/* 9. Dignified Institutional Footer */}
      <EditorialFooter />
    </div>
  );
};
