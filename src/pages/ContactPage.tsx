import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

const ContactPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-20">
      <Contact />
    </div>
    <Footer />
  </div>
);

export default ContactPage;
