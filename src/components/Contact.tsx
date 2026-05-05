import { useState } from "react";
import { Send } from "lucide-react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary font-semibold mb-3">
              Contact
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
              Prête à partir ?
            </h2>
            <p className="text-muted-foreground">
              Remplissez le formulaire et nous vous recontacterons avec tous les
              détails de votre prochain séjour.
            </p>
          </div>

          {submitted ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 flex items-center justify-center mb-5">
                <Send size={28} className="text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
                Message envoyé !
              </h3>
              <p className="text-muted-foreground">
                Merci pour votre intérêt. Notre équipe vous contactera sous 24h.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-sm space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Destination souhaitée
                </label>
                <select
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Choisir une destination</option>
                  <option value="senegal">Sénégal</option>
                  <option value="maroc">Maroc</option>
                  <option value="tanzanie">Tanzanie (bientôt)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Dites-nous en plus sur votre projet de voyage…"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-secondary py-3.5 text-base font-semibold text-secondary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send size={18} />
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
