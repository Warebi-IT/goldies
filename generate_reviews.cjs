const fs = require('fs');

const firstNames = [
  "Aïcha", "Sophie", "Fatou", "Léa", "Aminata", "Khadija", "Mariam", "Chloe", "Sarah", 
  "Inès", "Hawa", "Ndeye", "Camille", "Emma", "Julie", "Binta", "Salimata", "Marie", "Maimouna"
];
const lastNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const countries = ["Maroc", "Sénégal"];
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const years = [2023, 2024];

const contents = [
  "Un voyage inoubliable ! L'organisation était au top et j'ai rencontré des femmes extraordinaires. Je recommande à 100%.",
  "Une expérience humaine hors du commun. Le fait de partir uniquement entre femmes crée une vraie sororité.",
  "Je n'avais jamais voyagé en groupe auparavant et j'avais quelques appréhensions, mais Goldies a su me mettre à l'aise tout de suite.",
  "Ce voyage m'a transformée ! Voir l'impact concret de nos actions solidaires sur place m'a beaucoup touchée.",
  "Des logements magnifiques, des repas délicieux, et une ambiance incroyable. Merci pour tout !",
  "Tout était parfait, de l'accueil à l'aéroport jusqu'au dernier jour. J'ai adoré les ateliers locaux.",
  "Une belle découverte culturelle et humaine. Le concept 100% féminin est rassurant et très bienveillant.",
  "Je repars des souvenirs plein la tête. Merci à toute l'équipe pour cette organisation sans faille.",
  "Les actions humanitaires m'ont bouleversée. C'est magnifique de lier voyage et entraide.",
  "Super ambiance de groupe, on a énormément ri ! Hâte de repartir pour une prochaine destination.",
  "Un séjour magique. Les guides locaux étaient passionnants et l'hébergement de grande qualité.",
  "Merci d'avoir rendu ce voyage possible. C'était une parenthèse de bonheur total.",
  "Je recommande vivement Goldies. Tout est pensé pour qu'on se sente bien et en sécurité."
];

const reviews = [
  // Keep the original 4 at the top
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
    rating: 4,
    content: "Ce voyage m'a transformée ! Voir l'impact concret de nos actions solidaires sur place m'a beaucoup touchée. L'ambiance dans le groupe était incroyable, on a énormément ri, partagé et appris les unes des autres. C'est bien plus qu'un simple séjour touristique, c'est une aventure humaine."
  }
];

// Generate 198 more to make 202
for (let i = 5; i <= 202; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)] + ".";
  const date = months[Math.floor(Math.random() * months.length)] + " " + years[Math.floor(Math.random() * years.length)];
  const country = countries[Math.floor(Math.random() * countries.length)];
  const groupSize = Math.floor(Math.random() * 10) + 6; // 6 to 15
  // Random rating: mostly 5, some 4s
  const rating = Math.random() > 0.15 ? 5 : 4; 
  const content = contents[Math.floor(Math.random() * contents.length)];

  reviews.push({
    id: i.toString(),
    firstName,
    lastName,
    date,
    country,
    groupSize,
    rating,
    content
  });
}

// Make sure directory exists
if (!fs.existsSync('src/data')) {
  fs.mkdirSync('src/data');
}

fs.writeFileSync('src/data/reviews.ts', `export const reviews = ${JSON.stringify(reviews, null, 2)};\n`);
console.log("Generated src/data/reviews.ts");
