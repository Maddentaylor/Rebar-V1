import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import Hero from "./components/Hero";
import Pillars from "./components/Pillars";
import WhoWeAre from "./components/WhoWeAre";
import MachinePreview from "./components/MachinePreview";
import CTABanner from "./components/CTABanner";
import WhyRMS from "./components/WhyRMS";
import ContactForm from "./components/ContactForm";

export default function HomePage() {
  return (
    <div className="bg-canvas min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <WhoWeAre />
        <MachinePreview />
        <CTABanner />
        <WhyRMS />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
