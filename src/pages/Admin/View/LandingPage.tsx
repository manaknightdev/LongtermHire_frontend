import Navbar from "@/components/ExternalUI/Navbar";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import LandingCta from "@/components/LandingPage/LandingCta";
import LandingDetailView from "@/components/LandingPage/LandingDetailView";
import LandingFaq from "@/components/LandingPage/LandingFaq";
import LandingFeature from "@/components/LandingPage/LandingFeature";
import LandingInfo from "@/components/LandingPage/LandingInfo";
import LandingPricing from "@/components/LandingPage/LandingPricing";
import MainHero from "@/components/LandingPage/MainHero";
import QuickAndEasy from "@/components/LandingPage/QuickAndEasy";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

export default function LandingPage() {
  const { state } = useTheme();
  const mode = state?.theme;

  const containerStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND,
    color: THEME_COLORS[mode].TEXT,
  };

  return (
    <div
      className="mx-auto max-h-full min-h-full h-full overflow-auto px-5 w-full md:px-0 lg:px-10 transition-colors duration-200"
      style={containerStyles}
    >
      <Navbar />
      {/* HERO SECTION */}
      <MainHero />

      {/* HOW IT WORKS SECTION */}
      <HowItWorks />

      <LandingFeature />

      {/* ONE PLATFORM FOR ALL YOUR DEV NEEDS  */}
      <QuickAndEasy />

      {/* Call to action */}
      <LandingCta />

      {/* FAQs section */}
      <LandingFaq />

      <LandingInfo />

      {/* Detail view on key features */}
      <LandingDetailView />

      {/* Landing page pricing */}
      <LandingPricing />
    </div>
  );
}
