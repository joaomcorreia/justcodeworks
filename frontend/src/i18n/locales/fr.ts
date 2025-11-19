import { Dictionary } from "../base-en";

const frenchDictionary: Dictionary = {
  hero: {
    badge: "Tout connecté : site web, impression et IA.",
    title: "Tout ce dont vous avez besoin pour mettre votre entreprise en ligne.",
    subtitle:
      "Lancez un site web moderne, commandez vos supports imprimés, connectez des outils de caisse simples et laissez votre assistant IA faire le travail lourd – tout à partir d'un seul endroit.",
    ctaPrimary: "Commencer en 2 minutes",
    ctaSecondary: "Voir le site de démonstration",
    note:
      "Aucune compétence technique nécessaire. Parfait pour les petites entreprises, les freelances et les boutiques locales.",
    previewDomain: "biscuits-de-grand-mere.justcodeworks.eu",
    previewTitle: "Biscuiterie de Grand-mère",
    previewText:
      "Biscuits frais cuits quotidiennement. Commandez en ligne ou visitez notre boutique chaleureuse.",
    previewWebsiteLabel: "Site web",
    previewWebsiteText: "En ligne en 1–2 jours",
    previewPrintLabel: "Impression",
    previewPrintText: "Cartes et dépliants",
    previewAiLabel: "MagicIA",
    previewAiText: "Textes et images",
    assistantTitle: "Clippy 2.0 est prêt",
    assistantText:
      '"Répondez à quelques questions et je construirai tout pour vous."',
    assistantCta: "Démarrer l'assistant",
  },
  nav: {
    home: "Accueil",
    websites: "Sites web",
    printing: "Impression",
    pos: "Systèmes de caisse",
    services: "Services",
    helpCenter: "Centre d'aide",
    aiTools: "Outils MagicIA",
    pricing: "Tarifs",
    login: "Connexion",
    start: "Commencer à construire",
    templates: "Modèles",
  },
  websites: {
    title: "Des sites web qui travaillent aussi dur que vous",
    subtitle:
      "Choisissez le type de site web qui convient à votre entreprise aujourd'hui – et mettez à niveau plus tard à mesure que vous grandissez.",
    badge: "Constructeur de site web",
    onePage: {
      badge: "Sites web une page",
      title: "Parfait pour les entreprises locales simples",
      desc:
        "Idéal si vous avez quelques services et voulez tout sur une page propre et défilante.",
      bullets: [
        "Jusqu'à 6 services sur une page",
        "Boutons de contact / WhatsApp / appel",
        "Optimisé pour les visiteurs mobiles",
      ],
      priceLabel: "À partir de €X / mois",
      link: "Voir l'exemple",
    },
    multiPage: {
      badge: "Sites web multi-pages",
      title: "Grandissez avec des pages dédiées pour chaque service",
      desc:
        "Idéal pour les entreprises qui veulent des pages séparées pour les services, projets, équipe, blog et plus.",
      bullets: [
        "Pages de services qui peuvent être classées sur Google",
        "Sections blog / actualités pour les mises à jour",
        "Formulaires de contact et de devis structurés",
      ],
      priceLabel: "À partir de €Y / mois",
      link: "Voir l'exemple",
    },
    ecommerce: {
      badge: "Boutiques en ligne",
      title: "Vendez vos produits avec une boutique simple",
      desc:
        "Pour les entreprises prêtes à accepter les paiements en ligne et gérer les commandes sans systèmes complexes.",
      bullets: [
        "Catalogue de produits et catégories",
        "Options de commande et de paiement simples",
        "Notifications de commande et rapports de base",
      ],
      priceLabel: "À partir de €Z / mois",
      link: "Voir l'exemple",
    },
  },
  sections: {
    solutionsTitle: "Choisissez votre solution parfaite",
    printingTitle: "Votre marque, magnifiquement imprimée.",
    printingText:
      "Section temporaire – nous ajouterons plus tard la mise en page complète d'impression de votre ancienne page d'accueil.",
    posTitle: "Systèmes de caisse modernes qui grandissent avec vous.",
    posText: "Contenu temporaire pour les systèmes de caisse.",
    aiTitle: "Outils MagicIA.",
    aiText:
      "Contenu temporaire pour les cartes d'outils IA : rédacteur de contenu, générateur de blog, capture d'écran vers site, etc.",
    pricingTitle: "Aperçu des tarifs.",
    pricingText: "Contenu temporaire – plus tard nous correspondrons à vos vrais tableaux de tarifs.",

    printingCards: [
      {
        label: "Cartes de visite",
        title: "Faites une forte première impression",
        description:
          "Designs classiques ou modernes avec votre logo, couleurs et détails de contact, prêts à distribuer aux nouveaux clients.",
        highlight: "Article de démarrage le plus populaire",
      },
      {
        label: "Dépliants et brochures",
        title: "Promouvez vos services localement",
        description:
          "Parfait pour le porte-à-porte, les boutiques locales et les événements. Idéal pour la construction, la beauté, le coaching et plus.",
        highlight: "Idéal pour le marketing local",
      },
      {
        label: "Autocollants, étiquettes et produits dérivés",
        title: "Mettez votre marque partout",
        description:
          "Marquez vos emballages, cadeaux et produits avec des autocollants, étiquettes et articles de merchandising simples.",
        highlight: "Complément pour les marques en croissance",
      },
    ],

    posCards: [
      {
        label: "Terminaux de carte simples",
        title: "Acceptez les paiements sans tracas",
        description:
          "Connectez un terminal simple qui fonctionne : tap, code PIN, reçu. Aucun système complexe nécessaire.",
        highlight: "Idéal pour les petites boutiques",
      },
      {
        label: "Caisse tablette et téléphone",
        title: "Utilisez les appareils que vous possédez déjà",
        description:
          "Transformez une tablette ou un téléphone en petite caisse pour services, salons, cafés et entreprises mobiles.",
        highlight: "Flexible pour le travail mobile",
      },
      {
        label: "Rapports de base",
        title: "Voyez ce qui se vend",
        description:
          "Obtenez des aperçus simples du chiffre d'affaires, des méthodes de paiement et des jours chargés sans système comptable complet.",
        highlight: "Clair et facile à lire",
      },
    ],

    aiCards: [
      {
        label: "Assistant de rédaction de site web",
        title: "Textes pour vos pages dans votre ton",
        description:
          "Générez des titres, descriptions de services et pages à propos en utilisant les détails de votre entreprise et le style préféré.",
        highlight: "Basé sur vos réponses",
      },
      {
        label: "Générateur de blog et mises à jour",
        title: "Gardez votre site actif",
        description:
          "Créez des articles avec des idées, une structure et des brouillons de textes que vous pouvez rapidement réviser et publier.",
        highlight: "Bon pour Google et les clients",
      },
      {
        label: "Assistant capture d'écran vers mise en page",
        title: "Transformez les idées en mises en page",
        description:
          "Utilisez des captures d'écran d'exemple comme inspiration et transformez-les en mises en page qui correspondent à votre propre marque.",
        highlight: "Économise le temps de conception",
      },
    ],
  },
  footer: {
    tagline: "Sites web • Impression • Caisse • Outils",
    description: "Nous aidons les petites entreprises européennes à se mettre en ligne avec des sites web modernes, des supports imprimés assortis et des outils simples – le tout connecté dans un système.",
    services: {
      title: "Services",
      websites: "Conception de site web",
      pos: "Systèmes de caisse",
      printing: "Conception d'impression",
      consulting: "Conseil en entreprise",
      maintenance: "Maintenance de site web",
      hosting: "Hébergement web"
    },
    company: {
      title: "Entreprise",
      about: "À propos de nous",
      team: "Notre équipe",
      careers: "Carrières",
      news: "Actualités et mises à jour",
      partners: "Partenaires",
      testimonials: "Témoignages"
    },
    tools: {
      title: "Outils",
      jsonReader: "Lecteur JSON",
      qrGenerator: "Générateur QR",
      passwordChecker: "Vérificateur de mot de passe",
      passwordGenerator: "Générateur de mot de passe",
      imageResizer: "Redimensionneur d'image",
      imageCropper: "Recadreur d'image"
    },
    support: {
      title: "Support",
      help: "Centre d'aide",
      contact: "Nous contacter",
      faq: "FAQ",
      documentation: "Documentation",
      tutorials: "Tutoriels vidéo",
      community: "Forum communautaire"
    },
    legal: {
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      cookies: "Politique des cookies",
      gdpr: "Conformité RGPD"
    },
    newsletter: {
      title: "Abonnez-vous à notre newsletter",
      placeholder: "Entrez votre email",
      subscribe: "S'abonner"
    },
    copyright: {
      rights: "Tous droits réservés.",
      made: "Fabriqué avec",
      location: "au Portugal",
      powered: "Propulsé par"
    }
  },
  builder: {
    title: "Constructeur de site web",
    subtitle:
      "Répondez à quelques questions simples et nous préparerons votre site web, impression et configuration de caisse de base pour vous.",
    introBadge: "Étape 1 sur 4",
    introTitle: "Commençons par les bases.",
    introText:
      "Nous vous demanderons votre entreprise, services et couleurs préférées. Vous pouvez toujours tout changer plus tard.",
    startButton: "Démarrer l'assistant",
    backHome: "Retour à la page d'accueil",

    steps: {
      step1Label: "Détails de l'entreprise",
      step2Label: "Services et type de site web",
      step3Label: "Couleurs et style",
      step4Label: "Révision",

      next: "Suivant",
      previous: "Retour",
      finish: "Terminer et réviser",
    },

    fields: {
      businessName: "Nom de l'entreprise",
      country: "Pays",
      city: "Ville",
      contactEmail: "Email de contact",
      contactPhone: "Téléphone / WhatsApp",
      websiteType: "Type de site web",
      onePage: "Site web une page",
      multiPage: "Site web multi-pages",
      store: "Boutique en ligne",
      servicesLabel: "Services principaux",
      servicesHint: "Listez quelques services, séparés par des virgules.",
      colorsLabel: "Couleurs préférées",
      colorsHint: "Par exemple : bleu et blanc, ou vos couleurs de marque existantes.",
      styleLabel: "Style",
      styleHint: "Exemple : moderne et propre, chaleureux et amical, luxe, etc.",
    },

    review: {
      title: "Révisez votre configuration",
      description:
        "Vérifiez si ces détails semblent corrects. À l'étape suivante, nous générerons votre ébauche de site web basée sur ces informations.",
      businessSection: "Détails de l'entreprise",
      servicesSection: "Services et type de site web",
      styleSection: "Couleurs et style",
      changeNote:
        "Vous pouvez encore changer tout cela plus tard dans votre tableau de bord avant publication.",
    },
  },
  pricing: {
    title: "Tarification simple qui grandit avec vous.",
    subtitle:
      "Commencez petit et mettez à niveau plus tard. Tous les plans incluent l'hébergement, les mises à jour de sécurité et le support de base.",
    note: "Les prix réels seront confirmés plus tard – ce sont des substituts.",
    plans: [
      {
        id: "one-page",
        name: "Site web une page",
        short: "Pour les entreprises locales simples",
        price: "À partir de €X / mois",
        bestFor: "Idéal si vous avez quelques services et avez juste besoin d'une page propre et défilante.",
        features: [
          "Jusqu'à 6 services sur une seule page",
          "Boutons de contact / WhatsApp / appel",
          "Design optimisé mobile",
          "Structure SEO de base pour Google",
        ],
        highlight: "Excellente option de démarrage",
      },
      {
        id: "multi-page",
        name: "Site web multi-pages",
        short: "Pour les entreprises en croissance",
        price: "À partir de €Y / mois",
        bestFor:
          "Bon si vous voulez des pages séparées pour les services, projets, équipe, blog et plus.",
        features: [
          "Pages de services qui peuvent être classées sur Google",
          "Section blog ou actualités",
          "Pages portfolio / projets",
          "Plus d'espace pour les photos et explications",
        ],
        highlight: "Choix le plus flexible",
      },
      {
        id: "store",
        name: "Boutique en ligne",
        short: "Pour vendre des produits en ligne",
        price: "À partir de €Z / mois",
        bestFor:
          "Pour les entreprises qui veulent accepter les commandes et paiements directement via le site web.",
        features: [
          "Catalogue de produits et catégories",
          "Options de commande et de paiement simples",
          "Notifications de commande",
          "Aperçu de base des ventes",
        ],
        highlight: "Meilleur si vous vendez des produits",
      },
    ],
  },
  templates: {
    title: "Choisissez un point de départ pour votre site web.",
    subtitle:
      "Choisissez une mise en page qui convient à votre type d'entreprise. Nous adapterons les couleurs, photos et textes à vos détails.",
    badge: "Étape 1 · Choisir un modèle",
    note: "Ce sont des mises en page d'exemple. Vous pouvez tout changer plus tard.",
    list: [
      {
        id: "local-service-01",
        name: "Service local (propre et simple)",
        type: "Mise en page une page",
        bestFor:
          "Idéal pour les bricoleurs, nettoyeurs, coachs, tuteurs, petits services locaux.",
        complexity: "Rapide à lancer",
        highlight: "Recommandé pour les entreprises de services simples.",
      },
      {
        id: "multi-service-01",
        name: "Entreprise multi-services",
        type: "Mise en page multi-pages",
        bestFor:
          "Bon pour la construction, rénovation, salons de beauté et autres entreprises avec plusieurs services.",
        complexity: "Plus d'espace pour le contenu",
        highlight: "Meilleur quand vous avez plusieurs services principaux.",
      },
      {
        id: "store-01",
        name: "Boutique en ligne simple",
        type: "Mise en page boutique",
        bestFor:
          "Pour les petites boutiques qui veulent montrer des produits et accepter des commandes en ligne de base.",
        complexity: "Inclut une grille de produits",
        highlight: "Bon point de départ pour le petit e-commerce.",
      },
    ],
    buttons: {
      useTemplate: "Utiliser ce modèle",
      backHome: "Retour à la page d'accueil",
      goToBuilder: "Continuer vers le constructeur",
    },
  },
  auth: {
    login: {
      title: "Connectez-vous à votre compte Just Code Works",
      subtitle:
        "Accédez à vos sites web, ébauches, commandes d'impression et outils MagicIA depuis votre tableau de bord.",
      emailLabel: "Email",
      passwordLabel: "Mot de passe",
      button: "Connexion",
      noAccount: "Vous n'avez pas encore de compte ?",
      goToRegister: "Créer un compte",
      backHome: "Retour à la page d'accueil",
      note:
        "Ceci est une page de connexion de démonstration. Dans la version complète, cela se connectera au vrai système d'authentification.",
    },
    register: {
      title: "Créez votre compte Just Code Works",
      subtitle:
        "Nous utiliserons ces détails pour connecter vos sites web, commandes d'impression et facturation en un seul endroit.",
      nameLabel: "Nom",
      emailLabel: "Email",
      passwordLabel: "Mot de passe",
      button: "Créer un compte",
      haveAccount: "Vous avez déjà un compte ?",
      goToLogin: "Aller à la connexion",
      backHome: "Retour à la page d'accueil",
      note:
        "Ceci est une page d'inscription de démonstration. Dans la version complète, cela créera un vrai compte pour vous.",
    },
  },
  reviewPage: {
    title: "Résumé de votre configuration",
    subtitle:
      "Voici ce que nous utiliserons pour générer votre ébauche de site web et suggérer des articles d'impression.",
    missingDataTitle: "Aucune donnée trouvée encore",
    missingDataText:
      "Il semble que vous n'ayez pas encore terminé l'assistant constructeur. Veuillez d'abord passer par les étapes.",
    backToBuilder: "Retourner au constructeur",
    backHome: "Retour à la page d'accueil",
    selectedTemplate: "Modèle sélectionné",
    builderDataTitle: "Informations du constructeur",
    businessSection: "Détails de l'entreprise",
    servicesSection: "Services et type de site web",
    styleSection: "Couleurs et style",
    editInBuilder: "Changer dans le constructeur",
  },

  // Page-specific translations
  pages: {
    home: {
      title: "Just Code Works - Accueil",
      subtitle: "Bienvenue sur notre page d'accueil",
      pageInfo: "Informations de la page",
      languageTesting: "Test de langue",
      languageHelp: "Utilisez le sélecteur ci-dessus pour tester différentes versions linguistiques du site.",
      navigation: "Navigation",
      published: "Publié",
      // Admin panel sections
      systemOverview: {
        title: "📊 Aperçu du système",
        template: "Modèle",
        templateName: "jcw-main",
        sections: "Sections",
        sectionsList: "Héro, Fonctionnalités, Services, Solutions, Contact",
        status: "Statut",
        statusActive: "✅ Actif et prêt",
        description: "Just Code Works fournit des solutions d'entreprise complètes qui s'adaptent à vos besoins."
      },
      multiLanguageSupport: {
        title: "🌍 Support multi-langues",
        description: "Notre plateforme supporte 6 langues avec traduction automatique de contenu et routage localisé.",
        languages: "Langues : Anglais, Néerlandais, Portugais, Espagnol, Français, Allemand",
        testInstructions: "Utilisez le sélecteur de langue pour expérimenter la navigation multi-langues transparente."
      }
    },
    posystems: {
      title: "Systèmes de caisse",
      subtitle: "Solutions de point de vente modernes pour votre entreprise",
      features: {
        payment: "Traitement des paiements",
        paymentDesc: "Acceptez les paiements par carte de crédit, débit et sans contact avec des taux compétitifs et un traitement rapide.",
        inventory: "Gestion des stocks",
        inventoryDesc: "Suivez les stocks, définissez des alertes de stock bas et gérez les produits facilement grâce à notre interface intuitive.",
        analytics: "Analyses des ventes",
        analyticsDesc: "Obtenez des insights sur les modèles de vente, les produits les plus vendus et les performances financières avec des rapports détaillés.",
      },
    },
    websites: {
      title: "Sites web",
      subtitle: "Sites web personnalisés et services de développement web",
      features: {
        onePage: "Sites une page",
        onePageDesc: "Parfait pour les petites entreprises et portfolios. Mettez-vous en ligne rapidement avec un design moderne et responsive.",
        multiPage: "Sites web multi-pages",
        multiPageDesc: "Sites web d'entreprise complets avec plusieurs pages, navigation et fonctionnalités personnalisées.",
        ecommerce: "Boutiques en ligne",
        ecommerceDesc: "Sites web e-commerce avec paniers d'achat, traitement des paiements et gestion des stocks.",
      },
    },
    services: {
      title: "Services",
      subtitle: "Tous nos services professionnels",
      features: {
        webDev: "Développement web",
        webDevDesc: "Sites web personnalisés et applications web construites avec des technologies modernes.",
        mobileApps: "Applications mobiles",
        mobileAppsDesc: "Applications mobiles natives et multiplateformes pour iOS et Android.",
        cloud: "Solutions cloud",
        cloudDesc: "Infrastructure cloud évolutive et solutions de déploiement pour vos applications.",
        maintenance: "Maintenance",
        maintenanceDesc: "Support et maintenance continue pour vos solutions numériques existantes.",
      },
    },
    helpCenter: {
      title: "Centre d'aide",
      subtitle: "Obtenez de l'aide et du support",
      features: {
        documentation: "Documentation",
        documentationDesc: "Guides complets et documentation pour tous nos produits et services.",
        support: "Support",
        supportDesc: "Obtenez une aide directe de notre équipe de support technique pour toute question ou problème.",
        faq: "FAQ",
        faqDesc: "Trouvez des réponses aux questions les plus fréquemment posées sur nos services.",
        tutorials: "Tutoriels",
        tutorialsDesc: "Tutoriels étape par étape et guides vidéo pour vous aider à tirer le meilleur parti de notre plateforme.",
        categories: {
          getting: "Guides de démarrage",
          api: "Documentation API",
          practices: "Meilleures pratiques",
          live: "Support de chat en direct",
          email: "Support par email",
          phone: "Support téléphonique",
          billing: "Questions de facturation",
          technical: "Problèmes techniques",
          account: "Gestion de compte",
          video: "Tutoriels vidéo",
          written: "Guides écrits",
          interactive: "Exemples interactifs",
        },
      },
    },
    common: {
      title: "Titre",
      slug: "Identifiant",
      path: "Chemin",
      language: "Langue",
      order: "Ordre",
      project: "Projet",
      template: "Modèle",
      loading: "Chargement..."
    },
  },
  // [ONBOARDING] Step 0 Multi-Intent Onboarding
  onboarding: {
    step0: {
      title: "Commençons",
      subtitle: "Parlez-nous de votre entreprise et de ce que vous aimeriez créer",
      
      progress: {
        intent: "Intention",
        details: "Détails", 
        branding: "Image de marque"
      },
      
      intents: {
        website: {
          title: "Construire un site web",
          description: "Créez un site web professionnel pour votre entreprise"
        },
        prints: {
          title: "Concevoir des impressions",
          description: "Créez des cartes de visite, dépliants et supports marketing"
        },
        pos: {
          title: "Point de vente",
          description: "Configurez le traitement des paiements et la gestion des stocks"
        }
      },
      
      form: {
        businessName: {
          label: "Nom de l'entreprise",
          placeholder: "Entrez le nom de votre entreprise",
          required: "Le nom de l'entreprise est requis"
        },
        businessType: {
          label: "Type d'entreprise",
          placeholder: "ex. Restaurant, Conseil, Magasin de détail"
        },
        primaryCountry: {
          label: "Pays principal",
          placeholder: "Sélectionnez votre pays"
        },
        primaryLanguage: {
          label: "Langue principale",
          placeholder: "Sélectionnez la langue principale"
        },
        primaryGoal: {
          label: "Objectif principal",
          placeholder: "Quel est votre objectif principal ?"
        },
        brandColors: {
          primaryLabel: "Couleur de marque principale",
          secondaryLabel: "Couleur de marque secondaire",
          primaryPlaceholder: "#1D4ED8",
          secondaryPlaceholder: "#6366F1"
        },
        themeMode: {
          label: "Thème préféré",
          light: "Clair",
          dark: "Sombre",
          auto: "Auto"
        },
        notes: {
          label: "Notes supplémentaires",
          placeholder: "Exigences ou préférences spécifiques..."
        }
      },
      
      actions: {
        back: "Retour",
        continue: "Continuer vers l'image de marque",
        continueDetails: "Continuer vers les détails",
        complete: "Terminer la configuration",
        creating: "Création..."
      },
      
      success: {
        title: "Bienvenue chez JustCodeWorks !",
        subtitle: "Votre intégration est terminée. Redirection vers votre tableau de bord...",
        redirecting: "Redirection..."
      },
      
      errors: {
        general: "Quelque chose s'est mal passé. Veuillez réessayer.",
        businessName: "Le nom de l'entreprise ne peut pas être vide",
        invalidColor: "Veuillez entrer une couleur hexadécimale valide (ex. #1D4ED8)",
        submitFailed: "Échec de la sauvegarde des données d'intégration. Veuillez réessayer."
      },
      
      countries: [
        "États-Unis",
        "Royaume-Uni", 
        "Canada",
        "Australie",
        "Allemagne",
        "France",
        "Espagne",
        "Portugal",
        "Brésil",
        "Mexique",
        "Autre"
      ],
      
      languages: {
        en: "Anglais",
        pt: "Português",
        es: "Español", 
        fr: "Français",
        de: "Deutsch"
      },
      
      goals: {
        "get-leads": "Obtenir des prospects / demandes",
        "show-info": "Afficher des informations / menu",
        "sell-online": "Vendre en ligne",
        "take-bookings": "Prendre des réservations",
        "other": "Autre"
      }
    }
  },

  // Website promise section
  websitePromise: {
    items: [
      "Domaine gratuit et hébergement la première année",
      "Serveurs sécurisés basés dans l'UE",
      "Certificat SSL et sauvegardes quotidiennes",
      "Temps de livraison rapide",
      "Options de mise à niveau continues",
    ],
    description: "Tous les sites web sont construits avec notre système intelligent qui rend la création de contenu simple et intuitive — pour que vous puissiez vous concentrer sur votre entreprise, pas sur les outils.",
    exploreTitle: "Explorez nos types de sites web",
  }
};

export default frenchDictionary;
