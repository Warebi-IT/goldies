import Hero from "@/components/Hero";
import HomeDestinations from "@/components/HomeDestinations";
import GalleryCarousel from "@/components/GalleryCarousel";
import HomeTeasers from "@/components/HomeTeasers";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar is embedded inside Hero for the home page */}
      <Hero />
      <HomeDestinations />
      <GalleryCarousel />
      <HomeTeasers />
      <Footer />
    </div>
  );
};

export default Index;
