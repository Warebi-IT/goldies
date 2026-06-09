import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem('goldies_cookie_consent');
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('goldies_cookie_consent', 'accepted');
    setIsVisible(false);
    // Here you would initialize your tracking scripts (GA, Meta Pixel, etc.)
  };

  const handleDecline = () => {
    localStorage.setItem('goldies_cookie_consent', 'declined');
    setIsVisible(false);
    // Ensure no tracking scripts are loaded
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:max-w-sm z-50"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-citra-orange/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <button 
              onClick={handleDecline}
              className="absolute top-4 right-4 text-ink/40 hover:text-ink transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-pastel-sand/50 flex items-center justify-center text-citra-orange flex-shrink-0">
                <Cookie size={20} />
              </div>
              <div>
                <h3 className="font-pp-neue-corp-compact font-bold text-xl text-ink mb-1">
                  Cookies & Confidentialité
                </h3>
                <p className="font-dm-sans text-sm text-ink/70 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur Goldies et analyser notre trafic.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2.5 rounded-full border border-ink/10 text-ink font-dm-sans font-bold text-sm hover:bg-ink/5 transition-colors text-center"
              >
                Continuer sans accepter
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 rounded-full bg-citra-orange text-white font-dm-sans font-bold text-sm hover:bg-ink transition-colors shadow-lg shadow-citra-orange/20 text-center"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
