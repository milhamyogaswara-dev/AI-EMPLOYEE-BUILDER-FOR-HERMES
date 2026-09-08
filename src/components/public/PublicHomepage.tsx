import React, { useState } from 'react';
import { PublicHeader } from './PublicHeader';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { CostEfficiencySection } from './CostEfficiencySection';
import { HowItWorksSection } from './HowItWorksSection';
import { FeatureSection } from './FeatureSection';
import { FeatureShowcase } from './FeatureShowcase';
import { ComparisonSection } from './ComparisonSection';
import { UseCaseSection } from './UseCaseSection';
import { TemplatePreview } from './TemplatePreview';
import { BenefitSection } from './BenefitSection';
import { BonusSection } from './BonusSection';
import { AudienceSection } from './AudienceSection';
import { ProductVisualSection } from './ProductVisualSection';
import { FAQSection } from './FAQSection';
import { FinalCTA } from './FinalCTA';
import { PublicFooter } from './PublicFooter';
import { AuthModal } from './AuthModal';

interface PublicHomepageProps {
  defaultAuthMode?: 'signin' | 'signup';
  autoOpenAuth?: boolean;
}

export const PublicHomepage: React.FC<PublicHomepageProps> = ({
  defaultAuthMode = 'signin',
  autoOpenAuth = false,
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(autoOpenAuth);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(defaultAuthMode);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get('auth') || params.get('mode');
      if (authParam === 'login' || authParam === 'signin') {
        setIsAuthOpen(true);
        setAuthMode('signin');
      } else if (authParam === 'signup' || authParam === 'register') {
        setIsAuthOpen(true);
        setAuthMode('signup');
      }
    } catch {
      // Safe ignore in restricted environments
    }
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F0F0F0] font-sans selection:bg-[#FF5F1F]/30 selection:text-white relative">
      {/* Sticky Public Header */}
      <PublicHeader onOpenAuth={handleOpenAuth} />

      {/* Main Sections in Logical Narrative Sequence */}
      <main id="main-landing-content">
        <HeroSection onOpenAuth={handleOpenAuth} />
        <ProblemSection />
        <CostEfficiencySection />
        <HowItWorksSection />
        <FeatureSection />
        <FeatureShowcase />
        <ComparisonSection />
        <UseCaseSection />
        <TemplatePreview onOpenAuth={handleOpenAuth} />
        <BenefitSection onOpenAuth={handleOpenAuth} />
        <BonusSection />
        <AudienceSection />
        <ProductVisualSection />
        <FAQSection />
        <FinalCTA onOpenAuth={handleOpenAuth} />
      </main>

      {/* Public Footer */}
      <PublicFooter onOpenAuth={handleOpenAuth} />

      {/* Central Reusable Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={handleCloseAuth}
      />
    </div>
  );
};

export default PublicHomepage;
