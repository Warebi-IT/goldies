import { useState } from "react";
import { Send, Instagram } from "lucide-react";
import videoSenegal from "@/assets/goldiessenegalversion.mp4";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("contacts").insert({
        prenom,
        nom,
        email,
        destination,
        message
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error sending contact message:", err);
      alert("Une erreur est survenue lors de l'envoi de votre message: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover transform-gpu"
        >
          <source src={videoSenegal} type="video/mp4" />
        </video>
      </div>

      {/* Form & Text Container */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-end w-full max-w-none min-h-[calc(100vh-8rem)] mt-20 lg:mt-0">
          
          {/* Text at Left (Top on Mobile) */}
          <div className="lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-12 text-center lg:text-left text-white w-full lg:w-auto mb-12 lg:mb-0 z-20 flex flex-col items-center lg:items-start">
            <p className="font-dm-sans text-sm uppercase tracking-widest font-bold mb-3 text-white/90 drop-shadow-md pointer-events-none bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 w-max">
              Nous contacter
            </p>
            <h2 className="font-pp-neue-corp-compact text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[1.05] drop-shadow-2xl pointer-events-none mb-8 mt-2">
              Prête à <br className="hidden lg:block"/>partir ?
            </h2>
            
            {/* Social Links */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shadow-xl">
              <p className="font-dm-sans text-sm font-medium text-white/90 drop-shadow-md">
                Rejoignez la communauté
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/goldies.travel?igsh=MTV6dThwbjlrYzg0MA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full shadow-lg bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-citra-orange hover:text-ink hover:scale-110 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://www.tiktok.com/@goldies_travel?_r=1&_t=ZN-9716IvKcjKQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full shadow-lg bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-citra-orange hover:text-ink hover:scale-110 transition-all duration-300"
                  aria-label="TikTok"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form (Glassmorphism) */}
          <div className="w-full max-w-[500px] bg-white/40 backdrop-blur-lg rounded-[32px] p-8 md:p-10 shadow-2xl border border-white/30 pointer-events-auto">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-citra-orange/20 flex items-center justify-center mb-6">
                  <Send size={32} className="text-citra-orange" />
                </div>
                <h3 className="font-pp-neue-corp-compact text-3xl font-black text-ink uppercase tracking-tight mb-4">
                  Message envoyé !
                </h3>
                <p className="font-dm-sans text-lg font-medium text-ink/70">
                  Merci pour votre intérêt. Notre équipe vous contactera sous 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-dm-sans font-bold text-ink mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full rounded-[16px] border-none bg-gray-100/80 px-5 py-4 text-base font-dm-sans text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-citra-orange/50 transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-dm-sans font-bold text-ink mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full rounded-[16px] border-none bg-gray-100/80 px-5 py-4 text-base font-dm-sans text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-citra-orange/50 transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-dm-sans font-bold text-ink mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[16px] border-none bg-gray-100/80 px-5 py-4 text-base font-dm-sans text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-citra-orange/50 transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-dm-sans font-bold text-ink mb-2">
                    Destination souhaitée
                  </label>
                  <select
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-[16px] border-none bg-gray-100/80 px-5 py-4 text-base font-dm-sans text-ink focus:outline-none focus:ring-2 focus:ring-citra-orange/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Choisir une destination</option>
                    <option value="senegal">Sénégal</option>
                    <option value="maroc">Maroc</option>
                    <option value="benin">Bénin</option>
                    <option value="tanzanie">Tanzanie (bientôt)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-dm-sans font-bold text-ink mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-[16px] border-none bg-gray-100/80 px-5 py-4 text-base font-dm-sans text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-citra-orange/50 transition-all resize-none"
                    placeholder="Dites-nous en plus sur votre projet de voyage…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#e99ba9] py-4 text-lg font-dm-sans font-bold text-white hover:scale-[1.02] transition-transform shadow-[0_8px_30px_rgb(233,155,169,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  {loading ? "Envoi..." : "Envoyer"}
                </button>
              </form>
            )}
          </div>
      </div>
    </section>
  );
};

export default Contact;
