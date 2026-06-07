import { useState } from "react";
import { Send } from "lucide-react";
import videoSenegal from "@/assets/goldiessenegalversion.mp4";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          className="w-full h-full object-cover contrast-110 saturate-110"
        >
          <source src={videoSenegal} type="video/mp4" />
        </video>
      </div>

      {/* Form & Text Container */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-end w-full max-w-none min-h-[calc(100vh-8rem)] mt-20 lg:mt-0">
          
          {/* Text at Bottom Left */}
          <div className="lg:absolute lg:bottom-[300px] lg:left-12 text-left text-white w-full lg:w-auto mb-10 lg:mb-0 pointer-events-none self-end lg:self-auto">
            <p className="font-dm-sans text-sm uppercase tracking-wider font-bold mb-2 text-white drop-shadow-md">
              [ NOUS CONTACTER ]
            </p>
            <h2 className="font-pp-neue-corp-compact text-6xl md:text-8xl font-black uppercase tracking-tight leading-[1.1] drop-shadow-2xl">
              Prête à <br/>partir ?
            </h2>
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
                    className="w-full rounded-[16px] border-none bg-gray-100/80 px-5 py-4 text-base font-dm-sans text-ink focus:outline-none focus:ring-2 focus:ring-citra-orange/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Choisir une destination</option>
                    <option value="senegal">Sénégal</option>
                    <option value="maroc">Maroc</option>
                    <option value="tanzanie">Tanzanie (bientôt)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-dm-sans font-bold text-ink mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-[16px] border-none bg-gray-100/80 px-5 py-4 text-base font-dm-sans text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-citra-orange/50 transition-all resize-none"
                    placeholder="Dites-nous en plus sur votre projet de voyage…"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#e99ba9] py-4 text-lg font-dm-sans font-bold text-white hover:scale-[1.02] transition-transform shadow-[0_8px_30px_rgb(233,155,169,0.3)] flex items-center justify-center gap-3"
                >
                  <Send size={20} />
                  Envoyer
                </button>
              </form>
            )}
          </div>
      </div>
    </section>
  );
};

export default Contact;
