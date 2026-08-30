import destSenegal from "@/assets/dest-senegal.jpg";
import destMaroc from "@/assets/dest-maroc.jpg";

export const staticTrips = [
  {
    id: "maroc-sept-2026",
    slug: "maroc-sept-2026",
    name: "SÉJOUR AU MAROC",
    destination: "Maroc",
    price: "À partir de",
    dates: "Du 5 au 12 septembre 2026",
    duration: "8 jours",
    spots_left: 12,
    total_spots: 12,
    image_url: destMaroc,
    tag: "Disponible",
    description: "Maroc – Immersion entre désert, montagnes et traditions. Pendant huit jours, partez à la découverte du Maroc autrement. Entre les montagnes de l'Atlas, les villages berbères, Marrakech et les dunes du Sahara, vivez une expérience unique mêlant découvertes culturelles, moments de partage et immersion locale.",
    program: [
      { title: "Découverte de Marrakech", description: "Exploration de la ville rouge." },
      { title: "Vallée de l'Ourika", description: "Nature et paysages à couper le souffle." },
      { title: "Village d'Imlil", description: "Rencontre avec la culture berbère." },
      { title: "Désert du Sahara", description: "Immersion dans les dunes de sable." },
      { title: "Nuit en bivouac", description: "Une nuit inoubliable sous les étoiles." },
      { title: "Balade en dromadaire", description: "Traversée dans le désert." },
      { title: "Rencontres locales", description: "Échanges authentiques avec les habitants." },
      { title: "Activités solidaires", description: "Impact positif sur les communautés." },
      { title: "Gastronomie marocaine", description: "Découverte des saveurs locales." },
      { title: "Moments de convivialité", description: "Partage entre participantes." }
    ],
    includes: [
      "Hébergement",
      "Transport",
      "Activités touristiques",
      "Repas",
      "Accompagnement local"
    ],
    payment_link: null,
    deposit_payment_link: null,
    deposit_amount: null
  },
  {
    id: "senegal-sept-2026",
    slug: "senegal-sept-2026",
    name: "SÉJOUR AU SÉNÉGAL",
    destination: "Sénégal",
    price: "À partir de",
    dates: "Du 18 au 26 septembre 2026",
    duration: "9 jours",
    spots_left: 12,
    total_spots: 12,
    image_url: destSenegal,
    tag: "Disponible",
    description: "Sénégal – Le voyage au cœur de la Teranga. Découvrez le Sénégal à travers une immersion culturelle riche en émotions. Entre Dakar, l'île de Gorée, le Lac Rose, les villages traditionnels et les plages de la Petite Côte, vivez un séjour authentique ponctué de rencontres, d'expériences locales et d'actions solidaires.",
    program: [
      { title: "Découverte de Dakar", description: "Plongée dans l'effervescence de la capitale." },
      { title: "Île de Gorée", description: "Lieu chargé d'histoire et de mémoire." },
      { title: "Lac Rose", description: "Merveille naturelle du Sénégal." },
      { title: "Petite Côte", description: "Détente sur les plages sénégalaises." },
      { title: "Marchés artisanaux", description: "Découverte de l'artisanat local." },
      { title: "Gastronomie sénégalaise", description: "Dégustation des plats traditionnels." },
      { title: "Rencontres avec les populations locales", description: "Échanges chaleureux." },
      { title: "Activités solidaires", description: "Soutien aux projets locaux." },
      { title: "Soirées culturelles", description: "Musique, danse et traditions." },
      { title: "Moments de partage", description: "Création de liens forts entre participantes." }
    ],
    includes: [
      "Hébergement",
      "Transport",
      "Activités touristiques",
      "Repas",
      "Accompagnement local"
    ],
    payment_link: null,
    deposit_payment_link: null,
    deposit_amount: null
  }
];
