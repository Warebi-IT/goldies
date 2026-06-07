import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveAfricaMap from "@/components/InteractiveAfricaMap";

const reviews = [
  {
    id: "1",
    firstName: "Aïcha",
    lastName: "D.",
    date: "Mars 2024",
    country: "Maroc",
    groupSize: 12,
    content: "Coucou les Goldie's,\n\nJe tenais à te remercier pour ce magnifique voyage. J'ai eu la chance de découvrir le Maroc et toute la richesse de sa culture. Grâce à toi, nous avons aussi pu apporter du bien autour de nous, en allant à la rencontre de populations et d'organismes dans le besoin à travers des activités variées.\n\nCe voyage entre femmes était tout simplement incroyable, rempli de belles rencontres et de moments inoubliables. Merci encore pour tout 🤍",
  },
  {
    id: "2",
    firstName: "Sophie",
    lastName: "M.",
    date: "Janvier 2024",
    country: "Sénégal",
    groupSize: 8,
    content: "Une expérience humaine hors du commun. L'organisation était parfaite de A à Z. Le fait de partir uniquement entre femmes crée une vraie sororité et un espace de confiance unique. Les activités solidaires nous ont permis de nous connecter avec les populations locales d'une façon très authentique. Je recommande à 100% !",
  },
  {
    id: "3",
    firstName: "Fatou",
    lastName: "N.",
    date: "Novembre 2023",
    country: "Maroc",
    groupSize: 10,
    content: "Je n'avais jamais voyagé en groupe auparavant et j'avais quelques appréhensions, mais Goldies a su me mettre à l'aise tout de suite. Les logements étaient sublimes, les repas délicieux et les activités super bien pensées. Une mention spéciale pour les ateliers d'artisanat avec les femmes locales.",
  },
  {
    id: "4",
    firstName: "Léa",
    lastName: "D.",
    date: "Février 2024",
    country: "Sénégal",
    groupSize: 14,
    content: "Ce voyage m'a transformée ! Voir l'impact concret de nos actions solidaires sur place m'a beaucoup touchée. L'ambiance dans le groupe était incroyable, on a énormément ri, partagé et appris les unes des autres. C'est bien plus qu'un simple séjour touristique, c'est une aventure humaine.",
  }
];

const Avis = () => {
  return (
    <div className="min-h-screen bg-white relative z-0">
      <Navbar />

      {/* Background Map */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-20">
        <InteractiveAfricaMap variant="vivid" />
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
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, idx) => {
            const bgColors = ["bg-pastel-sand", "bg-pastel-sage", "bg-pastel-rose", "bg-pastel-peach", "bg-pastel-lime"];
            const cardBg = bgColors[idx % bgColors.length];

            return (
              <div key={review.id} className={`${cardBg} rounded-[32px] p-8 md:p-10 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col`}>
                
                <div className="flex items-center gap-4 mb-8">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#e99ba9] flex items-center justify-center text-white font-pp-neue-corp-compact text-xl font-black uppercase shadow-sm flex-shrink-0">
                  {review.firstName[0]}{review.lastName[0]}
                </div>
                <div>
                  <h3 className="font-dm-sans font-bold text-ink text-lg">
                    {review.firstName} {review.lastName}
                  </h3>
                </div>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-white/80 border border-ink/5 text-xs font-dm-sans font-bold text-ink shadow-sm">
                  {review.date}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-citra-orange/10 border border-citra-orange/20 text-xs font-dm-sans font-bold text-citra-orange shadow-sm">
                  {review.country}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/80 border border-ink/5 text-xs font-dm-sans font-bold text-ink shadow-sm">
                  {review.groupSize} pers.
                </span>
              </div>

              {/* Content */}
              <div className="font-dm-sans text-ink/80 leading-relaxed whitespace-pre-wrap flex-grow">
                <p>{review.content}</p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Avis;
