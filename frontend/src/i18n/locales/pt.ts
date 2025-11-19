import { Dictionary } from "../base-en";

const portugueseDictionary: Dictionary = {
  hero: {
    badge: "Tudo ligado: website, impressão e IA.",
    title: "Tudo o que precisas para levar o teu negócio online.",
    subtitle: "Lança um website moderno, encomenda os teus materiais impressos, conecta ferramentas POS simples e deixa o teu assistente IA fazer o trabalho pesado – tudo num lugar.",
    ctaPrimary: "Começar em 2 minutos",
    ctaSecondary: "Ver site demo",
    note: "Não são necessárias competências técnicas. Perfeito para pequenas empresas, freelancers e lojas locais.",
    previewDomain: "bolachas-vovo.justcodeworks.eu",
    previewTitle: "Loja de Bolachas da Avó",
    previewText: "Bolachas frescas cozidas diariamente. Encomenda online ou visita a nossa loja acolhedora.",
    previewWebsiteLabel: "Website",
    previewWebsiteText: "Online em 1-2 dias",
    previewPrintLabel: "Impressão",
    previewPrintText: "Cartões e folhetos",
    previewAiLabel: "MagicAI",
    previewAiText: "Textos e imagens",
    assistantTitle: "Clippy 2.0 está pronto",
    assistantText: '"Responde a algumas perguntas e construo tudo para ti."',
    assistantCta: "Iniciar assistente",
  },
  nav: {
    home: "Início",
    websites: "Websites",
    printing: "Impressão",
    pos: "Sistemas POS",
    services: "Serviços",
    helpCenter: "Centro de Ajuda",
    aiTools: "Ferramentas MagicAI",
    pricing: "Preços",
    login: "Entrar",
    start: "Começar a construir",
    templates: "Modelos",
  },
  websites: {
    title: "Websites que trabalham tanto quanto tu",
    subtitle: "Escolhe o tipo de website que se adequa ao teu negócio hoje – e atualiza mais tarde enquanto cresces.",
    badge: "Construtor de Websites",
    onePage: {
      badge: "Websites de página única",
      title: "Perfeito para negócios locais simples",
      desc: "Ideal se tens alguns serviços e queres tudo numa página limpa e deslizante.",
      bullets: [
        "Até 6 serviços numa página",
        "Botões de contacto / WhatsApp / chamada",
        "Otimizado para visitantes móveis",
      ],
      priceLabel: "A partir de €X / mês",
      link: "Ver exemplo",
    },
    multiPage: {
      badge: "Websites multi-página",
      title: "Cresce com páginas dedicadas para cada serviço",
      desc: "Ótimo para empresas que querem páginas separadas para serviços, projetos, equipa, blog e mais.",
      bullets: [
        "Páginas de serviços que podem posicionar-se no Google",
        "Secções de blog / notícias para atualizações",
        "Formulários de contacto e orçamento estruturados",
      ],
      priceLabel: "A partir de €Y / mês",
      link: "Ver exemplo",
    },
    ecommerce: {
      badge: "Lojas online",
      title: "Vende os teus produtos com uma loja simples",
      desc: "Para empresas prontas para aceitar pagamentos online e gerir encomendas sem sistemas complexos.",
      bullets: [
        "Catálogo de produtos e categorias",
        "Opções simples de checkout e pagamento",
        "Notificações de encomendas e relatórios básicos",
      ],
      priceLabel: "A partir de €Z / mês",
      link: "Ver exemplo",
    },
  },
  sections: {
    solutionsTitle: "Escolhe a Tua Solução Perfeita",
    printingTitle: "A tua marca, lindamente impressa.",
    printingText: "Secção placeholder – mais tarde adicionaremos o design completo de impressão da tua homepage antiga.",
    posTitle: "Sistemas POS modernos que crescem contigo.",
    posText: "Placeholder para conteúdo de sistemas POS.",
    aiTitle: "Ferramentas MagicAI.",
    aiText: "Placeholder para cartões de ferramentas IA: escritor de conteúdo, gerador de blog, captura-para-site, etc.",
    pricingTitle: "Resumo de preços.",
    pricingText: "Placeholder – mais tarde faremos corresponder às tuas tabelas de preços reais.",
    printingCards: [
      {
        label: "Cartões de visita",
        title: "Causa uma primeira impressão forte",
        description: "Designs clássicos ou modernos com o teu logótipo, cores e detalhes de contacto, prontos para entregar a novos clientes.",
        highlight: "Artigo inicial mais popular",
      },
      {
        label: "Folhetos e brochuras",
        title: "Promove os teus serviços localmente",
        description: "Perfeito para entregas porta-a-porta, lojas locais e eventos. Ótimo para construção, beleza, coaching e mais.",
        highlight: "Ideal para marketing local",
      },
      {
        label: "Autocolantes, etiquetas e merchandising",
        title: "Leva a tua marca por todo o lado",
        description: "Marca as tuas embalagens, presentes e produtos com autocolantes, etiquetas e artigos simples de merchandising.",
        highlight: "Add-on para marcas em crescimento",
      },
    ],
    posCards: [
      {
        label: "Terminais de cartão simples",
        title: "Aceita pagamentos sem dores de cabeça",
        description: "Conecta um terminal simples que funciona: tap, PIN, recibo. Não é necessário sistema complexo.",
        highlight: "Ótimo para lojas pequenas",
      },
      {
        label: "POS tablet e telemóvel",
        title: "Usa os dispositivos que já possuis",
        description: "Transforma um tablet ou telemóvel num POS pequeno para serviços, salões, cafés e negócios pop-up.",
        highlight: "Flexível para trabalho móvel",
      },
      {
        label: "Relatórios básicos",
        title: "Vê o que se está a vender",
        description: "Obtém resumos simples de receitas, métodos de pagamento e dias de pico sem um sistema contabilístico completo.",
        highlight: "Claro e fácil de ler",
      },
      {
        label: "Relatórios de inventário",
        title: "Rastreia facilmente o teu stock",
        description: "Monitoriza níveis de stock, define alertas de stock baixo e gere produtos com a nossa interface intuitiva.",
        highlight: "Simplifica a gestão de inventário",
      },
    ],
    aiCards: [
      {
        label: "Assistente de textos de website",
        title: "Textos para as tuas páginas no teu tom",
        description: "Gera títulos, descrições de serviços e páginas sobre nós usando os detalhes do teu negócio e estilo preferido.",
        highlight: "Baseado nas tuas respostas",
      },
      {
        label: "Gerador de blog e atualizações",
        title: "Mantém o teu site ativo",
        description: "Cria posts com ideias, estrutura e textos de rascunho que podes rever e publicar rapidamente.",
        highlight: "Bom para Google e clientes",
      },
      {
        label: "Assistente captura-para-layout",
        title: "Converte ideias em layouts",
        description: "Usa capturas de ecrã de exemplo como inspiração e converte-as em layouts que se adequam à tua marca.",
        highlight: "Poupa tempo de design",
      },
      {
        label: "Gerador de conteúdo IA",
        title: "Cria automaticamente conteúdo envolvente",
        description: "Gera descrições de produtos, conteúdo de blog e textos de marketing adaptados à voz da tua marca.",
        highlight: "Conteúdo de qualidade em segundos",
      },
    ],
  },
  footer: {
    tagline: "Websites • Impressão • POS • Ferramentas",
    description: "Ajudamos pequenas empresas da UE a ir online com websites modernos, materiais impressos combinados e ferramentas simples – tudo conectado num sistema.",
    services: {
      title: "Serviços",
      websites: "Design de websites",
      pos: "Sistemas POS",
      printing: "Design de impressão",
      consulting: "Consultoria empresarial",
      maintenance: "Manutenção de websites",
      hosting: "Alojamento web"
    },
    company: {
      title: "Empresa",
      about: "Sobre",
      team: "A nossa equipa",
      careers: "Carreiras",
      news: "Notícias e atualizações",
      partners: "Parceiros",
      testimonials: "Testemunhos"
    },
    tools: {
      title: "Ferramentas",
      jsonReader: "Leitor JSON",
      qrGenerator: "Gerador QR",
      passwordChecker: "Verificador de passwords",
      passwordGenerator: "Gerador de passwords",
      imageResizer: "Redimensionador de imagens",
      imageCropper: "Recortador de imagens"
    },
    support: {
      title: "Suporte",
      help: "Centro de ajuda",
      contact: "Contacta-nos",
      faq: "FAQ",
      documentation: "Documentação",
      tutorials: "Tutoriais em vídeo",
      community: "Fórum da comunidade"
    },
    legal: {
      privacy: "Política de Privacidade",
      terms: "Termos de Serviço",
      cookies: "Política de Cookies",
      gdpr: "Conformidade GDPR"
    },
    newsletter: {
      title: "Subscreve a nossa newsletter",
      placeholder: "Insere o teu email",
      subscribe: "Subscrever"
    },
    copyright: {
      rights: "Todos os direitos reservados.",
      made: "Feito com",
      location: "em Portugal",
      powered: "Alimentado por"
    }
  },
  builder: {
    title: "Construtor de websites",
    subtitle: "Responde a algumas perguntas simples e prepararemos o teu website, impressão e configuração POS básica para ti.",
    introBadge: "Passo 1 de 4",
    introTitle: "Vamos começar com o básico.",
    introText: "Perguntaremos sobre o teu negócio, serviços e cores preferidas. Sempre podes mudar tudo depois.",
    startButton: "Iniciar assistente",
    backHome: "Voltar ao início",
    steps: {
      step1Label: "Detalhes do negócio",
      step2Label: "Serviços e tipo de website",
      step3Label: "Cores e estilo",
      step4Label: "Revisão",
      next: "Seguinte",
      previous: "Anterior",
      finish: "Finalizar e rever",
    },
    fields: {
      businessName: "Nome do negócio",
      country: "País",
      city: "Cidade",
      contactEmail: "Email de contacto",
      contactPhone: "Telefone / WhatsApp",
      websiteType: "Tipo de website",
      onePage: "Website de página única",
      multiPage: "Website multi-página",
      store: "Loja online",
      servicesLabel: "Serviços principais",
      servicesHint: "Lista alguns serviços, separados por vírgulas.",
      colorsLabel: "Cores preferidas",
      colorsHint: "Exemplo: azul e branco, ou as cores da tua marca existente.",
      styleLabel: "Estilo",
      styleHint: "Exemplo: moderno e limpo, caloroso e amigável, luxo, etc.",
    },
    review: {
      title: "Revê a tua configuração",
      description: "Verifica se estes detalhes parecem corretos. No próximo passo geraremos o rascunho do teu website baseado nestas informações.",
      businessSection: "Detalhes do negócio",
      servicesSection: "Serviços e tipo de website",
      styleSection: "Cores e estilo",
      changeNote: "Ainda podes mudar tudo isto depois no teu dashboard antes da publicação.",
    },
  },
  pricing: {
    title: "Preços simples que crescem contigo.",
    subtitle: "Começa pequeno e atualiza depois. Todos os planos incluem alojamento, atualizações de segurança e suporte básico.",
    note: "Os preços reais serão confirmados depois – estes são placeholders.",
    plans: [
      {
        id: "one-page",
        name: "Website de página única",
        short: "Para negócios locais simples",
        price: "A partir de €X / mês",
        bestFor: "Ideal se tens alguns serviços e só precisas de uma página limpa e deslizante.",
        features: [
          "Até 6 serviços numa única página",
          "Botões de contacto / WhatsApp / chamada",
          "Design otimizado para móvel",
          "Estrutura SEO básica para Google",
        ],
        highlight: "Ótima escolha inicial",
      },
      {
        id: "multi-page",
        name: "Website multi-página",
        short: "Para negócios em crescimento",
        price: "A partir de €Y / mês",
        bestFor: "Bom se queres páginas separadas para serviços, projetos, equipa, blog e mais.",
        features: [
          "Páginas de serviços que podem posicionar-se no Google",
          "Secção de blog ou notícias",
          "Páginas de portfólio / projetos",
          "Mais espaço para fotos e explicações",
        ],
        highlight: "Opção mais flexível",
      },
      {
        id: "store",
        name: "Loja online",
        short: "Para vender produtos online",
        price: "A partir de €Z / mês",
        bestFor: "Para negócios que querem aceitar encomendas e pagamentos diretamente através do website.",
        features: [
          "Catálogo de produtos e categorias",
          "Opções simples de checkout e pagamento",
          "Notificações de encomendas",
          "Resumo básico de vendas",
        ],
        highlight: "Melhor se vendes produtos",
      },
    ],
  },
  templates: {
    title: "Escolhe um ponto de partida para o teu website.",
    subtitle: "Escolhe um layout que se adequa ao teu tipo de negócio. Adaptaremos cores, fotos e textos aos teus detalhes.",
    badge: "Passo 1 · Escolher modelo",
    note: "Estes são layouts de exemplo. Podes mudar tudo depois.",
    list: [
      {
        id: "local-service-01",
        name: "Serviço local (limpo e simples)",
        type: "Layout de página única",
        bestFor: "Ideal para trabalhadores freelance, limpadores, coaches, tutores, pequenos serviços locais.",
        complexity: "Rápido de lançar",
        highlight: "Recomendado para negócios de serviços simples.",
      },
      {
        id: "multi-service-01",
        name: "Empresa multi-serviços",
        type: "Layout multi-página",
        bestFor: "Bom para construção, renovações, salões de beleza e outros negócios com múltiplos serviços.",
        complexity: "Mais espaço para conteúdo",
        highlight: "Melhor quando tens múltiplos serviços principais.",
      },
      {
        id: "store-01",
        name: "Loja online simples",
        type: "Layout de loja",
        bestFor: "Para lojas pequenas que querem mostrar produtos e aceitar encomendas online básicas.",
        complexity: "Inclui grelha de produtos",
        highlight: "Bom ponto de partida para pequeno e-commerce.",
      },
    ],
    buttons: {
      useTemplate: "Usar este modelo",
      backHome: "Voltar ao início",
      goToBuilder: "Continuar para o construtor",
    },
  },
  auth: {
    login: {
      title: "Entra na tua conta Just Code Works",
      subtitle: "Acede aos teus websites, rascunhos, encomendas de impressão e ferramentas MagicAI a partir do teu dashboard.",
      emailLabel: "Email",
      passwordLabel: "Password",
      button: "Entrar",
      noAccount: "Ainda não tens uma conta?",
      goToRegister: "Criar uma conta",
      backHome: "Voltar ao início",
      note: "Esta é uma página de login demo. Na versão completa, conectar-se-á ao sistema de autenticação real.",
    },
    register: {
      title: "Cria a tua conta Just Code Works",
      subtitle: "Usaremos estes detalhes para conectar os teus websites, encomendas de impressão e faturação num lugar.",
      nameLabel: "Nome",
      emailLabel: "Email",
      passwordLabel: "Password",
      button: "Criar Conta",
      haveAccount: "Já tens uma conta?",
      goToLogin: "Ir para o login",
      backHome: "Voltar ao início",
      note: "Esta é uma página de registo demo. Na versão completa, criará uma conta real para ti.",
    },
  },
  reviewPage: {
    title: "Resumo da tua configuração",
    subtitle: "Isto é o que usaremos para gerar o rascunho do teu website e sugerir artigos de impressão.",
    missingDataTitle: "Dados ainda não encontrados",
    missingDataText: "Parece que ainda não completaste o assistente do construtor. Por favor, passa primeiro pelos passos.",
    backToBuilder: "Voltar ao construtor",
    backHome: "Voltar ao início",
    selectedTemplate: "Modelo selecionado",
    builderDataTitle: "Informações do construtor",
    businessSection: "Detalhes do negócio",
    servicesSection: "Serviços e tipo de website",
    styleSection: "Cores e estilo",
    editInBuilder: "Mudar no construtor",
  },
  pages: {
    home: {
      title: "Just Code Works - Início",
      subtitle: "Bem-vindo à nossa página principal",
      pageInfo: "Informações da página",
      languageTesting: "Teste de idiomas",
      languageHelp: "Usa o seletor acima para testar diferentes versões de idioma do site.",
      navigation: "Navegação",
      published: "Publicado",
      systemOverview: {
        title: "📊 Visão geral do sistema",
        template: "Modelo",
        templateName: "jcw-main",
        sections: "Secções",
        sectionsList: "Hero, Funcionalidades, Serviços, Soluções, Contacto",
        status: "Estado",
        statusActive: "✅ Ativo e pronto",
        description: "Just Code Works fornece soluções empresariais completas que se adaptam às tuas necessidades."
      },
      multiLanguageSupport: {
        title: "🌍 Suporte multi-idioma",
        description: "A nossa plataforma suporta 6 idiomas com tradução automática de conteúdo e encaminhamento localizado.",
        languages: "Idiomas: Inglês, Holandês, Português, Espanhol, Francês, Alemão",
        testInstructions: "Usa o seletor de idioma para experimentar navegação multi-idioma sem problemas."
      }
    },
    posystems: {
      title: "Sistemas POS",
      subtitle: "Soluções point-of-sale modernas para o teu negócio",
      features: {
        payment: "Processamento de pagamentos",
        paymentDesc: "Aceita pagamentos com cartões de crédito, débito e contactless com tarifas competitivas e processamento rápido.",
        inventory: "Gestão de inventário",
        inventoryDesc: "Rastreia stock, define alertas de stock baixo e gere produtos facilmente através da nossa interface intuitiva.",
        analytics: "Análises de vendas",
        analyticsDesc: "Obtém insights sobre padrões de vendas, produtos mais vendidos e desempenho financeiro com relatórios detalhados.",
      },
    },
    websites: {
      title: "Websites",
      subtitle: "Websites personalizados e serviços de desenvolvimento web",
      features: {
        onePage: "Sites de página única",
        onePageDesc: "Perfeito para pequenos negócios e portfólios. Vai online rapidamente com um design moderno e responsivo.",
        multiPage: "Websites multi-página",
        multiPageDesc: "Websites empresariais completos com páginas múltiplas, navegação e funcionalidades personalizadas.",
        ecommerce: "Lojas online",
        ecommerceDesc: "Websites de e-commerce com carrinhos, processamento de pagamentos e gestão de inventário.",
      },
    },
    services: {
      title: "Serviços",
      subtitle: "Todos os nossos serviços profissionais",
      features: {
        webDev: "Desenvolvimento web",
        webDevDesc: "Websites personalizados e aplicações web construídas com tecnologias modernas.",
        mobileApps: "Apps móveis",
        mobileAppsDesc: "Aplicações móveis nativas e cross-platform para iOS e Android.",
        cloud: "Soluções de nuvem",
        cloudDesc: "Infraestrutura de nuvem escalável e soluções de implementação para as tuas aplicações.",
        maintenance: "Manutenção",
        maintenanceDesc: "Suporte contínuo e manutenção para as tuas soluções digitais existentes.",
      },
    },
    helpCenter: {
      title: "Centro de Ajuda",
      subtitle: "Obtém ajuda e suporte",
      features: {
        documentation: "Documentação",
        documentationDesc: "Guias completos e documentação para todos os nossos produtos e serviços.",
        support: "Suporte",
        supportDesc: "Obtém ajuda direta da nossa equipa de suporte técnico para qualquer pergunta ou problema.",
        faq: "FAQ",
        faqDesc: "Encontra respostas para perguntas frequentes sobre os nossos serviços.",
        tutorials: "Tutoriais",
        tutorialsDesc: "Tutoriais passo-a-passo e guias em vídeo para te ajudar a tirar o máximo proveito da nossa plataforma.",
        categories: {
          getting: "Guias de início",
          api: "Documentação API",
          practices: "Melhores práticas",
          live: "Suporte de chat ao vivo",
          email: "Suporte por email",
          phone: "Suporte telefónico",
          billing: "Perguntas de faturação",
          technical: "Problemas técnicos",
          account: "Gestão de conta",
          video: "Tutoriais em vídeo",
          written: "Guias escritos",
          interactive: "Exemplos interativos",
        },
      },
    },
    common: {
      title: "Título",
      slug: "Slug",
      path: "Caminho",
      language: "Idioma",
      order: "Ordem",
      project: "Projeto",
      template: "Modelo",
      loading: "Carregando..."
    },
  },
  onboarding: {
    step0: {
      title: "Vamos começar",
      subtitle: "Conta-nos sobre o teu negócio e o que gostarias de criar",
      progress: {
        intent: "Intenção",
        details: "Detalhes", 
        branding: "Marca"
      },
      intents: {
        website: {
          title: "Construir um website",
          description: "Criar um website profissional para o teu negócio"
        },
        prints: {
          title: "Desenhar impressões",
          description: "Criar cartões de visita, folhetos e materiais de marketing"
        },
        pos: {
          title: "Point of Sale",
          description: "Configurar processamento de pagamentos e gestão de inventário"
        }
      },
      form: {
        businessName: {
          label: "Nome do negócio",
          placeholder: "Insere o nome do teu negócio",
          required: "O nome do negócio é obrigatório"
        },
        businessType: {
          label: "Tipo de negócio",
          placeholder: "ex. Restaurante, Consultoria, Loja de retalho"
        },
        primaryCountry: {
          label: "País principal",
          placeholder: "Seleciona o teu país"
        },
        primaryLanguage: {
          label: "Idioma principal",
          placeholder: "Seleciona idioma principal"
        },
        primaryGoal: {
          label: "Objetivo principal",
          placeholder: "Qual é o teu objetivo principal?"
        },
        brandColors: {
          primaryLabel: "Cor principal da marca",
          secondaryLabel: "Cor secundária da marca",
          primaryPlaceholder: "#1D4ED8",
          secondaryPlaceholder: "#6366F1"
        },
        themeMode: {
          label: "Tema preferido",
          light: "Claro",
          dark: "Escuro",
          auto: "Auto"
        },
        notes: {
          label: "Notas adicionais",
          placeholder: "Quaisquer requisitos específicos ou preferências..."
        }
      },
      actions: {
        back: "Voltar",
        continue: "Continuar para marca",
        continueDetails: "Continuar para detalhes",
        complete: "Completar configuração",
        creating: "A criar..."
      },
      success: {
        title: "Bem-vindo ao JustCodeWorks!",
        subtitle: "O teu onboarding está completo. A redirecionar para o teu dashboard...",
        redirecting: "A redirecionar..."
      },
      errors: {
        general: "Algo correu mal. Tenta novamente.",
        businessName: "O nome do negócio não pode estar vazio",
        invalidColor: "Por favor insere uma cor hex válida (ex. #1D4ED8)",
        submitFailed: "Erro ao guardar dados de onboarding. Tenta novamente."
      },
      countries: [
        "Estados Unidos",
        "Reino Unido", 
        "Canadá",
        "Austrália",
        "Alemanha",
        "França",
        "Espanha",
        "Portugal",
        "Brasil",
        "México",
        "Outro"
      ],
      languages: {
        en: "English",
        pt: "Português",
        es: "Español", 
        fr: "Français",
        de: "Deutsch"
      },
      goals: {
        "get-leads": "Obter leads / consultas",
        "show-info": "Mostrar info / menu",
        "sell-online": "Vender online",
        "take-bookings": "Aceitar reservas",
        "other": "Outro"
      }
    }
  },
  websitePromise: {
    items: [
      "Domínio gratuito e alojamento primeiro ano",
      "Servidores seguros baseados na UE",
      "Certificado SSL e backups diários",
      "Tempos de entrega rápidos",
      "Opções de upgrade contínuo",
    ],
    description: "Todos os websites são construídos com o nosso sistema inteligente que torna a criação de conteúdo simples e intuitiva — para que te possas focar no teu negócio, não nas ferramentas.",
    exploreTitle: "Explora os Nossos Tipos de Websites",
  }
};

export default portugueseDictionary;
