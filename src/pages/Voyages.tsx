import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Destinations from "@/components/Destinations";

const Voyages = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <Destinations />
      </div>
      <Footer />
    </div>
  );
};

export default Voyages;
