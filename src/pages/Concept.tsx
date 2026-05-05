import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutConcept from "@/components/AboutConcept";

const Concept = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-20">
      <AboutConcept />
    </div>
    <Footer />
  </div>
);

export default Concept;
