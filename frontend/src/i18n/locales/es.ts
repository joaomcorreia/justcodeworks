import { Dictionary } from "../base-en";

const spanishDictionary: Dictionary = {
  hero: {
    badge: "Todo conectado: sitio web, impresión e IA.",
    title: "Todo lo que necesitas para llevar tu negocio online.",
    subtitle: "Lanza un sitio web moderno, ordena tus materiales de impresión, conecta herramientas POS simples y deja que tu asistente de IA haga el trabajo pesado – todo desde un lugar.",
    ctaPrimary: "Empezar en 2 minutos",
    ctaSecondary: "Ver sitio demo",
    note: "No se necesitan habilidades técnicas. Perfecto para pequeñas empresas, freelancers y tiendas locales.",
    previewDomain: "galletas-abuela.justcodeworks.eu",
    previewTitle: "Tienda de Galletas de la Abuela",
    previewText: "Galletas frescas horneadas diariamente. Ordena online o visita nuestra acogedora tienda.",
    previewWebsiteLabel: "Sitio Web",
    previewWebsiteText: "Online en 1–2 días",
    previewPrintLabel: "Impresión",
    previewPrintText: "Tarjetas y folletos",
    previewAiLabel: "MagicAI",
    previewAiText: "Textos e imágenes",
    assistantTitle: "Clippy 2.0 está listo",
    assistantText: '"Responde algunas preguntas y construiré todo para ti."',
    assistantCta: "Iniciar asistente",
  },
  nav: {
    home: "Inicio",
    websites: "Sitios Web",
    printing: "Impresión",
    pos: "Sistemas POS",
    services: "Servicios",
    helpCenter: "Centro de Ayuda",
    aiTools: "Herramientas MagicAI",
    pricing: "Precios",
    login: "Iniciar Sesión",
    start: "Empezar a construir",
    templates: "Plantillas",
  },
  websites: {
    title: "Sitios web que trabajan tan duro como tú",
    subtitle: "Elige el tipo de sitio web que se adapte a tu negocio hoy – y actualiza más tarde mientras creces.",
    badge: "Constructor de Sitios Web",
    onePage: {
      badge: "Sitios web de una página",
      title: "Perfecto para empresas locales simples",
      desc: "Ideal si tienes algunos servicios y quieres todo en una página limpia y desplazable.",
      bullets: [
        "Hasta 6 servicios en una página",
        "Botones de contacto / WhatsApp / llamada",
        "Optimizado para visitantes móviles",
      ],
      priceLabel: "Desde €X / mes",
      link: "Ver ejemplo",
    },
    multiPage: {
      badge: "Sitios web multi-página",
      title: "Crece con páginas dedicadas para cada servicio",
      desc: "Genial para empresas que quieren páginas separadas para servicios, proyectos, equipo, blog y más.",
      bullets: [
        "Páginas de servicios que pueden posicionarse en Google",
        "Secciones de blog / noticias para actualizaciones",
        "Formularios de contacto y cotización estructurados",
      ],
      priceLabel: "Desde €Y / mes",
      link: "Ver ejemplo",
    },
    ecommerce: {
      badge: "Tiendas online",
      title: "Vende tus productos con una tienda simple",
      desc: "Para empresas listas para aceptar pagos online y gestionar pedidos sin sistemas complejos.",
      bullets: [
        "Catálogo de productos y categorías",
        "Opciones simples de checkout y pago",
        "Notificaciones de pedidos y reportes básicos",
      ],
      priceLabel: "Desde €Z / mes",
      link: "Ver ejemplo",
    },
  },
  sections: {
    solutionsTitle: "Elige Tu Solución Perfecta",
    printingTitle: "Tu marca, bellamente impresa.",
    printingText: "Sección placeholder – más tarde agregaremos el diseño completo de impresión de tu antigua homepage.",
    posTitle: "Sistemas POS modernos que crecen contigo.",
    posText: "Placeholder para contenido de sistemas POS.",
    aiTitle: "Herramientas MagicAI.",
    aiText: "Placeholder para tarjetas de herramientas IA: escritor de contenido, generador de blog, captura-a-sitio, etc.",
    pricingTitle: "Resumen de precios.",
    pricingText: "Placeholder – más tarde coincidiremos con tus tablas de precios reales.",
    printingCards: [
      {
        label: "Tarjetas de visita",
        title: "Causa una primera impresión fuerte",
        description: "Diseños clásicos o modernos con tu logo, colores y detalles de contacto, listos para entregar a nuevos clientes.",
        highlight: "Artículo inicial más popular",
      },
      {
        label: "Folletos y brochures",
        title: "Promociona tus servicios localmente",
        description: "Perfecto para entregas puerta a puerta, tiendas locales y eventos. Genial para construcción, belleza, coaching y más.",
        highlight: "Ideal para marketing local",
      },
      {
        label: "Pegatinas, etiquetas y merchandising",
        title: "Lleva tu marca a todas partes",
        description: "Marca tus empaques, regalos y productos con pegatinas, etiquetas y artículos simples de merchandising.",
        highlight: "Add-on para marcas en crecimiento",
      },
    ],
    posCards: [
      {
        label: "Terminales de tarjeta simples",
        title: "Acepta pagos sin dolores de cabeza",
        description: "Conecta un terminal simple que funciona: tap, PIN, recibo. No se necesita sistema complejo.",
        highlight: "Genial para tiendas pequeñas",
      },
      {
        label: "POS tablet y teléfono",
        title: "Usa los dispositivos que ya posees",
        description: "Convierte un tablet o teléfono en un POS pequeño para servicios, salones, cafés y negocios pop-up.",
        highlight: "Flexible para trabajo móvil",
      },
      {
        label: "Reportes básicos",
        title: "Ve qué se está vendiendo",
        description: "Obtén resúmenes simples de ingresos, métodos de pago y días pico sin un sistema contable completo.",
        highlight: "Claro y fácil de leer",
      },
      {
        label: "Reportes de inventario",
        title: "Rastrea fácilmente tu stock",
        description: "Monitorea niveles de stock, establece alertas de stock bajo y gestiona productos con nuestra interfaz intuitiva.",
        highlight: "Simplifica la gestión de inventario",
      },
    ],
    aiCards: [
      {
        label: "Asistente de textos de sitio web",
        title: "Textos para tus páginas en tu tono",
        description: "Genera títulos, descripciones de servicios y páginas sobre nosotros usando los detalles de tu negocio y estilo preferido.",
        highlight: "Basado en tus respuestas",
      },
      {
        label: "Generador de blog y actualizaciones",
        title: "Mantén activo tu sitio",
        description: "Crea posts con ideas, estructura y textos borrador que puedes revisar y publicar rápidamente.",
        highlight: "Bueno para Google y clientes",
      },
      {
        label: "Ayudante captura-a-layout",
        title: "Convierte ideas en layouts",
        description: "Usa capturas de pantalla de ejemplo como inspiración y conviértelas en layouts que se adapten a tu marca.",
        highlight: "Ahorra tiempo de diseño",
      },
      {
        label: "Generador de contenido IA",
        title: "Crea automáticamente contenido atractivo",
        description: "Genera descripciones de productos, contenido de blog y textos de marketing adaptados a la voz de tu marca.",
        highlight: "Contenido de calidad en segundos",
      },
    ],
  },
  footer: {
    tagline: "Sitios web • Impresión • POS • Herramientas",
    description: "Ayudamos a pequeñas empresas de la UE a ir online con sitios web modernos, materiales de impresión a juego y herramientas simples – todo conectado en un sistema.",
    services: {
      title: "Servicios",
      websites: "Diseño de sitios web",
      pos: "Sistemas POS",
      printing: "Diseño de impresión",
      consulting: "Consultoría empresarial",
      maintenance: "Mantenimiento de sitios web",
      hosting: "Alojamiento web"
    },
    company: {
      title: "Empresa",
      about: "Acerca de",
      team: "Nuestro equipo",
      careers: "Carreras",
      news: "Noticias y actualizaciones",
      partners: "Socios",
      testimonials: "Testimonios"
    },
    tools: {
      title: "Herramientas",
      jsonReader: "Lector JSON",
      qrGenerator: "Generador QR",
      passwordChecker: "Verificador de contraseñas",
      passwordGenerator: "Generador de contraseñas",
      imageResizer: "Redimensionador de imágenes",
      imageCropper: "Recortador de imágenes"
    },
    support: {
      title: "Soporte",
      help: "Centro de ayuda",
      contact: "Contáctanos",
      faq: "FAQ",
      documentation: "Documentación",
      tutorials: "Tutoriales en video",
      community: "Foro comunitario"
    },
    legal: {
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      cookies: "Política de Cookies",
      gdpr: "Cumplimiento GDPR"
    },
    newsletter: {
      title: "Suscríbete a nuestro boletín",
      placeholder: "Ingresa tu email",
      subscribe: "Suscribirse"
    },
    copyright: {
      rights: "Todos los derechos reservados.",
      made: "Hecho con",
      location: "en Portugal",
      powered: "Impulsado por"
    }
  },
  builder: {
    title: "Constructor de sitios web",
    subtitle: "Responde algunas preguntas simples y prepararemos tu sitio web, impresión y configuración POS básica para ti.",
    introBadge: "Paso 1 de 4",
    introTitle: "Empecemos con lo básico.",
    introText: "Te preguntaremos sobre tu negocio, servicios y colores preferidos. Siempre puedes cambiar todo después.",
    startButton: "Iniciar asistente",
    backHome: "Volver al inicio",
    steps: {
      step1Label: "Detalles del negocio",
      step2Label: "Servicios y tipo de sitio web",
      step3Label: "Colores y estilo",
      step4Label: "Revisión",
      next: "Siguiente",
      previous: "Anterior",
      finish: "Finalizar y revisar",
    },
    fields: {
      businessName: "Nombre del negocio",
      country: "País",
      city: "Ciudad",
      contactEmail: "Email de contacto",
      contactPhone: "Teléfono / WhatsApp",
      websiteType: "Tipo de sitio web",
      onePage: "Sitio web de una página",
      multiPage: "Sitio web multi-página",
      store: "Tienda online",
      servicesLabel: "Servicios principales",
      servicesHint: "Lista algunos servicios, separados por comas.",
      colorsLabel: "Colores preferidos",
      colorsHint: "Por ejemplo: azul y blanco, o tus colores de marca existentes.",
      styleLabel: "Estilo",
      styleHint: "Ejemplo: moderno y limpio, cálido y amigable, lujo, etc.",
    },
    review: {
      title: "Revisa tu configuración",
      description: "Verifica si estos detalles se ven correctos. En el siguiente paso generaremos el borrador de tu sitio web basado en esta información.",
      businessSection: "Detalles del negocio",
      servicesSection: "Servicios y tipo de sitio web",
      styleSection: "Colores y estilo",
      changeNote: "Aún puedes cambiar todo esto después en tu dashboard antes de la publicación.",
    },
  },
  pricing: {
    title: "Precios simples que crecen contigo.",
    subtitle: "Empieza pequeño y actualiza después. Todos los planes incluyen hosting, actualizaciones de seguridad y soporte básico.",
    note: "Los precios reales serán confirmados después – estos son placeholders.",
    plans: [
      {
        id: "one-page",
        name: "Sitio web de una página",
        short: "Para negocios locales simples",
        price: "Desde €X / mes",
        bestFor: "Ideal si tienes algunos servicios y solo necesitas una página limpia y desplazable.",
        features: [
          "Hasta 6 servicios en una sola página",
          "Botones de contacto / WhatsApp / llamada",
          "Diseño optimizado para móvil",
          "Estructura SEO básica para Google",
        ],
        highlight: "Gran opción inicial",
      },
      {
        id: "multi-page",
        name: "Sitio web multi-página",
        short: "Para negocios en crecimiento",
        price: "Desde €Y / mes",
        bestFor: "Bueno si quieres páginas separadas para servicios, proyectos, equipo, blog y más.",
        features: [
          "Páginas de servicios que pueden posicionarse en Google",
          "Sección de blog o noticias",
          "Páginas de portafolio / proyectos",
          "Más espacio para fotos y explicaciones",
        ],
        highlight: "Opción más flexible",
      },
      {
        id: "store",
        name: "Tienda online",
        short: "Para vender productos online",
        price: "Desde €Z / mes",
        bestFor: "Para negocios que quieren aceptar pedidos y pagos directamente a través del sitio web.",
        features: [
          "Catálogo de productos y categorías",
          "Opciones simples de checkout y pago",
          "Notificaciones de pedidos",
          "Resumen básico de ventas",
        ],
        highlight: "Mejor si vendes productos",
      },
    ],
  },
  templates: {
    title: "Elige un punto de partida para tu sitio web.",
    subtitle: "Elige un layout que se adapte a tu tipo de negocio. Adaptaremos colores, fotos y textos a tus detalles.",
    badge: "Paso 1 · Elegir plantilla",
    note: "Estos son layouts de ejemplo. Puedes cambiar todo después.",
    list: [
      {
        id: "local-service-01",
        name: "Servicio local (limpio y simple)",
        type: "Layout de una página",
        bestFor: "Ideal para trabajadores por horas, limpiadores, coaches, tutores, servicios locales pequeños.",
        complexity: "Rápido de lanzar",
        highlight: "Recomendado para negocios de servicios simples.",
      },
      {
        id: "multi-service-01",
        name: "Empresa multi-servicios",
        type: "Layout multi-página",
        bestFor: "Bueno para construcción, renovaciones, salones de belleza y otros negocios con múltiples servicios.",
        complexity: "Más espacio para contenido",
        highlight: "Mejor cuando tienes múltiples servicios principales.",
      },
      {
        id: "store-01",
        name: "Tienda online simple",
        type: "Layout de tienda",
        bestFor: "Para tiendas pequeñas que quieren mostrar productos y aceptar pedidos online básicos.",
        complexity: "Incluye grilla de productos",
        highlight: "Buen punto de partida para pequeño e-commerce.",
      },
    ],
    buttons: {
      useTemplate: "Usar esta plantilla",
      backHome: "Volver al inicio",
      goToBuilder: "Continuar al constructor",
    },
  },
  auth: {
    login: {
      title: "Inicia sesión en tu cuenta de Just Code Works",
      subtitle: "Accede a tus sitios web, borradores, pedidos de impresión y herramientas MagicAI desde tu dashboard.",
      emailLabel: "Email",
      passwordLabel: "Contraseña",
      button: "Iniciar Sesión",
      noAccount: "¿Aún no tienes una cuenta?",
      goToRegister: "Crear una cuenta",
      backHome: "Volver al inicio",
      note: "Esta es una página de login demo. En la versión completa, se conectará al sistema de autenticación real.",
    },
    register: {
      title: "Crea tu cuenta de Just Code Works",
      subtitle: "Usaremos estos detalles para conectar tus sitios web, pedidos de impresión y facturación en un lugar.",
      nameLabel: "Nombre",
      emailLabel: "Email",
      passwordLabel: "Contraseña",
      button: "Crear Cuenta",
      haveAccount: "¿Ya tienes una cuenta?",
      goToLogin: "Ir al login",
      backHome: "Volver al inicio",
      note: "Esta es una página de registro demo. En la versión completa, creará una cuenta real para ti.",
    },
  },
  reviewPage: {
    title: "Resumen de tu configuración",
    subtitle: "Esto es lo que usaremos para generar el borrador de tu sitio web y sugerir artículos de impresión.",
    missingDataTitle: "Aún no se encontraron datos",
    missingDataText: "Parece que aún no has completado el asistente del constructor. Por favor, pasa primero por los pasos.",
    backToBuilder: "Volver al constructor",
    backHome: "Volver al inicio",
    selectedTemplate: "Plantilla seleccionada",
    builderDataTitle: "Información del constructor",
    businessSection: "Detalles del negocio",
    servicesSection: "Servicios y tipo de sitio web",
    styleSection: "Colores y estilo",
    editInBuilder: "Cambiar en constructor",
  },
  pages: {
    home: {
      title: "Just Code Works - Inicio",
      subtitle: "Bienvenido a nuestra página principal",
      pageInfo: "Información de la página",
      languageTesting: "Prueba de idiomas",
      languageHelp: "Usa el selector arriba para probar diferentes versiones de idioma del sitio.",
      navigation: "Navegación",
      published: "Publicado",
      systemOverview: {
        title: "📊 Resumen del sistema",
        template: "Plantilla",
        templateName: "jcw-main",
        sections: "Secciones",
        sectionsList: "Hero, Características, Servicios, Soluciones, Contacto",
        status: "Estado",
        statusActive: "✅ Activo y listo",
        description: "Just Code Works proporciona soluciones empresariales completas que se adaptan a tus necesidades."
      },
      multiLanguageSupport: {
        title: "🌍 Soporte multi-idioma",
        description: "Nuestra plataforma soporta 6 idiomas con traducción automática de contenido y enrutamiento localizado.",
        languages: "Idiomas: Inglés, Holandés, Portugués, Español, Francés, Alemán",
        testInstructions: "Usa el selector de idioma para experimentar navegación multi-idioma sin problemas."
      }
    },
    posystems: {
      title: "Sistemas POS",
      subtitle: "Soluciones point-of-sale modernas para tu negocio",
      features: {
        payment: "Procesamiento de pagos",
        paymentDesc: "Acepta pagos con tarjetas de crédito, débito y sin contacto con tarifas competitivas y procesamiento rápido.",
        inventory: "Gestión de inventario",
        inventoryDesc: "Rastrea stock, establece alertas de stock bajo y gestiona productos fácilmente a través de nuestra interfaz intuitiva.",
        analytics: "Análisis de ventas",
        analyticsDesc: "Obtén insights sobre patrones de ventas, productos más vendidos y rendimiento financiero con reportes detallados.",
      },
    },
    websites: {
      title: "Sitios Web",
      subtitle: "Sitios web personalizados y servicios de desarrollo web",
      features: {
        onePage: "Sitios de una página",
        onePageDesc: "Perfecto para pequeños negocios y portafolios. Ve online rápidamente con un diseño moderno y responsivo.",
        multiPage: "Sitios web multi-página",
        multiPageDesc: "Sitios web empresariales completos con múltiples páginas, navegación y funcionalidades personalizadas.",
        ecommerce: "Tiendas online",
        ecommerceDesc: "Sitios web de e-commerce con carritos, procesamiento de pagos y gestión de inventario.",
      },
    },
    services: {
      title: "Servicios",
      subtitle: "Todos nuestros servicios profesionales",
      features: {
        webDev: "Desarrollo web",
        webDevDesc: "Sitios web personalizados y aplicaciones web construidas con tecnologías modernas.",
        mobileApps: "Apps móviles",
        mobileAppsDesc: "Aplicaciones móviles nativas y multiplataforma para iOS y Android.",
        cloud: "Soluciones en la nube",
        cloudDesc: "Infraestructura de nube escalable y soluciones de despliegue para tus aplicaciones.",
        maintenance: "Mantenimiento",
        maintenanceDesc: "Soporte continuo y mantenimiento para tus soluciones digitales existentes.",
      },
    },
    helpCenter: {
      title: "Centro de Ayuda",
      subtitle: "Obtén ayuda y soporte",
      features: {
        documentation: "Documentación",
        documentationDesc: "Guías completas y documentación para todos nuestros productos y servicios.",
        support: "Soporte",
        supportDesc: "Obtén ayuda directa de nuestro equipo de soporte técnico para cualquier pregunta o problema.",
        faq: "FAQ",
        faqDesc: "Encuentra respuestas a preguntas frecuentes sobre nuestros servicios.",
        tutorials: "Tutoriales",
        tutorialsDesc: "Tutoriales paso a paso y guías en video para ayudarte a aprovechar al máximo nuestra plataforma.",
        categories: {
          getting: "Guías de inicio",
          api: "Documentación API",
          practices: "Mejores prácticas",
          live: "Soporte de chat en vivo",
          email: "Soporte por email",
          phone: "Soporte telefónico",
          billing: "Preguntas de facturación",
          technical: "Problemas técnicos",
          account: "Gestión de cuenta",
          video: "Tutoriales en video",
          written: "Guías escritas",
          interactive: "Ejemplos interactivos",
        },
      },
    },
    common: {
      title: "Título",
      slug: "Slug",
      path: "Ruta",
      language: "Idioma",
      order: "Orden",
      project: "Proyecto",
      template: "Plantilla",
      loading: "Cargando..."
    },
  },
  onboarding: {
    step0: {
      title: "Empecemos",
      subtitle: "Cuéntanos sobre tu negocio y qué te gustaría crear",
      progress: {
        intent: "Intención",
        details: "Detalles", 
        branding: "Marca"
      },
      intents: {
        website: {
          title: "Construir un sitio web",
          description: "Crear un sitio web profesional para tu negocio"
        },
        prints: {
          title: "Diseñar impresiones",
          description: "Crear tarjetas de visita, folletos y materiales de marketing"
        },
        pos: {
          title: "Point of Sale",
          description: "Configurar procesamiento de pagos y gestión de inventario"
        }
      },
      form: {
        businessName: {
          label: "Nombre del negocio",
          placeholder: "Ingresa el nombre de tu negocio",
          required: "El nombre del negocio es requerido"
        },
        businessType: {
          label: "Tipo de negocio",
          placeholder: "ej. Restaurante, Consultoría, Tienda minorista"
        },
        primaryCountry: {
          label: "País principal",
          placeholder: "Selecciona tu país"
        },
        primaryLanguage: {
          label: "Idioma principal",
          placeholder: "Selecciona idioma principal"
        },
        primaryGoal: {
          label: "Objetivo principal",
          placeholder: "¿Cuál es tu objetivo principal?"
        },
        brandColors: {
          primaryLabel: "Color principal de marca",
          secondaryLabel: "Color secundario de marca",
          primaryPlaceholder: "#1D4ED8",
          secondaryPlaceholder: "#6366F1"
        },
        themeMode: {
          label: "Tema preferido",
          light: "Claro",
          dark: "Oscuro",
          auto: "Auto"
        },
        notes: {
          label: "Notas adicionales",
          placeholder: "Cualquier requisito específico o preferencias..."
        }
      },
      actions: {
        back: "Atrás",
        continue: "Continuar a marca",
        continueDetails: "Continuar a detalles",
        complete: "Completar configuración",
        creating: "Creando..."
      },
      success: {
        title: "¡Bienvenido a JustCodeWorks!",
        subtitle: "Tu onboarding está completo. Redirigiendo a tu dashboard...",
        redirecting: "Redirigiendo..."
      },
      errors: {
        general: "Algo salió mal. Inténtalo de nuevo.",
        businessName: "El nombre del negocio no puede estar vacío",
        invalidColor: "Por favor ingresa un color hex válido (ej. #1D4ED8)",
        submitFailed: "Error al guardar datos de onboarding. Inténtalo de nuevo."
      },
      countries: [
        "Estados Unidos",
        "Reino Unido", 
        "Canadá",
        "Australia",
        "Alemania",
        "Francia",
        "España",
        "Portugal",
        "Brasil",
        "México",
        "Otro"
      ],
      languages: {
        en: "Inglés",
        pt: "Português",
        es: "Español", 
        fr: "Français",
        de: "Deutsch"
      },
      goals: {
        "get-leads": "Obtener leads / consultas",
        "show-info": "Mostrar info / menú",
        "sell-online": "Vender online",
        "take-bookings": "Tomar reservas",
        "other": "Otro"
      }
    }
  },
  websitePromise: {
    items: [
      "Dominio gratuito y hosting primer año",
      "Servidores seguros basados en UE",
      "Certificado SSL y copias de seguridad diarias",
      "Tiempo de entrega rápido",
      "Opciones de actualización continua",
    ],
    description: "Todos los sitios web están construidos con nuestro sistema inteligente que hace que la creación de contenido sea simple e intuitiva — para que puedas enfocarte en tu negocio, no en las herramientas.",
    exploreTitle: "Explora Nuestros Tipos de Sitios Web",
  }
};

export default spanishDictionary;
