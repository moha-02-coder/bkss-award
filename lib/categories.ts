export interface Candidate {
  id: string
  name: string
  image: string
  bio: string
  achievements?: string[]
}

export interface Category {
  id: string
  name: string
  subtitle: string
  candidates: Candidate[]
  special: boolean
  isLeadershipPrize: boolean
  preAssignedWinner?: string
  preAssignedWinnerBio?: string
  preAssignedWinnerImage?: string
  preAssignedWinnerAchievements?: string[]
  preAssignedWinnerTribute?: string
}

export const CATEGORIES: Category[] = [
  {
    id: "trophee-leadership",
    name: "Trophée Leadership",
    subtitle: "Prix hommage – En l'honneur de Kassim",
    candidates: [],
    special: true,
    isLeadershipPrize: true,
    preAssignedWinner: "Kassim Guindo",
    preAssignedWinnerImage: "/kassim-guindo-portrait-leadership.jpg",
    preAssignedWinnerBio:
      "Kassim Guindo, figure emblématique de Bankass, demeure une légende vivante dans le cœur de tous ceux qui l'ont connu. Visionnaire et leader naturel, il a consacré sa vie à l'émancipation de sa communauté, croyant fermement que chaque jeune de Bankass portait en lui les graines de la grandeur. Son parcours, marqué par une détermination sans faille et une générosité infinie, a inspiré des générations entières. Qu'il soit parmi nous ou qu'il veille sur nous depuis les étoiles, son héritage reste immortel.",
    preAssignedWinnerAchievements: [
      "Fondateur du mouvement Winner Boys",
      "Mentor de centaines de jeunes de Bankass",
      "Pionnier du développement communautaire local",
      "Symbole d'espoir et de résilience pour toute une génération",
      "Bâtisseur de ponts entre tradition et modernité",
    ],
    preAssignedWinnerTribute: `
      À toi, Kassim,

      Tu es de ceux dont on ne sait jamais vraiment s'ils sont partis ou s'ils sont simplement passés dans une autre dimension de l'existence. Car comment pourrait-on dire qu'un homme comme toi a disparu, quand chaque rue de Bankass porte encore l'écho de tes pas, quand chaque jeune que tu as guidé continue de porter ta flamme ?

      Tu nous as appris que le leadership n'est pas une question de titre, mais de cœur. Que la vraie richesse se mesure non pas à ce que l'on possède, mais à ce que l'on donne. Tu as été le père que beaucoup n'ont jamais eu, le frère sur qui l'on pouvait compter, l'ami qui ne jugeait jamais.

      Les Winner Boys, cette famille que tu as créée, continue de grandir. Chaque succès que nous célébrons ce soir, chaque prix que nous décernons, porte ton empreinte invisible mais indélébile.

      Si tu es là-haut, sache que nous pensons à toi chaque jour.
      Si tu es quelque part ici-bas, sache que nous te cherchons encore.
      Où que tu sois, sache que tu es aimé, honoré, et jamais oublié.

      Ce trophée porte ton nom. Cette cérémonie célèbre ta mémoire. Cet héritage est le tien.

      Avec tout notre amour et notre gratitude éternelle,
      La famille Bankass Awards et les Winner Boys
    `,
  },
  {
    id: "femme-influente",
    name: "Femme Influente",
    subtitle: "Honorer les femmes qui inspirent le changement",
    candidates: [
      {
        id: "fi-1",
        name: "Aminata Dramane Traoré",
        image: "/african-woman-professional-portrait-elegant.jpg",
        bio: "Ancienne ministre de la Culture du Mali, écrivaine et militante altermondialiste reconnue internationalement pour son engagement envers le développement durable de l'Afrique.",
        achievements: [
          "Auteure de plusieurs ouvrages sur l'Afrique",
          "Conférencière internationale",
          "Défenseure des droits des femmes",
        ],
      },
      {
        id: "fi-2",
        name: "Fatoumata Koné",
        image: "/african-businesswoman-portrait-confident.jpg",
        bio: "Entrepreneuse sociale et fondatrice d'une ONG dédiée à l'éducation des filles dans les zones rurales du Mali.",
        achievements: [
          "10 000+ filles scolarisées",
          "Prix de l'innovation sociale 2024",
          "Mentor pour jeunes entrepreneurs",
        ],
      },
      {
        id: "fi-3",
        name: "Oumou Sangaré",
        image: "/african-woman-artist-portrait-traditional.jpg",
        bio: "Chanteuse et compositrice malienne de renommée mondiale, ambassadrice de la culture malienne et défenseure des droits des femmes.",
        achievements: ["Grammy Award", "Chevalier des Arts et Lettres", "Ambassadrice UNICEF"],
      },
      {
        id: "fi-4",
        name: "Mariam Diallo",
        image: "/african-woman-doctor-portrait-professional.jpg",
        bio: "Médecin et directrice d'hôpital, pionnière dans l'amélioration de l'accès aux soins de santé pour les communautés rurales.",
        achievements: [
          "Création de 5 centres de santé",
          "Formation de 200+ agents de santé",
          "Prix de la santé publique",
        ],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "femme-leader",
    name: "Femme Leader",
    subtitle: "Célébrer le leadership féminin exemplaire",
    candidates: [
      {
        id: "fl-1",
        name: "Aïssata Tall Sall",
        image: "/african-woman-politician-portrait-dignified.jpg",
        bio: "Femme politique et avocate sénégalaise, ancienne maire et ministre, figure emblématique du leadership féminin en Afrique de l'Ouest.",
        achievements: ["Première femme maire de Podor", "Ministre des Affaires étrangères", "Avocate renommée"],
      },
      {
        id: "fl-2",
        name: "Bintou Sanogo",
        image: "/african-woman-executive-portrait-business.jpg",
        bio: "Directrice générale d'une grande entreprise malienne, promotrice de l'inclusion économique des femmes dans le secteur privé.",
        achievements: ["CEO de l'année 2023", "Créatrice de 500+ emplois", "Mentor pour femmes entrepreneures"],
      },
      {
        id: "fl-3",
        name: "Kadiatou Konaré",
        image: "/african-woman-educator-portrait-wisdom.jpg",
        bio: "Éducatrice et militante pour les droits humains, fondatrice d'institutions éducatives innovantes au Mali.",
        achievements: ["Fondatrice de 3 écoles", "Prix UNESCO de l'éducation", "Auteure sur l'éducation en Afrique"],
      },
      {
        id: "fl-4",
        name: "Awa Meïté",
        image: "/african-woman-community-leader-portrait-warm.jpg",
        bio: "Présidente d'association et leader communautaire, œuvrant pour le développement local et l'autonomisation des femmes.",
        achievements: ["15 ans de service communautaire", "1000+ femmes formées", "Médaille du mérite civil"],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "meilleure-artiste",
    name: "Meilleure Artiste de l'Année",
    subtitle: "Récompenser le talent artistique exceptionnel",
    candidates: [
      {
        id: "ma-1",
        name: "Rokia Traoré",
        image: "/african-woman-musician-portrait-artistic.jpg",
        bio: "Chanteuse, guitariste et compositrice malienne, figure majeure de la musique africaine contemporaine, mêlant traditions maliennes et sonorités modernes.",
        achievements: [
          "Victoire de la Musique",
          "Collaboration internationale",
          "Directrice artistique du Festival au Désert",
        ],
      },
      {
        id: "ma-2",
        name: "Aya Nakamura",
        image: "/african-woman-singer-portrait-glamour.jpg",
        bio: "Chanteuse franco-malienne, artiste francophone la plus écoutée au monde, ambassadrice de la pop urbaine française.",
        achievements: ["Album de diamant", "NRJ Music Award", "Artiste francophone #1 mondial"],
      },
      {
        id: "ma-3",
        name: "Fatoumata Diawara",
        image: "/african-woman-artist-portrait-creative.jpg",
        bio: "Chanteuse, auteure-compositrice et actrice malienne, reconnue pour sa fusion unique entre musique traditionnelle et contemporaine.",
        achievements: ["Grammy nomination", "Actrice primée", "Ambassadrice culturelle"],
      },
      {
        id: "ma-4",
        name: "Inna Modja",
        image: "/african-woman-performer-portrait-dynamic.jpg",
        bio: "Chanteuse et mannequin malienne, engagée pour l'environnement et la protection du fleuve Niger à travers son projet 'The Great Green Wall'.",
        achievements: ["Ambassadrice environnementale", "Prix de l'engagement", "Artiste engagée de l'année"],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "meilleure-chanson",
    name: "Meilleure Chanson de l'Année",
    subtitle: "Célébrer les titres qui ont marqué l'année",
    candidates: [
      {
        id: "mc-1",
        name: '"Djadja" - Aya Nakamura',
        image: "/music-album-cover-gold-artistic.jpg",
        bio: "Titre phénomène ayant battu tous les records de streaming, devenu un hymne générationnel et propulsant la musique francophone à l'international.",
        achievements: ["1 milliard de streams", "Disque de diamant", "Chanson de la décennie"],
      },
      {
        id: "mc-2",
        name: '"Kouma" - Fatoumata Diawara',
        image: "/music-album-cover-african-artistic.jpg",
        bio: "Chanson engagée célébrant la paix et l'unité au Mali, mêlant sonorités traditionnelles et production moderne.",
        achievements: ["Prix de la meilleure chanson africaine", "Message de paix", "Clip primé"],
      },
      {
        id: "mc-3",
        name: '"Mali Sadio" - Rokia Traoré',
        image: "/music-album-cover-elegant-traditional.jpg",
        bio: "Hommage poétique à la beauté et à la résilience du Mali, touchant le cœur de millions d'auditeurs.",
        achievements: ["Hymne national officieux", "Prix du patrimoine", "Million de vues"],
      },
      {
        id: "mc-4",
        name: '"Tombouctou" - Inna Modja',
        image: "/placeholder.svg?height=200&width=200",
        bio: "Titre évocateur célébrant l'histoire et le patrimoine de Tombouctou, sensibilisant à la préservation culturelle.",
        achievements: ["Prix UNESCO", "Chanson engagée", "Documentaire associé"],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "meilleure-collaboration",
    name: "Meilleure Collaboration Artistique",
    subtitle: "Honorer les duos et collaborations exceptionnels",
    candidates: [
      {
        id: "mca-1",
        name: "Oumou Sangaré & Fatoumata Diawara",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Rencontre historique entre deux légendes de la musique malienne, fusionnant leurs univers pour un titre inoubliable.",
        achievements: ["Duo de l'année", "Concert sold-out", "Album commun en préparation"],
      },
      {
        id: "mca-2",
        name: "Salif Keïta & Angélique Kidjo",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Collaboration panafricaine entre deux géants de la musique africaine, célébrant l'unité du continent.",
        achievements: ["Grammy nomination", "Tournée mondiale", "Message d'unité africaine"],
      },
      {
        id: "mca-3",
        name: "Amadou & Mariam feat. Manu Chao",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Fusion afro-latino exceptionnelle ayant conquis les scènes internationales et rapproché les cultures.",
        achievements: ["Hit mondial", "Festival headliner", "Prix de la collaboration internationale"],
      },
      {
        id: "mca-4",
        name: "Sidiki Diabaté & Diamond Platnumz",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Collaboration entre le Mali et la Tanzanie, représentant la nouvelle génération de la musique africaine.",
        achievements: ["100 millions de vues", "Hit panafricain", "Nouvelle génération"],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "evenement-annee",
    name: "Événement de l'Année",
    subtitle: "Récompenser les événements marquants",
    candidates: [
      {
        id: "ea-1",
        name: "Festival au Désert de Tombouctou",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Festival mythique réunissant des artistes du monde entier dans le désert malien, symbole de paix et de rencontre culturelle.",
        achievements: ["50 000 visiteurs", "Artistes de 30 pays", "Retombées économiques majeures"],
      },
      {
        id: "ea-2",
        name: "Gala Bankass Awards 2024",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Cérémonie annuelle célébrant l'excellence de Bankass et de sa diaspora, réunissant leaders et personnalités influentes.",
        achievements: ["500 invités", "Couverture médiatique nationale", "10 prix décernés"],
      },
      {
        id: "ea-3",
        name: "Forum Économique de Bamako",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Rencontre internationale des acteurs économiques, favorisant les investissements et partenariats au Mali.",
        achievements: ["200 entreprises", "Accords signés", "Networking panafricain"],
      },
      {
        id: "ea-4",
        name: "Salon de l'Artisanat Malien",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Vitrine du savoir-faire artisanal malien, promouvant les artisans locaux et préservant les traditions.",
        achievements: ["1000 artisans exposants", "Export facilité", "Préservation des traditions"],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "operateur-economique",
    name: "Opérateur Économique de l'Année",
    subtitle: "Honorer les acteurs du développement économique",
    candidates: [
      {
        id: "oe-1",
        name: "Aliou Boubacar Diallo",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Homme d'affaires et entrepreneur, fondateur de plusieurs entreprises créatrices d'emplois au Mali et en Afrique de l'Ouest.",
        achievements: ["5000 emplois créés", "Investissements majeurs", "Prix de l'entrepreneur africain"],
      },
      {
        id: "oe-2",
        name: "Mamadou Sinsy Coulibaly",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Président du patronat malien et chef d'entreprise, promoteur du secteur privé et de l'entrepreneuriat local.",
        achievements: ["Président CNPM", "Réformes économiques", "Mentor d'entrepreneurs"],
      },
      {
        id: "oe-3",
        name: "Hawa Tour",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Femme d'affaires prospère, pionnière dans le secteur du commerce et de la distribution au Mali.",
        achievements: ["Chaîne de distribution nationale", "1000+ emplois", "Modèle pour les femmes entrepreneures"],
      },
      {
        id: "oe-4",
        name: "Seydou Nantoumé",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Industriel et promoteur du 'Made in Mali', développant la production locale et réduisant les importations.",
        achievements: ["Usines de transformation", "Export africain", "Prix de l'industrie"],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "meilleur-dirigeant",
    name: "Meilleur Dirigeant de l'Année",
    subtitle: "Récompenser l'excellence en leadership",
    candidates: [
      {
        id: "md-1",
        name: "Dr. Oumar Tatam Ly",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Ancien Premier ministre et économiste, reconnu pour sa gestion rigoureuse et son engagement pour le développement du Mali.",
        achievements: ["Premier ministre", "Économiste reconnu", "Réformes structurelles"],
      },
      {
        id: "md-2",
        name: "Moussa Mara",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Ancien Premier ministre et entrepreneur politique, promoteur de la bonne gouvernance et de l'engagement citoyen.",
        achievements: ["Plus jeune PM du Mali", "Fondateur de parti", "Auteur politique"],
      },
      {
        id: "md-3",
        name: "Amadou Koïta",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Administrateur et gestionnaire chevronné, ayant dirigé avec succès plusieurs institutions publiques et privées.",
        achievements: ["Direction d'entreprises publiques", "Réformes administratives", "Formation de cadres"],
      },
      {
        id: "md-4",
        name: "Konimba Sidibé",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Économiste et ancien ministre, expert en développement économique et promoteur des politiques publiques innovantes.",
        achievements: ["Ancien ministre", "Expert économique", "Conseiller international"],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
  {
    id: "meilleure-autorite",
    name: "Meilleure Autorité de l'Année",
    subtitle: "Honorer l'excellence dans le service public",
    candidates: [
      {
        id: "mau-1",
        name: "Général Abdoulaye Maïga",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Haut responsable gouvernemental, reconnu pour son leadership dans la gestion des affaires de l'État et la défense de la souveraineté nationale.",
        achievements: ["Porte-parole du gouvernement", "Gestion de crise", "Leadership national"],
      },
      {
        id: "mau-2",
        name: "Colonel Assimi Goïta",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Chef de l'État malien, dirigeant la transition politique et œuvrant pour la stabilité et le développement du pays.",
        achievements: ["Président de transition", "Réformes institutionnelles", "Souveraineté nationale"],
      },
      {
        id: "mau-3",
        name: "Dr. Choguel Kokalla Maïga",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Premier ministre, pilotant les réformes gouvernementales et la mise en œuvre des politiques de développement.",
        achievements: ["Premier ministre", "Dialogue national", "Réformes politiques"],
      },
      {
        id: "mau-4",
        name: "Préfet de Bankass",
        image: "/placeholder.svg?height=200&width=200",
        bio: "Autorité administrative locale, œuvrant pour le développement de la région de Bankass et le bien-être des populations.",
        achievements: ["Administration locale", "Projets de développement", "Service aux citoyens"],
      },
    ],
    special: false,
    isLeadershipPrize: false,
  },
]
