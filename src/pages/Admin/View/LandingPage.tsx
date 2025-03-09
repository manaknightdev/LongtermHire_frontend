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

export default function LandingPage() {
  return (
    <div className="mx-auto max-h-full min-h-full h-full overflow-auto px-5  w-full md:px-0 lg:px-10">
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
