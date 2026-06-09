import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Destinations from "@/components/Destinations";

const Voyages = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Destinations />
      </main>
      <Footer />
    </div>
  );
};

export default Voyages;
