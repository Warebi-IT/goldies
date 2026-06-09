import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveGlobe from "@/components/InteractiveGlobe";
import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";

const Avis = () => {
  const [visibleCount, setVisibleCount] = useState(12);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, reviews.length));
  };

  return (
    <div className="min-h-screen bg-white relative z-0">
      <Navbar />

      {/* Background Map */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-20">
        <InteractiveGlobe variant="vivid" />
      </div>
      
      {/* Hero Section */}
      <div className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="font-dm-sans text-sm uppercase tracking-wider font-bold mb-4 text-citra-orange">
            [ TÉMOIGNAGES ]
          </p>
          <h1 className="font-pp-neue-corp-compact text-5xl md:text-7xl font-black uppercase tracking-tight text-ink mb-6">
            Elles ont adoré
          </h1>
          <p className="font-dm-sans text-lg md:text-xl font-medium text-ink/70 max-w-2xl mx-auto">
            Découvrez les retours d'expérience des Goldies qui ont déjà partagé une aventure avec nous.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.slice(0, visibleCount).map((review, idx) => {
            const bgColors = ["bg-pastel-sand", "bg-pastel-sage", "bg-pastel-rose", "bg-pastel-peach", "bg-pastel-lime"];
            const cardBg = bgColors[idx % bgColors.length];

            return (
              <div key={review.id} className={`${cardBg} rounded-[32px] p-8 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col`}>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#e99ba9] flex items-center justify-center text-white font-pp-neue-corp-compact text-lg font-black uppercase shadow-sm flex-shrink-0">
                      {review.firstName[0]}{review.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-dm-sans font-bold text-ink text-base">
                        {review.firstName} {review.lastName}
                      </h3>
                      <p className="font-dm-sans text-xs text-ink/60">{review.date}</p>
                    </div>
                  </div>
                  
                  {/* Subtle Stars */}
                  <div className="flex items-center gap-0.5 opacity-80">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= review.rating ? "text-citra-orange fill-citra-orange" : "text-citra-orange/30"}
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                </div>

                {/* Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/60 border border-ink/5 text-[11px] font-dm-sans font-bold text-ink shadow-sm">
                    {review.country}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/60 border border-ink/5 text-[11px] font-dm-sans font-bold text-ink shadow-sm">
                    {review.groupSize} pers.
                  </span>
                </div>

                {/* Content */}
                <div className="font-dm-sans text-sm text-ink/80 leading-relaxed whitespace-pre-wrap flex-grow">
                  <p>{review.content}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Load More Button */}
        {visibleCount < reviews.length && (
          <div className="flex justify-center">
            <button 
              onClick={loadMore}
              className="px-8 py-3 rounded-full bg-ink text-white font-dm-sans font-bold text-sm hover:bg-ink/80 transition-all duration-300"
            >
              Voir plus d'avis ({reviews.length - visibleCount} restants)
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Avis;
