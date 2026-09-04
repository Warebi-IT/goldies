export interface Review {
  id: string;
  firstName: string;
  lastName: string;
  date: string;
  country: string;
  groupSize: number;
  rating: number;
  content: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    firstName: "Aïcha",
    lastName: "D.",
    date: "Mars 2024",
    country: "Maroc",
    groupSize: 12,
    rating: 5,
    content: "Coucou les Goldie's,\n\nJe tenais à te remercier pour ce magnifique voyage. J'ai eu la chance de découvrir le Maroc et toute la richesse de sa culture. Grâce à toi, nous avons aussi pu apporter du bien autour de nous, en allant à la rencontre de populations et d'organismes dans le besoin à travers des activités variées.\n\nCe voyage entre femmes était tout simplement incroyable, rempli de belles rencontres et de moments inoubliables. Merci encore pour tout 🤍"
  },
  {
    id: "2",
    firstName: "Sophie",
    lastName: "M.",
    date: "Janvier 2024",
    country: "Sénégal",
    groupSize: 8,
    rating: 5,
    content: "Une expérience humaine hors du commun. L'organisation était parfaite de A à Z. Le fait de partir uniquement entre femmes crée une vraie sororité et un espace de confiance unique. Les activités solidaires nous ont permis de nous connecter avec les populations locales d'une façon très authentique. Je recommande à 100% !"
  },
  {
    id: "3",
    firstName: "Fatou",
    lastName: "N.",
    date: "Novembre 2023",
    country: "Maroc",
    groupSize: 10,
    rating: 5,
    content: "Je n'avais jamais voyagé en groupe auparavant et j'avais quelques appréhensions, mais Goldies a su me mettre à l'aise tout de suite. Les logements étaient sublimes, les repas délicieux et les activités super bien pensées. Une mention spéciale pour les ateliers d'artisanat avec les femmes locales."
  },
  {
    id: "4",
    firstName: "Léa",
    lastName: "D.",
    date: "Février 2024",
    country: "Sénégal",
    groupSize: 14,
    rating: 5,
    content: "Ce voyage m'a transformée ! Voir l'impact concret de nos actions solidaires sur place m'a beaucoup touchée. L'ambiance dans le groupe était incroyable, on a énormément ri, partagé et appris les unes des autres. C'est bien plus qu'un simple séjour touristique, c'est une aventure humaine."
  }
];
