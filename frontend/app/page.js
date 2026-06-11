import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import TrackerPreview from './sections/TrackerPreview';
import MapPreview from './sections/MapPreview';
import SafetySection from './sections/SafetySection';
import CommunitySection from './sections/CommunitySection';
import DownloadSection from './sections/DownloadSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div className="section-line" />
        <FeaturesSection />
        <div className="section-line" />
        <TrackerPreview />
        <div className="section-line" />
        <MapPreview />
        <div className="section-line" />
        <SafetySection />
        <div className="section-line" />
        <CommunitySection />
        <div className="section-line" />
        <DownloadSection />
      </main>
      <Footer />
    </>
  );
}
