"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const locales = ["fr", "en", "ar"] as const;

export type Locale = (typeof locales)[number];

type Dictionary = Record<string, string>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = "skinorai-locale";

const dictionaries: Record<Locale, Dictionary> = {
  fr: {
    "language.french": "FranÃ§ais",
    "language.english": "English",
    "language.arabic": "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©",
    "language.label": "Langue",
    "nav.home": "Accueil",
    "nav.products": "Produits",
    "nav.ingredients": "IngrÃ©dients",
    "nav.pricing": "Tarifs",
    "nav.scanCta": "Commencer le scan",
    "nav.scanShort": "Scanner",
    "nav.openMenu": "Ouvrir le menu",
    "nav.closeMenu": "Fermer le menu",
    "nav.account": "Compte de {name}",
    "nav.settings": "ParamÃ¨tres",
    "nav.logout": "Se dÃ©connecter",
    "nav.login": "Se connecter",
    "hero.title": "RÃ©vÃ©lez tout le potentiel de votre peau",
    "hero.text": "Notre IA analyse votre visage et identifie les points Ã  amÃ©liorer",
    "hero.cta": "Analyser ma peau",
    "hero.stat.accuracyValue": "95 %",
    "hero.stat.accuracy": "dâ€™analyse cutanÃ©e prÃ©cise",
    "hero.stat.concernsValue": "30+",
    "hero.stat.concerns": "problÃ©matiques de peau analysÃ©es",
    "hero.stat.routineValue": "7 jours",
    "hero.stat.routine": "de routine personnalisÃ©e",
    "how.imageAlt": "Analyse skincare personnalisÃ©e avec SkinorAI",
    "how.label.analyze": "ANALYSER",
    "how.label.hydrate": "HYDRATER",
    "how.label.understand": "COMPRENDRE",
    "how.title": "AI Skincare",
    "how.text": "SkinorAI ne promet pas la perfection. Il analyse, apprend et adapte ses recommandations Ã  votre type de peau, vos objectifs et les produits que vous utilisez.",
    "how.outroTitle": "Une beautÃ© plus consciente",
    "how.outroText": "Nous ne pouvons pas arrÃªter le temps, mais nous pouvons vous aider Ã  mieux comprendre votre peau, choisir vos produits et construire une routine plus adaptÃ©e.",
    "scan.badge": "Scanner d'ingrÃ©dients intelligent",
    "scan.title": "Scannez l'Ã©tiquette.",
    "scan.titleAccent": "Comprenez la formule.",
    "scan.text": "Importez l'Ã©tiquette d'un produit skincare et laissez SkinorAI identifier les ingrÃ©dients, expliquer leurs bienfaits et rÃ©vÃ©ler les points auxquels votre peau doit faire attention.",
    "scan.cta": "Scanner un produit",
    "scan.imageAlt": "Produit skincare en cours d'analyse",
    "scan.reading": "Lecture de la formule",
    "scan.compatibility": "CompatibilitÃ© cutanÃ©e",
    "scan.hyaluronic": "Acide hyaluronique",
    "scan.hydration": "Hydratation intense",
    "scan.niacinamide": "Niacinamide",
    "scan.niacinamideDetail": "Soutien de la barriÃ¨re cutanÃ©e",
    "scan.panthenol": "PanthÃ©nol",
    "scan.panthenolDetail": "Apaisant",
    "scan.barrier": "Formule respectueuse de la barriÃ¨re cutanÃ©e",
    "scan.hydrationSupport": "Hydratation soutenue",
    "scan.fragrance": "Parfum dÃ©tectÃ©",
    "scan.recommendedFor": "RecommandÃ© pour",
    "scan.skinType": "Peau normale Ã  sÃ¨che",
    "scan.scroll": "DÃ©filez pour scanner",
    "library.productsEyebrow": "Page produits",
    "library.productsTitle": "Explorez les produits skincare en un coup d'oeil.",
    "library.productsText": "La page produits permet de parcourir les nettoyants, sÃ©rums, crÃ¨mes et soins ciblÃ©s avant d'ouvrir une fiche dÃ©taillÃ©e. La galerie circulaire rend la comparaison plus fluide, visuelle et intuitive.",
    "library.productsCta": "Voir tous les produits",
    "library.ingredientsEyebrow": "BibliothÃ¨que d'ingrÃ©dients",
    "library.ingredientsTitle": "Transformez les formules en bibliothÃ¨que visuelle claire.",
    "library.ingredientsText": "La bibliothÃ¨que d'ingrÃ©dients aide les utilisateurs Ã  relier chaque produit aux actifs qu'il contient. Le masonry garde une vue riche et dynamique, tout en restant simple Ã  explorer par bÃ©nÃ©fice, prÃ©occupation ou Ã©tape de routine.",
    "library.ingredientsCta": "Voir tous les ingrÃ©dients",
    "testimonials.title": "Les rÃ©ponses que vous cherchez avant de choisir un soin.",
    "testimonials.intro": "DÃ©couvrez comment SkinorAI aide ses utilisateurs Ã  mieux comprendre leurs produits et Ã  construire une routine plus claire.",
    "testimonials.how": "Comment fonctionne SkinorAI",
    "testimonials.note": "Les tÃ©moignages prÃ©sentÃ©s peuvent Ãªtre remplacÃ©s par les retours vÃ©rifiÃ©s de vos utilisateurs aprÃ¨s le lancement.",
    "testimonials.cta": "Analyser mon produit",
    "testimonials.01.question": "Est-ce que SkinorAI comprend vraiment les ingrÃ©dients ?",
    "testimonials.01.answer": "SkinorAI transforme les listes INCI complexes en explications simples. Il identifie le rÃ´le des ingrÃ©dients, leurs bÃ©nÃ©fices potentiels et les points auxquels vous devez faire attention selon votre peau.",
    "testimonials.01.quote": "Je regardais toujours les ingrÃ©dients sans rien comprendre. Maintenant, je sais enfin pourquoi un produit me convient ou non.",
    "testimonials.01.profile": "Peau mixte et sensible",
    "testimonials.02.question": "Les recommandations sont-elles personnalisÃ©es ?",
    "testimonials.02.answer": "Oui. L'analyse prend en compte votre type de peau, vos prÃ©occupations, vos sensibilitÃ©s et l'objectif que vous souhaitez atteindre, comme l'hydratation, les imperfections ou les rougeurs.",
    "testimonials.02.quote": "L'analyse ne m'a pas donnÃ© une rÃ©ponse gÃ©nÃ©rique. Elle a vraiment pris en compte ma peau sensible et mes rougeurs.",
    "testimonials.02.profile": "Peau sÃ¨che avec rougeurs",
    "testimonials.03.question": "Puis-je analyser les produits que je possÃ¨de dÃ©jÃ  ?",
    "testimonials.03.answer": "Vous pouvez importer une photo claire de la liste d'ingrÃ©dients prÃ©sente sur l'emballage. SkinorAI extrait les ingrÃ©dients et vous permet de les vÃ©rifier avant de lancer l'analyse.",
    "testimonials.03.quote": "J'ai scannÃ© plusieurs produits de ma routine et dÃ©couvert que deux soins avaient presque la mÃªme fonction.",
    "testimonials.03.profile": "Routine anti-imperfections",
    "testimonials.04.question": "SkinorAI peut-il m'aider Ã  Ã©viter les mauvais achats ?",
    "testimonials.04.answer": "SkinorAI vous aide Ã  Ã©valuer un produit avant de l'acheter. Vous pouvez comprendre s'il correspond Ã  vos objectifs, s'il contient des ingrÃ©dients potentiellement irritants et s'il apporte rÃ©ellement quelque chose Ã  votre routine.",
    "testimonials.04.quote": "Avant, j'achetais selon les vidÃ©os sur les rÃ©seaux sociaux. Maintenant, je vÃ©rifie le produit avant de dÃ©penser.",
    "testimonials.04.profile": "Peau grasse Ã  tendance acnÃ©ique",
    "testimonials.05.question": "Est-ce que SkinorAI remplace un dermatologue ?",
    "testimonials.05.answer": "Non. SkinorAI fournit des informations Ã©ducatives et des recommandations gÃ©nÃ©rales sur les produits cosmÃ©tiques. Il ne pose aucun diagnostic et ne remplace pas l'avis d'un professionnel de santÃ©.",
    "testimonials.05.quote": "J'aime que les rÃ©ponses restent claires et prudentes, sans prÃ©tendre remplacer un professionnel.",
    "testimonials.05.profile": "Peau rÃ©active",
    "footer.description": "Comprenez les ingrÃ©dients de vos soins et trouvez les produits les plus adaptÃ©s Ã  votre peau.",
    "footer.scan": "Analyser un produit",
    "footer.navigation": "Navigation",
    "footer.productsLibrary": "BibliothÃ¨que de produits",
    "footer.ingredientsLibrary": "BibliothÃ¨que dâ€™ingrÃ©dients",
    "footer.ai": "Analyse assistÃ©e par IA",
    "footer.rights": "Â© {year} SkinorAI. Tous droits rÃ©servÃ©s.",
    "footer.disclaimer": "Les analyses sont informatives et ne remplacent pas un avis dermatologique.",
  },
  en: {
    "language.french": "French",
    "language.english": "English",
    "language.arabic": "Arabic",
    "language.label": "Language",
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.ingredients": "Ingredients",
    "nav.pricing": "Pricing",
    "nav.scanCta": "Start scanning",
    "nav.scanShort": "Scan",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
    "nav.account": "{name}'s account",
    "nav.settings": "Settings",
    "nav.logout": "Log out",
    "nav.login": "Log in",
    "hero.title": "Reveal your skin's full potential",
    "hero.text": "Our AI analyzes your face and identifies the areas to improve",
    "hero.cta": "Analyze my skin",
    "hero.stat.accuracyValue": "95%",
    "hero.stat.accuracy": "accurate skin analysis",
    "hero.stat.concernsValue": "30+",
    "hero.stat.concerns": "skin concerns analyzed",
    "hero.stat.routineValue": "7 days",
    "hero.stat.routine": "personalized routine",
    "how.imageAlt": "Personalized skincare analysis with SkinorAI",
    "how.label.analyze": "ANALYZE",
    "how.label.hydrate": "HYDRATE",
    "how.label.understand": "UNDERSTAND",
    "how.title": "AI Skincare",
    "how.text": "SkinorAI does not promise perfection. It analyzes, learns, and adapts its recommendations to your skin type, your goals, and the products you use.",
    "how.outroTitle": "More conscious beauty",
    "how.outroText": "We cannot stop time, but we can help you better understand your skin, choose your products, and build a routine that fits you.",
    "scan.badge": "Intelligent ingredient scanner",
    "scan.title": "Scan the label.",
    "scan.titleAccent": "Understand the formula.",
    "scan.text": "Upload a skincare label and let SkinorAI identify the ingredients, explain their benefits, and reveal what your skin should watch out for.",
    "scan.cta": "Scan a product",
    "scan.imageAlt": "Skincare product being analyzed",
    "scan.reading": "Reading formula",
    "scan.compatibility": "Skin compatibility",
    "scan.hyaluronic": "Hyaluronic acid",
    "scan.hydration": "Deep hydration",
    "scan.niacinamide": "Niacinamide",
    "scan.niacinamideDetail": "Barrier support",
    "scan.panthenol": "Panthenol",
    "scan.panthenolDetail": "Soothing",
    "scan.barrier": "Barrier-friendly formula",
    "scan.hydrationSupport": "Strong hydration support",
    "scan.fragrance": "Fragrance detected",
    "scan.recommendedFor": "Recommended for",
    "scan.skinType": "Normal to dry skin",
    "scan.scroll": "Scroll to scan",
    "library.productsEyebrow": "Products page",
    "library.productsTitle": "Explore skincare products at a glance.",
    "library.productsText": "The products page lets users browse cleansers, serums, creams, and targeted treatments before opening a detailed product sheet. The circular gallery makes comparison smoother, more visual, and intuitive.",
    "library.productsCta": "View all products",
    "library.ingredientsEyebrow": "Ingredient library",
    "library.ingredientsTitle": "Turn formulas into a clear visual library.",
    "library.ingredientsText": "The ingredient library helps users connect each product to the active ingredients it contains. The masonry view keeps exploration rich and dynamic while staying simple to browse by benefit, concern, or routine step.",
    "library.ingredientsCta": "View all ingredients",
    "testimonials.title": "The answers you need before choosing skincare.",
    "testimonials.intro": "See how SkinorAI helps users better understand their products and build a clearer routine.",
    "testimonials.how": "How SkinorAI works",
    "testimonials.note": "These testimonials can be replaced by verified user feedback after launch.",
    "testimonials.cta": "Analyze my product",
    "testimonials.01.question": "Does SkinorAI really understand ingredients?",
    "testimonials.01.answer": "SkinorAI turns complex INCI lists into simple explanations. It identifies each ingredient's role, potential benefits, and the points you should watch depending on your skin.",
    "testimonials.01.quote": "I used to look at ingredients without understanding anything. Now I finally know why a product suits me or not.",
    "testimonials.01.profile": "Combination and sensitive skin",
    "testimonials.02.question": "Are the recommendations personalized?",
    "testimonials.02.answer": "Yes. The analysis takes your skin type, concerns, sensitivities, and goals into account, such as hydration, blemishes, or redness.",
    "testimonials.02.quote": "The analysis did not give me a generic answer. It really considered my sensitive skin and redness.",
    "testimonials.02.profile": "Dry skin with redness",
    "testimonials.03.question": "Can I analyze products I already own?",
    "testimonials.03.answer": "You can upload a clear photo of the ingredient list on the packaging. SkinorAI extracts the ingredients and lets you review them before starting the analysis.",
    "testimonials.03.quote": "I scanned several products from my routine and discovered that two treatments had almost the same function.",
    "testimonials.03.profile": "Anti-blemish routine",
    "testimonials.04.question": "Can SkinorAI help me avoid bad purchases?",
    "testimonials.04.answer": "SkinorAI helps you evaluate a product before buying it. You can understand whether it matches your goals, contains potentially irritating ingredients, and truly adds something to your routine.",
    "testimonials.04.quote": "Before, I bought products based on social videos. Now I check the product before spending.",
    "testimonials.04.profile": "Oily, acne-prone skin",
    "testimonials.05.question": "Does SkinorAI replace a dermatologist?",
    "testimonials.05.answer": "No. SkinorAI provides educational information and general recommendations about cosmetic products. It does not diagnose and does not replace medical advice.",
    "testimonials.05.quote": "I like that the answers stay clear and careful without pretending to replace a professional.",
    "testimonials.05.profile": "Reactive skin",
    "footer.description": "Understand the ingredients in your skincare and find the products best suited to your skin.",
    "footer.scan": "Analyze a product",
    "footer.navigation": "Navigation",
    "footer.productsLibrary": "Product library",
    "footer.ingredientsLibrary": "Ingredient library",
    "footer.ai": "AI-assisted analysis",
    "footer.rights": "Â© {year} SkinorAI. All rights reserved.",
    "footer.disclaimer": "Analyses are informational and do not replace dermatological advice.",
  },
  ar: {
    "language.french": "Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©",
    "language.english": "Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©",
    "language.arabic": "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©",
    "language.label": "Ø§Ù„Ù„ØºØ©",
    "nav.home": "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
    "nav.products": "Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    "nav.ingredients": "Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
    "nav.pricing": "Ø§Ù„Ø£Ø³Ø¹Ø§Ø±",
    "nav.scanCta": "Ø§Ø¨Ø¯Ø£ Ø§Ù„ÙØ­Øµ",
    "nav.scanShort": "ÙØ­Øµ",
    "nav.openMenu": "ÙØªØ­ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©",
    "nav.closeMenu": "Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©",
    "nav.account": "Ø­Ø³Ø§Ø¨ {name}",
    "nav.settings": "Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª",
    "nav.logout": "ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬",
    "nav.login": "ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„",
    "hero.title": "Ø§ÙƒØ´ÙÙŠ Ø§Ù„Ø¥Ù…ÙƒØ§Ù†Ø§Øª Ø§Ù„ÙƒØ§Ù…Ù„Ø© Ù„Ø¨Ø´Ø±ØªÙƒ",
    "hero.text": "ÙŠÙ‚ÙˆÙ… Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø¨ØªØ­Ù„ÙŠÙ„ ÙˆØ¬Ù‡Ùƒ ÙˆØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù†Ù‚Ø§Ø· Ø§Ù„ØªÙŠ ÙŠÙ…ÙƒÙ† ØªØ­Ø³ÙŠÙ†Ù‡Ø§",
    "hero.cta": "Ø­Ù„Ù„ÙŠ Ø¨Ø´Ø±ØªÙŠ",
    "hero.stat.accuracyValue": "95%",
    "hero.stat.accuracy": "ØªØ­Ù„ÙŠÙ„ Ø¯Ù‚ÙŠÙ‚ Ù„Ù„Ø¨Ø´Ø±Ø©",
    "hero.stat.concernsValue": "+30",
    "hero.stat.concerns": "Ù…Ø´ÙƒÙ„Ø© Ø¬Ù„Ø¯ÙŠØ© ØªÙ… ØªØ­Ù„ÙŠÙ„Ù‡Ø§",
    "hero.stat.routineValue": "7 Ø£ÙŠØ§Ù…",
    "hero.stat.routine": "Ø±ÙˆØªÙŠÙ† Ù…Ø®ØµØµ",
    "how.imageAlt": "ØªØ­Ù„ÙŠÙ„ Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ù…Ø®ØµØµ Ù…Ø¹ SkinorAI",
    "how.label.analyze": "ØªØ­Ù„ÙŠÙ„",
    "how.label.hydrate": "ØªØ±Ø·ÙŠØ¨",
    "how.label.understand": "ÙÙ‡Ù…",
    "how.title": "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ",
    "how.text": "Ù„Ø§ ÙŠØ¹Ø¯ SkinorAI Ø¨Ø§Ù„ÙƒÙ…Ø§Ù„. Ø¥Ù†Ù‡ ÙŠØ­Ù„Ù„ ÙˆÙŠØªØ¹Ù„Ù… ÙˆÙŠÙƒÙŠÙ ØªÙˆØµÙŠØ§ØªÙ‡ Ø­Ø³Ø¨ Ù†ÙˆØ¹ Ø¨Ø´Ø±ØªÙƒ ÙˆØ£Ù‡Ø¯Ø§ÙÙƒ ÙˆØ§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„ØªÙŠ ØªØ³ØªØ®Ø¯Ù…ÙŠÙ†Ù‡Ø§.",
    "how.outroTitle": "Ø¬Ù…Ø§Ù„ Ø¨ÙˆØ¹ÙŠ Ø£ÙƒØ¨Ø±",
    "how.outroText": "Ù„Ø§ ÙŠÙ…ÙƒÙ†Ù†Ø§ Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ø²Ù…Ù†ØŒ Ù„ÙƒÙ† ÙŠÙ…ÙƒÙ†Ù†Ø§ Ù…Ø³Ø§Ø¹Ø¯ØªÙƒ Ø¹Ù„Ù‰ ÙÙ‡Ù… Ø¨Ø´Ø±ØªÙƒ Ø¨Ø´ÙƒÙ„ Ø£ÙØ¶Ù„ØŒ ÙˆØ§Ø®ØªÙŠØ§Ø± Ù…Ù†ØªØ¬Ø§ØªÙƒØŒ ÙˆØ¨Ù†Ø§Ø¡ Ø±ÙˆØªÙŠÙ† Ø£Ù†Ø³Ø¨ Ù„Ùƒ.",
    "scan.badge": "Ù…Ø§Ø³Ø­ Ø°ÙƒÙŠ Ù„Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
    "scan.title": "Ø§Ù…Ø³Ø­ÙŠ Ø§Ù„Ù…Ù„ØµÙ‚.",
    "scan.titleAccent": "ÙˆØ§ÙÙ‡Ù…ÙŠ Ø§Ù„ØªØ±ÙƒÙŠØ¨Ø©.",
    "scan.text": "Ø§Ø±ÙØ¹ÙŠ Ù…Ù„ØµÙ‚ Ù…Ù†ØªØ¬ Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ¯Ø¹ÙŠ SkinorAI ÙŠØ­Ø¯Ø¯ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§ØªØŒ ÙŠØ´Ø±Ø­ ÙÙˆØ§Ø¦Ø¯Ù‡Ø§ØŒ ÙˆÙŠÙˆØ¶Ø­ Ù…Ø§ ÙŠØ¬Ø¨ Ø£Ù† ØªÙ†ØªØ¨Ù‡ Ù„Ù‡ Ø¨Ø´Ø±ØªÙƒ.",
    "scan.cta": "ÙØ­Øµ Ù…Ù†ØªØ¬",
    "scan.imageAlt": "Ù…Ù†ØªØ¬ Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ù‚ÙŠØ¯ Ø§Ù„ØªØ­Ù„ÙŠÙ„",
    "scan.reading": "Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„ØªØ±ÙƒÙŠØ¨Ø©",
    "scan.compatibility": "ØªÙˆØ§ÙÙ‚ Ø§Ù„Ø¨Ø´Ø±Ø©",
    "scan.hyaluronic": "Ø­Ù…Ø¶ Ø§Ù„Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ",
    "scan.hydration": "ØªØ±Ø·ÙŠØ¨ Ø¹Ù…ÙŠÙ‚",
    "scan.niacinamide": "Ù†ÙŠØ§Ø³ÙŠÙ†Ø§Ù…ÙŠØ¯",
    "scan.niacinamideDetail": "Ø¯Ø¹Ù… Ø­Ø§Ø¬Ø² Ø§Ù„Ø¨Ø´Ø±Ø©",
    "scan.panthenol": "Ø¨Ø§Ù†Ø«ÙŠÙ†ÙˆÙ„",
    "scan.panthenolDetail": "Ù…Ù‡Ø¯Ø¦",
    "scan.barrier": "ØªØ±ÙƒÙŠØ¨Ø© Ù„Ø·ÙŠÙØ© Ø¹Ù„Ù‰ Ø­Ø§Ø¬Ø² Ø§Ù„Ø¨Ø´Ø±Ø©",
    "scan.hydrationSupport": "Ø¯Ø¹Ù… Ù‚ÙˆÙŠ Ù„Ù„ØªØ±Ø·ÙŠØ¨",
    "scan.fragrance": "ØªÙ… Ø§ÙƒØªØ´Ø§Ù Ø¹Ø·Ø±",
    "scan.recommendedFor": "Ù…Ù†Ø§Ø³Ø¨ Ù„Ù€",
    "scan.skinType": "Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø¹Ø§Ø¯ÙŠØ© Ø¥Ù„Ù‰ Ø§Ù„Ø¬Ø§ÙØ©",
    "scan.scroll": "Ù…Ø±Ø±ÙŠ Ù„Ù„ÙØ­Øµ",
    "library.productsEyebrow": "ØµÙØ­Ø© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    "library.productsTitle": "Ø§Ø³ØªÙƒØ´ÙÙŠ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ø¨Ù„Ù…Ø­Ø© ÙˆØ§Ø­Ø¯Ø©.",
    "library.productsText": "ØªØªÙŠØ­ ØµÙØ­Ø© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª ØªØµÙØ­ Ø§Ù„ØºØ³ÙˆÙ„Ø§Øª ÙˆØ§Ù„Ø³ÙŠØ±ÙˆÙ…Ø§Øª ÙˆØ§Ù„ÙƒØ±ÙŠÙ…Ø§Øª ÙˆØ§Ù„Ø¹Ù„Ø§Ø¬Ø§Øª Ø§Ù„Ù…Ø³ØªÙ‡Ø¯ÙØ© Ù‚Ø¨Ù„ ÙØªØ­ ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬. ØªØ¬Ø¹Ù„ Ø§Ù„Ù…Ø¹Ø±Ø¶ Ø§Ù„Ø¯Ø§Ø¦Ø±ÙŠ Ø§Ù„Ù…Ù‚Ø§Ø±Ù†Ø© Ø£ÙƒØ«Ø± Ø³Ù„Ø§Ø³Ø© ÙˆÙˆØ¶ÙˆØ­Ø§.",
    "library.productsCta": "Ø¹Ø±Ø¶ ÙƒÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    "library.ingredientsEyebrow": "Ù…ÙƒØªØ¨Ø© Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
    "library.ingredientsTitle": "Ø­ÙˆÙ‘Ù„ÙŠ Ø§Ù„ØªØ±ÙƒÙŠØ¨Ø§Øª Ø¥Ù„Ù‰ Ù…ÙƒØªØ¨Ø© Ø¨ØµØ±ÙŠØ© ÙˆØ§Ø¶Ø­Ø©.",
    "library.ingredientsText": "ØªØ³Ø§Ø¹Ø¯ Ù…ÙƒØªØ¨Ø© Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ø¹Ù„Ù‰ Ø±Ø¨Ø· ÙƒÙ„ Ù…Ù†ØªØ¬ Ø¨Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„ÙØ¹Ø§Ù„Ø© Ø§Ù„ØªÙŠ ÙŠØ­ØªÙˆÙŠÙ‡Ø§. ÙŠØ­Ø§ÙØ¸ Ø¹Ø±Ø¶ Ø§Ù„Ù…Ø§Ø³ÙˆÙ†Ø±ÙŠ Ø¹Ù„Ù‰ ØªØ¬Ø±Ø¨Ø© ØºÙ†ÙŠØ© ÙˆØ³Ù‡Ù„Ø© Ø­Ø³Ø¨ Ø§Ù„ÙØ§Ø¦Ø¯Ø© Ø£Ùˆ Ø§Ù„Ù…Ø´ÙƒÙ„Ø© Ø£Ùˆ Ø®Ø·ÙˆØ© Ø§Ù„Ø±ÙˆØªÙŠÙ†.",
    "library.ingredientsCta": "Ø¹Ø±Ø¶ ÙƒÙ„ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
    "testimonials.title": "Ø§Ù„Ø¥Ø¬Ø§Ø¨Ø§Øª Ø§Ù„ØªÙŠ ØªØ­ØªØ§Ø¬ÙŠÙ†Ù‡Ø§ Ù‚Ø¨Ù„ Ø§Ø®ØªÙŠØ§Ø± Ù…Ù†ØªØ¬ Ø¹Ù†Ø§ÙŠØ©.",
    "testimonials.intro": "Ø§ÙƒØªØ´ÙÙŠ ÙƒÙŠÙ ÙŠØ³Ø§Ø¹Ø¯ SkinorAI Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ø¹Ù„Ù‰ ÙÙ‡Ù… Ù…Ù†ØªØ¬Ø§ØªÙ‡Ù… ÙˆØ¨Ù†Ø§Ø¡ Ø±ÙˆØªÙŠÙ† Ø£ÙˆØ¶Ø­.",
    "testimonials.how": "ÙƒÙŠÙ ÙŠØ¹Ù…Ù„ SkinorAI",
    "testimonials.note": "ÙŠÙ…ÙƒÙ† Ø§Ø³ØªØ¨Ø¯Ø§Ù„ Ù‡Ø°Ù‡ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª Ø¨ØªØ¹Ù„ÙŠÙ‚Ø§Øª Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ù…ÙˆØ«Ù‚Ø© Ø¨Ø¹Ø¯ Ø§Ù„Ø¥Ø·Ù„Ø§Ù‚.",
    "testimonials.cta": "Ø­Ù„Ù„ÙŠ Ù…Ù†ØªØ¬ÙŠ",
    "testimonials.01.question": "Ù‡Ù„ ÙŠÙÙ‡Ù… SkinorAI Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø­Ù‚Ø§ØŸ",
    "testimonials.01.answer": "ÙŠØ­ÙˆÙ‘Ù„ SkinorAI Ù‚ÙˆØ§Ø¦Ù… INCI Ø§Ù„Ù…Ø¹Ù‚Ø¯Ø© Ø¥Ù„Ù‰ Ø´Ø±ÙˆØ­Ø§Øª Ø¨Ø³ÙŠØ·Ø©. ÙŠØ­Ø¯Ø¯ Ø¯ÙˆØ± ÙƒÙ„ Ù…ÙƒÙˆÙ† ÙˆÙÙˆØ§Ø¦Ø¯Ù‡ Ø§Ù„Ù…Ø­ØªÙ…Ù„Ø© ÙˆØ§Ù„Ù†Ù‚Ø§Ø· Ø§Ù„ØªÙŠ ÙŠØ¬Ø¨ Ø§Ù„Ø§Ù†ØªØ¨Ø§Ù‡ Ù„Ù‡Ø§ Ø­Ø³Ø¨ Ø¨Ø´Ø±ØªÙƒ.",
    "testimonials.01.quote": "ÙƒÙ†Øª Ø£Ù†Ø¸Ø± Ø¥Ù„Ù‰ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø¯ÙˆÙ† Ø£Ù† Ø£ÙÙ‡Ù… Ø´ÙŠØ¦Ø§. Ø§Ù„Ø¢Ù† Ø£Ø¹Ø±Ù Ø£Ø®ÙŠØ±Ø§ Ù„Ù…Ø§Ø°Ø§ ÙŠÙ†Ø§Ø³Ø¨Ù†ÙŠ Ù…Ù†ØªØ¬ Ù…Ø§ Ø£Ùˆ Ù„Ø§.",
    "testimonials.01.profile": "Ø¨Ø´Ø±Ø© Ù…Ø®ØªÙ„Ø·Ø© ÙˆØ­Ø³Ø§Ø³Ø©",
    "testimonials.02.question": "Ù‡Ù„ Ø§Ù„ØªÙˆØµÙŠØ§Øª Ù…Ø®ØµØµØ©ØŸ",
    "testimonials.02.answer": "Ù†Ø¹Ù…. ÙŠØ£Ø®Ø° Ø§Ù„ØªØ­Ù„ÙŠÙ„ Ù†ÙˆØ¹ Ø¨Ø´Ø±ØªÙƒ ÙˆÙ…Ø´Ø§ÙƒÙ„Ùƒ ÙˆØ­Ø³Ø§Ø³ÙŠØ§ØªÙƒ ÙˆØ§Ù„Ù‡Ø¯Ù Ø§Ù„Ø°ÙŠ ØªØ±ÙŠØ¯ÙŠÙ† ØªØ­Ù‚ÙŠÙ‚Ù‡ Ø¨Ø¹ÙŠÙ† Ø§Ù„Ø§Ø¹ØªØ¨Ø§Ø±ØŒ Ù…Ø«Ù„ Ø§Ù„ØªØ±Ø·ÙŠØ¨ Ø£Ùˆ Ø§Ù„Ø­Ø¨ÙˆØ¨ Ø£Ùˆ Ø§Ù„Ø§Ø­Ù…Ø±Ø§Ø±.",
    "testimonials.02.quote": "Ù„Ù… ÙŠØ¹Ø·Ù†ÙŠ Ø§Ù„ØªØ­Ù„ÙŠÙ„ Ø¥Ø¬Ø§Ø¨Ø© Ø¹Ø§Ù…Ø©. Ù„Ù‚Ø¯ Ø£Ø®Ø° Ø¨Ø´Ø±ØªÙŠ Ø§Ù„Ø­Ø³Ø§Ø³Ø© ÙˆØ§Ù„Ø§Ø­Ù…Ø±Ø§Ø± Ø¨Ø¹ÙŠÙ† Ø§Ù„Ø§Ø¹ØªØ¨Ø§Ø± ÙØ¹Ù„Ø§.",
    "testimonials.02.profile": "Ø¨Ø´Ø±Ø© Ø¬Ø§ÙØ© Ù…Ø¹ Ø§Ø­Ù…Ø±Ø§Ø±",
    "testimonials.03.question": "Ù‡Ù„ ÙŠÙ…ÙƒÙ†Ù†ÙŠ ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„ØªÙŠ Ø£Ù…Ù„ÙƒÙ‡Ø§ Ø¨Ø§Ù„ÙØ¹Ù„ØŸ",
    "testimonials.03.answer": "ÙŠÙ…ÙƒÙ†Ùƒ Ø±ÙØ¹ ØµÙˆØ±Ø© ÙˆØ§Ø¶Ø­Ø© Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø¹Ù„Ù‰ Ø§Ù„Ø¹Ø¨ÙˆØ©. ÙŠØ³ØªØ®Ø±Ø¬ SkinorAI Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª ÙˆÙŠØªÙŠØ­ Ù„Ùƒ Ù…Ø±Ø§Ø¬Ø¹ØªÙ‡Ø§ Ù‚Ø¨Ù„ Ø¨Ø¯Ø¡ Ø§Ù„ØªØ­Ù„ÙŠÙ„.",
    "testimonials.03.quote": "ÙØ­ØµØª Ø¹Ø¯Ø© Ù…Ù†ØªØ¬Ø§Øª Ù…Ù† Ø±ÙˆØªÙŠÙ†ÙŠ ÙˆØ§ÙƒØªØ´ÙØª Ø£Ù† Ù…Ù†ØªØ¬ÙŠÙ† Ù„Ù‡Ù…Ø§ ØªÙ‚Ø±ÙŠØ¨Ø§ Ù†ÙØ³ Ø§Ù„ÙˆØ¸ÙŠÙØ©.",
    "testimonials.03.profile": "Ø±ÙˆØªÙŠÙ† Ù…Ø¶Ø§Ø¯ Ù„Ù„Ø´ÙˆØ§Ø¦Ø¨",
    "testimonials.04.question": "Ù‡Ù„ ÙŠÙ…ÙƒÙ† Ø£Ù† ÙŠØ³Ø§Ø¹Ø¯Ù†ÙŠ SkinorAI Ø¹Ù„Ù‰ ØªØ¬Ù†Ø¨ Ø§Ù„Ù…Ø´ØªØ±ÙŠØ§Øª ØºÙŠØ± Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©ØŸ",
    "testimonials.04.answer": "ÙŠØ³Ø§Ø¹Ø¯Ùƒ SkinorAI Ø¹Ù„Ù‰ ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ù…Ù†ØªØ¬ Ù‚Ø¨Ù„ Ø´Ø±Ø§Ø¦Ù‡. ÙŠÙ…ÙƒÙ†Ùƒ ÙÙ‡Ù… Ù…Ø§ Ø¥Ø°Ø§ ÙƒØ§Ù† ÙŠÙ†Ø§Ø³Ø¨ Ø£Ù‡Ø¯Ø§ÙÙƒØŒ Ø£Ùˆ ÙŠØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ Ù…ÙƒÙˆÙ†Ø§Øª Ù‚Ø¯ ØªÙ‡ÙŠØ¬ Ø§Ù„Ø¨Ø´Ø±Ø©ØŒ Ø£Ùˆ ÙŠØ¶ÙŠÙ Ø´ÙŠØ¦Ø§ Ø­Ù‚ÙŠÙ‚ÙŠØ§ Ø¥Ù„Ù‰ Ø±ÙˆØªÙŠÙ†Ùƒ.",
    "testimonials.04.quote": "Ø³Ø§Ø¨Ù‚Ø§ ÙƒÙ†Øª Ø£Ø´ØªØ±ÙŠ Ø­Ø³Ø¨ ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª Ø§Ù„Ø´Ø¨ÙƒØ§Øª Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠØ©. Ø§Ù„Ø¢Ù† Ø£ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ù…Ù†ØªØ¬ Ù‚Ø¨Ù„ Ø£Ù† Ø£Ø¯ÙØ¹.",
    "testimonials.04.profile": "Ø¨Ø´Ø±Ø© Ø¯Ù‡Ù†ÙŠØ© Ù…Ø¹Ø±Ø¶Ø© Ù„Ù„Ø­Ø¨ÙˆØ¨",
    "testimonials.05.question": "Ù‡Ù„ ÙŠØ¹ÙˆØ¶ SkinorAI Ø·Ø¨ÙŠØ¨ Ø§Ù„Ø¬Ù„Ø¯ÙŠØ©ØŸ",
    "testimonials.05.answer": "Ù„Ø§. ÙŠÙ‚Ø¯Ù… SkinorAI Ù…Ø¹Ù„ÙˆÙ…Ø§Øª ØªØ¹Ù„ÙŠÙ…ÙŠØ© ÙˆØªÙˆØµÙŠØ§Øª Ø¹Ø§Ù…Ø© Ø­ÙˆÙ„ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„. Ù„Ø§ ÙŠÙ‚Ø¯Ù… ØªØ´Ø®ÙŠØµØ§ ÙˆÙ„Ø§ ÙŠØ¹ÙˆØ¶ Ù†ØµÙŠØ­Ø© Ø§Ù„Ø·Ø¨ÙŠØ¨.",
    "testimonials.05.quote": "Ø£Ø­Ø¨ Ø£Ù† ØªØ¨Ù‚Ù‰ Ø§Ù„Ø¥Ø¬Ø§Ø¨Ø§Øª ÙˆØ§Ø¶Ø­Ø© ÙˆØ­Ø°Ø±Ø© Ø¯ÙˆÙ† Ø£Ù† ØªØ¯Ø¹ÙŠ Ø£Ù†Ù‡Ø§ ØªØ¹ÙˆØ¶ Ø§Ù„Ù…Ø®ØªØµ.",
    "testimonials.05.profile": "Ø¨Ø´Ø±Ø© ØªÙØ§Ø¹Ù„ÙŠØ©",
    "footer.description": "Ø§ÙÙ‡Ù…ÙŠ Ù…ÙƒÙˆÙ†Ø§Øª Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ø®Ø§ØµØ© Ø¨Ùƒ ÙˆØ§Ø¹Ø«Ø±ÙŠ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø£Ù†Ø³Ø¨ Ù„Ø¨Ø´Ø±ØªÙƒ.",
    "footer.scan": "ØªØ­Ù„ÙŠÙ„ Ù…Ù†ØªØ¬",
    "footer.navigation": "Ø§Ù„ØªÙ†Ù‚Ù„",
    "footer.productsLibrary": "Ù…ÙƒØªØ¨Ø© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    "footer.ingredientsLibrary": "Ù…ÙƒØªØ¨Ø© Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
    "footer.ai": "ØªØ­Ù„ÙŠÙ„ Ø¨Ù…Ø³Ø§Ø¹Ø¯Ø© Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ",
    "footer.rights": "Â© {year} SkinorAI. Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­ÙÙˆØ¸Ø©.",
    "footer.disclaimer": "Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª Ù…Ø¹Ù„ÙˆÙ…Ø§ØªÙŠØ© ÙˆÙ„Ø§ ØªØºÙ†ÙŠ Ø¹Ù† Ø§Ø³ØªØ´Ø§Ø±Ø© Ø·Ø¨ÙŠØ¨ Ø§Ù„Ø¬Ù„Ø¯ÙŠØ©.",
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

const isLocale = (value: string | null): value is Locale =>
  value === "fr" || value === "en" || value === "ar";

const aliasKeys: Record<string, string> = {
  Settings: "nav.settings",
  Logout: "nav.logout",
  "Log In": "nav.login",
  "Start scanning": "nav.scanCta",
  Scanner: "nav.scanShort",
  Produits: "nav.products",
  Ingredients: "nav.ingredients",
  "IngrÃ©dients": "nav.ingredients",
  Tarifs: "nav.pricing",
  Accueil: "nav.home",
  Navigation: "footer.navigation",
  SkinorAI: "SkinorAI",
};

const phraseTranslations: Record<string, Partial<Record<Locale, string>>> = {
  "Suggestions de la bibliotheque": {
    en: "Library suggestions",
    ar: "???????? ???????",
  },
  "Image jointe": {
    en: "Attached image",
    ar: "???? ?????",
  },
  "SkinorAI reflechit...": {
    en: "SkinorAI is thinking...",
    ar: "SkinorAI ????...",
  },
  "Posez une question sur ce produit...": {
    en: "Ask a question about this product...",
    ar: "???? ????? ??? ??? ??????...",
  },
  "Retirer l image": {
    en: "Remove image",
    ar: "????? ??????",
  },
  "Envoyer": {
    en: "Send",
    ar: "?????",
  },
  "Aucune question enregistree pour ce scan pour le moment. Vous pouvez reprendre la conversation ci-dessous.": {
    en: "No question has been saved for this scan yet. You can continue the conversation below.",
    ar: "?? ??? ??? ?? ???? ???? ????? ???. ????? ?????? ???????? ?????.",
  },
  "Nouveau scan": {
    en: "New scan",
    ar: "ÙØ­Øµ Ø¬Ø¯ÙŠØ¯",
  },
  "Rechercher un scan...": {
    en: "Search a scan...",
    ar: "Ø§Ø¨Ø­Ø«ÙŠ Ø¹Ù† ÙØ­Øµ...",
  },
  "Historique": {
    en: "History",
    ar: "Ø§Ù„Ø³Ø¬Ù„",
  },
  "Chargement de l historique...": {
    en: "Loading history...",
    ar: "Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø³Ø¬Ù„...",
  },
  "Choisissez votre objectif peau": {
    en: "Choose your skin goal",
    ar: "Ø§Ø®ØªØ§Ø±ÙŠ Ù‡Ø¯Ù Ø¨Ø´Ø±ØªÙƒ",
  },
  "Selectionnez votre priorite du moment pour personnaliser l analyse.": {
    en: "Select your current priority to personalize the analysis.",
    ar: "Ø­Ø¯Ø¯ÙŠ Ø£ÙˆÙ„ÙˆÙŠØªÙƒ Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ù„ØªØ®ØµÙŠØµ Ø§Ù„ØªØ­Ù„ÙŠÙ„.",
  },
  "Objectif peau": {
    en: "Skin goal",
    ar: "Ù‡Ø¯Ù Ø§Ù„Ø¨Ø´Ø±Ø©",
  },
  "Acne & imperfections": {
    en: "Acne & blemishes",
    ar: "Ø­Ø¨ÙˆØ¨ ÙˆØ¹ÙŠÙˆØ¨",
  },
  "Reparation de la barriere": {
    en: "Barrier repair",
    ar: "Ø¥ØµÙ„Ø§Ø­ Ø§Ù„Ø­Ø§Ø¬Ø²",
  },
  "Routine du matin": {
    en: "Morning routine",
    ar: "Ø±ÙˆØªÙŠÙ† Ø§Ù„ØµØ¨Ø§Ø­",
  },
  "Routine du soir": {
    en: "Evening routine",
    ar: "Ø±ÙˆØªÙŠÙ† Ø§Ù„Ù…Ø³Ø§Ø¡",
  },
  "hydrater et repulper": {
    en: "hydrate and plump",
    ar: "Ø§Ù„ØªØ±Ø·ÙŠØ¨ ÙˆØ§Ù„Ø§Ù…ØªÙ„Ø§Ø¡",
  },
  "cibler les imperfections": {
    en: "target blemishes",
    ar: "Ø§Ø³ØªÙ‡Ø¯Ø§Ù Ø§Ù„Ø¹ÙŠÙˆØ¨",
  },
  "renforcer la barriere cutanee": {
    en: "strengthen the skin barrier",
    ar: "ØªÙ‚ÙˆÙŠØ© Ø­Ø§Ø¬Ø² Ø§Ù„Ø¨Ø´Ø±Ø©",
  },
  "apaiser les rougeurs": {
    en: "soothe redness",
    ar: "ØªÙ‡Ø¯Ø¦Ø© Ø§Ù„Ø§Ø­Ù…Ø±Ø§Ø±",
  },
  "equilibrer l exces de sebum": {
    en: "balance excess sebum",
    ar: "Ù…ÙˆØ§Ø²Ù†Ø© Ø§Ù„Ø¥ÙØ±Ø§Ø²Ø§Øª Ø§Ù„Ø¯Ù‡Ù†ÙŠØ© Ø§Ù„Ø²Ø§Ø¦Ø¯Ø©",
  },
  "optimiser la routine du matin": {
    en: "optimize the morning routine",
    ar: "ØªØ­Ø³ÙŠÙ† Ø±ÙˆØªÙŠÙ† Ø§Ù„ØµØ¨Ø§Ø­",
  },
  "optimiser la routine du soir": {
    en: "optimize the evening routine",
    ar: "ØªØ­Ø³ÙŠÙ† Ø±ÙˆØªÙŠÙ† Ø§Ù„Ù…Ø³Ø§Ø¡",
  },
  "cibler les peaux sensibles": {
    en: "target sensitive skin",
    ar: "Ù…Ø±Ø§Ø¹Ø§Ø© Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø­Ø³Ø§Ø³Ø©",
  },
  "Scannez un produit dans la conversation": {
    en: "Scan a product in the conversation",
    ar: "Ø§ÙØ­ØµÙŠ Ù…Ù†ØªØ¬Ù‹Ø§ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø©",
  },
  "Ajoutez une photo ou collez les ingrÃ©dients, confirmez votre objectif peau, puis l'analyse sera enregistrÃ©e comme discussion.": {
    en: "Add a photo or paste the ingredients, confirm your skin goal, then the analysis will be saved as a conversation.",
    ar: "Ø£Ø¶ÙŠÙÙŠ ØµÙˆØ±Ø© Ø£Ùˆ Ø§Ù„ØµÙ‚ÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§ØªØŒ Ø£ÙƒØ¯ÙŠ Ù‡Ø¯Ù Ø¨Ø´Ø±ØªÙƒØŒ Ø«Ù… Ø³ÙŠÙØ­ÙØ¸ Ø§Ù„ØªØ­Ù„ÙŠÙ„ ÙƒÙ…Ø­Ø§Ø¯Ø«Ø©.",
  },
  "Annuler": {
    en: "Cancel",
    ar: "Ø¥Ù„ØºØ§Ø¡",
  },
  "Produit sÃ©lectionnÃ©": {
    en: "Selected product",
    ar: "Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ù…Ø­Ø¯Ø¯",
  },
  "Importer une photo de l'Ã©tiquette": {
    en: "Upload a label photo",
    ar: "Ø­Ù…Ù‘Ù„ÙŠ ØµÙˆØ±Ø© Ø§Ù„Ù…Ù„ØµÙ‚",
  },
  "Extraction des informations visibles...": {
    en: "Extracting visible information...",
    ar: "Ø¬Ø§Ø±Ù Ø§Ø³ØªØ®Ø±Ø§Ø¬ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø¸Ø§Ù‡Ø±Ø©...",
  },
  "VÃ©rifiez les ingrÃ©dients dÃ©tectÃ©s avant de lancer l'analyse.": {
    en: "Check the detected ingredients before starting the analysis.",
    ar: "Ø±Ø§Ø¬Ø¹ÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„Ù…ÙƒØªØ´ÙØ© Ù‚Ø¨Ù„ Ø¨Ø¯Ø¡ Ø§Ù„ØªØ­Ù„ÙŠÙ„.",
  },
  "Vous pouvez aussi coller directement la liste INCI ci-dessous.": {
    en: "You can also paste the INCI list directly below.",
    ar: "ÙŠÙ…ÙƒÙ†Ùƒ Ø£ÙŠØ¶Ù‹Ø§ Ù„ØµÙ‚ Ù‚Ø§Ø¦Ù…Ø© INCI Ù…Ø¨Ø§Ø´Ø±Ø© Ø£Ø¯Ù†Ø§Ù‡.",
  },
  "Liste complÃ¨te": {
    en: "Full list",
    ar: "Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„ÙƒØ§Ù…Ù„Ø©",
  },
  "Liste partielle": {
    en: "Partial list",
    ar: "Ù‚Ø§Ø¦Ù…Ø© Ø¬Ø²Ø¦ÙŠØ©",
  },
  "IngrÃ©dients confirmÃ©s": {
    en: "Confirmed ingredients",
    ar: "Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„Ù…Ø¤ÙƒØ¯Ø©",
  },
  "Collez les ingrÃ©dients ici, sÃ©parÃ©s par des virgules.": {
    en: "Paste the ingredients here, separated by commas.",
    ar: "Ø§Ù„ØµÙ‚ÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ù‡Ù†Ø§ØŒ Ù…ÙØµÙˆÙ„Ø© Ø¨ÙÙˆØ§ØµÙ„.",
  },
  "PrÃ©fÃ©rence chargÃ©e depuis vos paramÃ¨tres.": {
    en: "Preference loaded from your settings.",
    ar: "ØªÙ… ØªØ­Ù…ÙŠÙ„ Ø§Ù„ØªÙØ¶ÙŠÙ„ Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯Ø§ØªÙƒ.",
  },
  "Choisissez une fois, vous pourrez la changer dans ParamÃ¨tres.": {
    en: "Choose once, you can change it later in Settings.",
    ar: "Ø§Ø®ØªØ§Ø±ÙŠ Ù…Ø±Ø© ÙˆØ§Ø­Ø¯Ø©ØŒ ÙˆÙŠÙ…ÙƒÙ†Ùƒ ØªØºÙŠÙŠØ±Ù‡Ø§ Ù„Ø§Ø­Ù‚Ù‹Ø§ Ù…Ù† Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª.",
  },
  "Analyse en cours...": {
    en: "Analysis in progress...",
    ar: "Ø¬Ø§Ø±Ù Ø§Ù„ØªØ­Ù„ÙŠÙ„...",
  },
  "Analyser dans la conversation": {
    en: "Analyze in the conversation",
    ar: "Ø­Ù„Ù„ÙŠ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø©",
  },
  "Le rÃ©sultat sera enregistrÃ© et ouvert comme une discussion.": {
    en: "The result will be saved and opened as a conversation.",
    ar: "Ø³ÙŠÙØ­ÙØ¸ Ø§Ù„Ù†Ø§ØªØ¬ ÙˆÙŠÙÙØªØ­ ÙƒÙ…Ø­Ø§Ø¯Ø«Ø©.",
  },
  "Nouveau produit": {
    en: "New product",
    ar: "Ù…Ù†ØªØ¬ Ø¬Ø¯ÙŠØ¯",
  },
  "Produits recommandÃ©s": {
    en: "Recommended products",
    ar: "Ù…Ù†ØªØ¬Ø§Øª Ù…ÙˆØµÙ‰ Ø¨Ù‡Ø§",
  },
  "DÃ©couvrez des soins classÃ©s par type de peau, objectif et ingrÃ©dients clÃ©s.": {
    en: "Discover skincare sorted by skin type, goal, and key ingredients.",
    ar: "Ø§ÙƒØªØ´ÙÙŠ Ù…Ù†ØªØ¬Ø§Øª Ø¹Ù†Ø§ÙŠØ© Ù…ØµÙ†ÙØ© Ø­Ø³Ø¨ Ù†ÙˆØ¹ Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ§Ù„Ù‡Ø¯Ù ÙˆØ§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©.",
  },
  "Votre profil peau": {
    en: "Your skin profile",
    ar: "Ù…Ù„Ù Ø¨Ø´Ø±ØªÙƒ",
  },
  "Optionnel. Personnalisez vos recommandations ou affichez tout le catalogue.": {
    en: "Optional. Personalize your recommendations or view the full catalog.",
    ar: "Ø§Ø®ØªÙŠØ§Ø±ÙŠ. Ø®ØµØµÙŠ ØªÙˆØµÙŠØ§ØªÙƒ Ø£Ùˆ Ø§Ø¹Ø±Ø¶ÙŠ Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬ Ø§Ù„ÙƒØ§Ù…Ù„.",
  },
  "Voir tous les produits": {
    en: "View all products",
    ar: "Ø¹Ø±Ø¶ ÙƒÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
  },
  "Personnaliser": {
    en: "Personalize",
    ar: "ØªØ®ØµÙŠØµ",
  },
  "RÃ©initialiser": {
    en: "Reset",
    ar: "Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø·",
  },
  "Type de peau": {
    en: "Skin type",
    ar: "Ù†ÙˆØ¹ Ø§Ù„Ø¨Ø´Ø±Ø©",
  },
  "Objectif": {
    en: "Goal",
    ar: "Ø§Ù„Ù‡Ø¯Ù",
  },
  "SensibilitÃ©": {
    en: "Sensitivity",
    ar: "Ø§Ù„Ø­Ø³Ø§Ø³ÙŠØ©",
  },
  "Produit": {
    en: "Product",
    ar: "Ø§Ù„Ù…Ù†ØªØ¬",
  },
  "Ã€ Ã©viter": {
    en: "Avoid",
    ar: "ÙŠØ¬Ø¨ ØªØ¬Ù†Ø¨Ù‡",
  },
  "Tous": {
    en: "All",
    ar: "Ø§Ù„ÙƒÙ„",
  },
  "Tous les objectifs": {
    en: "All goals",
    ar: "ÙƒÙ„ Ø§Ù„Ø£Ù‡Ø¯Ø§Ù",
  },
  "Je ne sais pas": {
    en: "I don't know",
    ar: "Ù„Ø§ Ø£Ø¹Ø±Ù",
  },
  "Tous les produits": {
    en: "All products",
    ar: "ÙƒÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
  },
  "Aucun": {
    en: "None",
    ar: "Ù„Ø§ Ø´ÙŠØ¡",
  },
  "Peau sÃ¨che": {
    en: "Dry skin",
    ar: "Ø¨Ø´Ø±Ø© Ø¬Ø§ÙØ©",
  },
  "Peau grasse": {
    en: "Oily skin",
    ar: "Ø¨Ø´Ø±Ø© Ø¯Ù‡Ù†ÙŠØ©",
  },
  "Peau sensible": {
    en: "Sensitive skin",
    ar: "Ø¨Ø´Ø±Ø© Ø­Ø³Ø§Ø³Ø©",
  },
  "AcnÃ© & imperfections": {
    en: "Acne & blemishes",
    ar: "Ø­Ø¨ÙˆØ¨ ÙˆØ´ÙˆØ§Ø¦Ø¨",
  },
  "Rougeurs": {
    en: "Redness",
    ar: "Ø§Ø­Ù…Ø±Ø§Ø±",
  },
  "BarriÃ¨re abÃ®mÃ©e": {
    en: "Damaged barrier",
    ar: "Ø­Ø§Ø¬Ø² Ø§Ù„Ø¨Ø´Ø±Ø© Ù…ØªØ¶Ø±Ø±",
  },
  "Ã‰clat & taches": {
    en: "Glow & spots",
    ar: "Ø¥Ø´Ø±Ø§Ù‚Ø© ÙˆØ¨Ù‚Ø¹",
  },
  "produits trouvÃ©s": {
    en: "products found",
    ar: "Ù…Ù†ØªØ¬Ø§ ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„ÙŠÙ‡Ø§",
  },
  "Chargement des produits...": {
    en: "Loading products...",
    ar: "Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª...",
  },
  "Profil ignorÃ©. Tous les produits actifs sont affichÃ©s.": {
    en: "Profile ignored. All active products are shown.",
    ar: "ØªÙ… ØªØ¬Ø§Ù‡Ù„ Ø§Ù„Ù…Ù„Ù. ÙŠØªÙ… Ø¹Ø±Ø¶ ÙƒÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø©.",
  },
  "ClassÃ©s selon votre profil peau.": {
    en: "Sorted according to your skin profile.",
    ar: "Ù…Ø±ØªØ¨Ø© Ø­Ø³Ø¨ Ù…Ù„Ù Ø¨Ø´Ø±ØªÙƒ.",
  },
  "Ajoutez votre profil pour obtenir un classement plus prÃ©cis.": {
    en: "Add your profile to get a more precise ranking.",
    ar: "Ø£Ø¶ÙŠÙÙŠ Ù…Ù„ÙÙƒ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ ØªØ±ØªÙŠØ¨ Ø£Ø¯Ù‚.",
  },
  "Rechercher une marque...": {
    en: "Search for a brand...",
    ar: "Ø§Ø¨Ø­Ø«ÙŠ Ø¹Ù† Ø¹Ù„Ø§Ù…Ø© ØªØ¬Ø§Ø±ÙŠØ©...",
  },
  "Aucun produit trouvÃ©": {
    en: "No products found",
    ar: "Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù…Ù†ØªØ¬Ø§Øª",
  },
  "Personnaliser vos recommandations": {
    en: "Personalize your recommendations",
    ar: "Ø®ØµÙ‘ØµÙŠ ØªÙˆØµÙŠØ§ØªÙƒ",
  },
  "Aucun ingrÃ©dient Ã  surveiller renseignÃ©.": {
    en: "No watchout ingredient provided.",
    ar: "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…ÙƒÙˆÙ†Ø§Øª ÙŠØ¬Ø¨ Ù…Ø±Ø§Ù‚Ø¨ØªÙ‡Ø§.",
  },
  "BibliothÃ¨que d'ingrÃ©dients": {
    en: "Ingredient library",
    ar: "Ù…ÙƒØªØ¨Ø© Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
  },
  "DÃ©couvrez, apprenez et crÃ©ez des routines plus intelligentes avec des ingrÃ©dients adaptÃ©s Ã  votre peau.": {
    en: "Discover, learn, and create smarter routines with ingredients adapted to your skin.",
    ar: "Ø§ÙƒØªØ´ÙÙŠ ÙˆØªØ¹Ù„Ù…ÙŠ ÙˆØ§Ø¨Ù†ÙŠ Ø±ÙˆØªÙŠÙ†Ø§Øª Ø£Ø°ÙƒÙ‰ Ø¨Ù…ÙƒÙˆÙ†Ø§Øª Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ø¨Ø´Ø±ØªÙƒ.",
  },
  "Trier par": {
    en: "Sort by",
    ar: "ØªØ±ØªÙŠØ¨ Ø­Ø³Ø¨",
  },
  "Pertinence": {
    en: "Relevance",
    ar: "Ø§Ù„Ù…Ù„Ø§Ø¡Ù…Ø©",
  },
  "Tous les ingrÃ©dients": {
    en: "All ingredients",
    ar: "ÙƒÙ„ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
  },
  "Hydratation": {
    en: "Hydration",
    ar: "ØªØ±Ø·ÙŠØ¨",
  },
  "AcnÃ©": {
    en: "Acne",
    ar: "Ø­Ø¨ÙˆØ¨",
  },
  "Ã‰clat": {
    en: "Glow",
    ar: "Ø¥Ø´Ø±Ø§Ù‚Ø©",
  },
  "RÃ©paration de la barriÃ¨re": {
    en: "Barrier repair",
    ar: "Ø¥ØµÙ„Ø§Ø­ Ø§Ù„Ø­Ø§Ø¬Ø²",
  },
  "ingrÃ©dients trouvÃ©s": {
    en: "ingredients found",
    ar: "Ù…ÙƒÙˆÙ†Ø§ ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„ÙŠÙ‡Ø§",
  },
  "Bienfaits clÃ©s": {
    en: "Key benefits",
    ar: "Ø§Ù„ÙÙˆØ§Ø¦Ø¯ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
  },
  "IdÃ©al pour": {
    en: "Ideal for",
    ar: "Ù…Ø«Ø§Ù„ÙŠ Ù„Ù€",
  },
  "Conseils d'utilisation": {
    en: "Usage tips",
    ar: "Ù†ØµØ§Ø¦Ø­ Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…",
  },
  "CompatibilitÃ©": {
    en: "Compatibility",
    ar: "Ø§Ù„ØªÙˆØ§ÙÙ‚",
  },
  "Excellent": {
    en: "Excellent",
    ar: "Ù…Ù…ØªØ§Ø²",
  },
  "Ã‰viter": {
    en: "Avoid",
    ar: "ØªØ¬Ù†Ø¨ÙŠ",
  },
  "Azelaic Acid": {
    en: "Azelaic Acid",
    ar: "Ø­Ù…Ø¶ Ø§Ù„Ø£Ø²ÙŠÙ„ÙŠÙƒ",
  },
  "Lactic Acid": {
    en: "Lactic Acid",
    ar: "Ø­Ù…Ø¶ Ø§Ù„Ù„Ø§ÙƒØªÙŠÙƒ",
  },
  "Glycolic Acid": {
    en: "Glycolic Acid",
    ar: "Ø­Ù…Ø¶ Ø§Ù„Ø¬Ù„ÙŠÙƒÙˆÙ„ÙŠÙƒ",
  },
  "Benzoyl Peroxide": {
    en: "Benzoyl Peroxide",
    ar: "Ø¨Ù†Ø²ÙˆÙŠÙ„ Ø¨ÙŠØ±ÙˆÙƒØ³ÙŠØ¯",
  },
  "Gluconolactone": {
    en: "Gluconolactone",
    ar: "ØºÙ„ÙˆÙƒÙˆÙ†ÙˆÙ„Ø§ÙƒØªÙˆÙ†",
  },
  "Mandelic Acid": {
    en: "Mandelic Acid",
    ar: "Ø­Ù…Ø¶ Ø§Ù„Ù…Ø§Ù†Ø¯Ù„ÙŠÙƒ",
  },
  "Actif multi-action pour lâ€™Ã©clat": {
    en: "Multi-action active for glow",
    ar: "Ù…ÙƒÙˆÙ† Ù…ØªØ¹Ø¯Ø¯ Ø§Ù„ØªØ£Ø«ÙŠØ± Ù„Ù„Ø¥Ø´Ø±Ø§Ù‚Ø©",
  },
  "Aide Ã  amÃ©liorer le teint irrÃ©gulier, les imperfections et les rougeurs visibles.": {
    en: "Helps improve uneven tone, blemishes, and visible redness.",
    ar: "ÙŠØ³Ø§Ø¹Ø¯ Ø¹Ù„Ù‰ ØªØ­Ø³ÙŠÙ† ØªÙØ§ÙˆØª Ø§Ù„Ù„ÙˆÙ† ÙˆØ§Ù„Ø´ÙˆØ§Ø¦Ø¨ ÙˆØ§Ù„Ø§Ø­Ù…Ø±Ø§Ø± Ø§Ù„Ø¸Ø§Ù‡Ø±.",
  },
  "Exfolie la surface de la peau et aide Ã  raviver le teint terne.": {
    en: "Exfoliates the skin surface and helps revive dull tone.",
    ar: "ÙŠÙ‚Ø´Ø± Ø³Ø·Ø­ Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆÙŠØ³Ø§Ø¹Ø¯ Ø¹Ù„Ù‰ Ø¥Ù†Ø¹Ø§Ø´ Ø§Ù„Ù„ÙˆÙ† Ø§Ù„Ø¨Ø§Ù‡Øª.",
  },
  "Un exfoliant doux qui aide la peau Ã  paraÃ®tre plus lisse et plus hydratÃ©e.": {
    en: "A gentle exfoliant that helps skin look smoother and more hydrated.",
    ar: "Ù…Ù‚Ø´Ø± Ù„Ø·ÙŠÙ ÙŠØ³Ø§Ø¹Ø¯ Ø§Ù„Ø¨Ø´Ø±Ø© Ø¹Ù„Ù‰ Ø£Ù† ØªØ¨Ø¯Ùˆ Ø£Ù†Ø¹Ù… ÙˆØ£ÙƒØ«Ø± ØªØ±Ø·ÙŠØ¨Ø§.",
  },
  "Exfolie tout en aidant la peau Ã  paraÃ®tre plus lisse et plus hydratÃ©e": {
    en: "Exfoliates while helping skin look smoother and more hydrated",
    ar: "ÙŠÙ‚Ø´Ø± Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆÙŠØ³Ø§Ø¹Ø¯Ù‡Ø§ Ø¹Ù„Ù‰ Ø£Ù† ØªØ¨Ø¯Ùˆ Ø£Ù†Ø¹Ù… ÙˆØ£ÙƒØ«Ø± ØªØ±Ø·ÙŠØ¨Ø§",
  },
  "Un exfoliant doux souvent utilisÃ© pour la texture, le teint et les peaux sujettes aux imperfections.": {
    en: "A gentle exfoliant often used for texture, tone, and blemish-prone skin.",
    ar: "Ù…Ù‚Ø´Ø± Ù„Ø·ÙŠÙ ÙŠØ³ØªØ®Ø¯Ù… ØºØ§Ù„Ø¨Ø§ Ù„Ù„Ù…Ù„Ù…Ø³ ÙˆØ§Ù„Ù„ÙˆÙ† ÙˆØ§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ù…Ø¹Ø±Ø¶Ø© Ù„Ù„Ø´ÙˆØ§Ø¦Ø¨.",
  },
  "Aide Ã  lutter contre les bactÃ©ries liÃ©es Ã  lâ€™acnÃ© et Ã  rÃ©duire les imperfections.": {
    en: "Helps fight acne-related bacteria and reduce blemishes.",
    ar: "ÙŠØ³Ø§Ø¹Ø¯ Ø¹Ù„Ù‰ Ù…Ø­Ø§Ø±Ø¨Ø© Ø§Ù„Ø¨ÙƒØªÙŠØ±ÙŠØ§ Ø§Ù„Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ø§Ù„Ø­Ø¨ÙˆØ¨ ÙˆØªÙ‚Ù„ÙŠÙ„ Ø§Ù„Ø´ÙˆØ§Ø¦Ø¨.",
  },
  "Texture": {
    en: "Texture",
    ar: "Ø§Ù„Ù…Ù„Ù…Ø³",
  },
  "Exfoliation": {
    en: "Exfoliation",
    ar: "ØªÙ‚Ø´ÙŠØ±",
  },
  "Doux": {
    en: "Gentle",
    ar: "Ù„Ø·ÙŠÙ",
  },
  "Taches": {
    en: "Spots",
    ar: "Ø¨Ù‚Ø¹",
  },
  "Taches pigmentaires": {
    en: "Dark spots",
    ar: "ØªØµØ¨ØºØ§Øª",
  },
  "Anti-imperfections": {
    en: "Anti-blemish",
    ar: "Ù…Ø¶Ø§Ø¯ Ù„Ù„Ø´ÙˆØ§Ø¦Ø¨",
  },
  "ContrÃ´le du sÃ©bum": {
    en: "Sebum control",
    ar: "ØªÙ†Ø¸ÙŠÙ… Ø§Ù„Ø¥ÙØ±Ø§Ø²Ø§Øª Ø§Ù„Ø¯Ù‡Ù†ÙŠØ©",
  },
  "Imperfections": {
    en: "Blemishes",
    ar: "Ø´ÙˆØ§Ø¦Ø¨",
  },
  "Teint": {
    en: "Tone",
    ar: "Ù„ÙˆÙ† Ø§Ù„Ø¨Ø´Ø±Ø©",
  },
  "Aide Ã  utiliser avec prudence": {
    en: "Use with caution",
    ar: "ÙŠØ³ØªØ®Ø¯Ù… Ø¨Ø­Ø°Ø±",
  },
  "Ã€ utiliser avec prudence": {
    en: "Use with caution",
    ar: "ÙŠØ³ØªØ®Ø¯Ù… Ø¨Ø­Ø°Ø±",
  },
  "Nouvelle discussion": {
    en: "New discussion",
    ar: "Ù…Ø­Ø§Ø¯Ø«Ø© Ø¬Ø¯ÙŠØ¯Ø©",
  },
  "Menu": {
    en: "Menu",
    ar: "Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©",
  },
  "Discussions": {
    en: "Discussions",
    ar: "Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø§Øª",
  },
  "RÃ©cent": {
    en: "Recent",
    ar: "Ø§Ù„Ø£Ø­Ø¯Ø«",
  },
  "Chargement des discussions...": {
    en: "Loading discussions...",
    ar: "Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø§Øª...",
  },
  "Discussion enregistrÃ©e": {
    en: "Saved discussion",
    ar: "Ù…Ø­Ø§Ø¯Ø«Ø© Ù…Ø­ÙÙˆØ¸Ø©",
  },
  "Discussion enregistrÃ©e dans votre historique SkinorAI.": {
    en: "Discussion saved in your SkinorAI history.",
    ar: "ØªÙ… Ø­ÙØ¸ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø© ÙÙŠ Ø³Ø¬Ù„ SkinorAI Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ.",
  },
  "Aucune discussion pour le moment. Lancez un scan pour alimenter cette liste.": {
    en: "No discussions yet. Start a scan to fill this list.",
    ar: "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ø­Ø§Ø¯Ø«Ø§Øª Ø¨Ø¹Ø¯. Ø§Ø¨Ø¯Ø¦ÙŠ ÙØ­ØµÙ‹Ø§ Ù„Ø¥Ø¶Ø§ÙØ© Ø¹Ù†Ø§ØµØ± Ø¥Ù„Ù‰ Ù‡Ø°Ù‡ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©.",
  },
  "DÃ©bloquer Premium": {
    en: "Unlock Premium",
    ar: "ÙØªØ­ Ø¨Ø±ÙŠÙ…ÙŠÙˆÙ…",
  },
  "Obtenez des analyses plus poussÃ©es, des scans illimitÃ©s et des routines personnalisÃ©es.": {
    en: "Get deeper analyses, unlimited scans, and personalized routines.",
    ar: "Ø§Ø­ØµÙ„ÙŠ Ø¹Ù„Ù‰ ØªØ­Ù„ÙŠÙ„Ø§Øª Ø£Ø¹Ù…Ù‚ØŒ ÙˆÙØ­ÙˆØµØ§Øª ØºÙŠØ± Ù…Ø­Ø¯ÙˆØ¯Ø©ØŒ ÙˆØ±ÙˆØªÙŠÙ†Ø§Øª Ù…Ø®ØµØµØ©.",
  },
  "Passer Ã  Premium": {
    en: "Go Premium",
    ar: "Ø§Ù„ØªØ±Ù‚ÙŠØ© Ø¥Ù„Ù‰ Ø¨Ø±ÙŠÙ…ÙŠÙˆÙ…",
  },
  "Clair": {
    en: "Light",
    ar: "ÙØ§ØªØ­",
  },
  "Sombre": {
    en: "Dark",
    ar: "Ø¯Ø§ÙƒÙ†",
  },
  "ParamÃ¨tres": {
    en: "Settings",
    ar: "Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª",
  },
  "Rechercher niacinamide, rÃ©tinol, acide salicylique...": {
    en: "Search niacinamide, retinol, salicylic acid...",
    ar: "Ø§Ø¨Ø­Ø«ÙŠ Ø¹Ù† Ø§Ù„Ù†ÙŠØ§Ø³ÙŠÙ†Ø§Ù…ÙŠØ¯ØŒ Ø§Ù„Ø±ÙŠØªÙŠÙ†ÙˆÙ„ØŒ Ø­Ù…Ø¶ Ø§Ù„Ø³Ø§Ù„ÙŠØ³ÙŠÙ„ÙŠÙƒ...",
  },
  "Voir l'analyse dÃ©taillÃ©e de l'ingrÃ©dient": {
    en: "View the detailed ingredient analysis",
    ar: "Ø¹Ø±Ø¶ Ø§Ù„ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù…ÙØµÙ„ Ù„Ù„Ù…ÙƒÙˆÙ‘Ù†",
  },
  "AdaptÃ© aux dÃ©butants": {
    en: "Beginner-friendly",
    ar: "Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„Ù…Ø¨ØªØ¯Ø¦ÙŠÙ†",
  },
  "Peau Ã  tendance acnÃ©ique": {
    en: "Acne-prone skin",
    ar: "Ø¨Ø´Ø±Ø© Ù…Ø¹Ø±Ù‘Ø¶Ø© Ù„Ø­Ø¨ Ø§Ù„Ø´Ø¨Ø§Ø¨",
  },
  "Teint irrÃ©gulier": {
    en: "Uneven tone",
    ar: "Ù„ÙˆÙ† Ø¨Ø´Ø±Ø© ØºÙŠØ± Ù…ÙˆØ­Ø¯",
  },
  "Peau sujette aux rougeurs": {
    en: "Redness-prone skin",
    ar: "Ø¨Ø´Ø±Ø© Ù…Ø¹Ø±Ù‘Ø¶Ø© Ù„Ù„Ø§Ø­Ù…Ø±Ø§Ø±",
  },
  "Teint terne": {
    en: "Dull tone",
    ar: "Ù„ÙˆÙ† Ø¨Ø§Ù‡Øª",
  },
  "Peau texturÃ©e": {
    en: "Textured skin",
    ar: "Ø¨Ø´Ø±Ø© Ø°Ø§Øª Ù…Ù„Ù…Ø³ ØºÙŠØ± Ù…ØªØ¬Ø§Ù†Ø³",
  },
  "Exfoliation dÃ©butant": {
    en: "Beginner exfoliation",
    ar: "ØªÙ‚Ø´ÙŠØ± Ù„Ù„Ù…Ø¨ØªØ¯Ø¦ÙŠÙ†",
  },
  "Niacinamide": {
    en: "Niacinamide",
    ar: "Ù†ÙŠØ§Ø³ÙŠÙ†Ø§Ù…ÙŠØ¯",
  },
  "Acide hyaluronique": {
    en: "Hyaluronic acid",
    ar: "Ø­Ù…Ø¶ Ø§Ù„Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ",
  },
  "CÃ©ramides": {
    en: "Ceramides",
    ar: "Ø³ÙŠØ±Ø§Ù…ÙŠØ¯Ø§Øª",
  },
  "RÃ©tinol": {
    en: "Retinol",
    ar: "Ø±ÙŠØªÙŠÙ†ÙˆÙ„",
  },
  "Acides AHA/BHA": {
    en: "AHA/BHA acids",
    ar: "Ø£Ø­Ù…Ø§Ø¶ AHA/BHA",
  },
  "Acide salicylique": {
    en: "Salicylic acid",
    ar: "Ø­Ù…Ø¶ Ø§Ù„Ø³Ø§Ù„ÙŠØ³ÙŠÙ„ÙŠÙƒ",
  },
  "Vitamine C": {
    en: "Vitamin C",
    ar: "ÙÙŠØªØ§Ù…ÙŠÙ† C",
  },
  "Acides BHA": {
    en: "BHA acids",
    ar: "Ø£Ø­Ù…Ø§Ø¶ BHA",
  },
  "BarriÃ¨re": {
    en: "Barrier",
    ar: "Ø­Ø§Ø¬Ø² Ø§Ù„Ø¨Ø´Ø±Ø©",
  },
  "Apaisant": {
    en: "Soothing",
    ar: "Ù…Ù‡Ø¯Ø¦",
  },
  "Confort": {
    en: "Comfort",
    ar: "Ø±Ø§Ø­Ø©",
  },
  "RÃ©paration": {
    en: "Repair",
    ar: "Ø¥ØµÙ„Ø§Ø­",
  },
  "Pores": {
    en: "Pores",
    ar: "Ù…Ø³Ø§Ù…",
  },
  "Adoucissant": {
    en: "Softening",
    ar: "Ù…Ù„Ø·Ù",
  },
  "Page": {
    en: "Page",
    ar: "ØµÙØ­Ø©",
  },
  "PrÃ©cÃ©dent": {
    en: "Previous",
    ar: "Ø§Ù„Ø³Ø§Ø¨Ù‚",
  },
  "Suivant": {
    en: "Next",
    ar: "Ø§Ù„ØªØ§Ù„ÙŠ",
  },
  "Essayez un autre objectif ou affichez tous les produits.": {
    en: "Try another goal or view all products.",
    ar: "Ø¬Ø±Ù‘Ø¨ÙŠ Ù‡Ø¯ÙÙ‹Ø§ Ø¢Ø®Ø± Ø£Ùˆ Ø§Ø¹Ø±Ø¶ÙŠ ÙƒÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª.",
  },
  "RÃ©pondez Ã  quelques questions pour classer les produits selon votre peau. Vous pouvez ignorer cette Ã©tape et voir tout le catalogue.": {
    en: "Answer a few questions to rank products for your skin. You can skip this step and view the full catalog.",
    ar: "Ø£Ø¬ÙŠØ¨ÙŠ Ø¹Ù† Ø¨Ø¹Ø¶ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ù„ØªØ±ØªÙŠØ¨ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø­Ø³Ø¨ Ø¨Ø´Ø±ØªÙƒ. ÙŠÙ…ÙƒÙ†Ùƒ ØªØ®Ø·ÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ø®Ø·ÙˆØ© ÙˆØ±Ø¤ÙŠØ© Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬ ÙƒØ§Ù…Ù„Ù‹Ø§.",
  },
  "Objectif principal": {
    en: "Main goal",
    ar: "Ø§Ù„Ù‡Ø¯Ù Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
  },
  "Produit recherchÃ©": {
    en: "Product you need",
    ar: "Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨",
  },
  "IngrÃ©dients Ã  Ã©viter": {
    en: "Ingredients to avoid",
    ar: "Ù…ÙƒÙˆÙ†Ø§Øª ÙŠØ¬Ø¨ ØªØ¬Ù†Ø¨Ù‡Ø§",
  },
  "Parfum, alcohol denat, huiles essentielles...": {
    en: "Fragrance, alcohol denat, essential oils...",
    ar: "Ø¹Ø·Ø±ØŒ ÙƒØ­ÙˆÙ„ Ø¯ÙŠÙ†Ø§ØªØŒ Ø²ÙŠÙˆØª Ø¹Ø·Ø±ÙŠØ©...",
  },
  "Ignorer pour lâ€™instant": {
    en: "Skip for now",
    ar: "ØªØ®Ø·ÙŠ Ø§Ù„Ø¢Ù†",
  },
  "Voir mes recommandations": {
    en: "View my recommendations",
    ar: "Ø¹Ø±Ø¶ ØªÙˆØµÙŠØ§ØªÙŠ",
  },
  "Ã€ surveiller": {
    en: "Watch out",
    ar: "ÙŠØ¬Ø¨ Ø§Ù„Ø§Ù†ØªØ¨Ø§Ù‡",
  },
  "Sans parfum irritant dÃ©tectÃ©": {
    en: "No irritating fragrance detected",
    ar: "Ù„Ù… ÙŠØªÙ… Ø§ÙƒØªØ´Ø§Ù Ø¹Ø·Ø± Ù…Ù‡ÙŠÙ‘Ø¬",
  },
  "Score SkinorAI": {
    en: "SkinorAI score",
    ar: "ØªÙ‚ÙŠÙŠÙ… SkinorAI",
  },
  "Score global": {
    en: "Overall score",
    ar: "Ø§Ù„ØªÙ‚ÙŠÙŠÙ… Ø§Ù„Ø¹Ø§Ù…",
  },
  "Global": {
    en: "Overall",
    ar: "Ø¹Ø§Ù…",
  },
  "Voir": {
    en: "View",
    ar: "Ø¹Ø±Ø¶",
  },
  "Produit skincare classÃ© selon ses ingrÃ©dients, objectifs et types de peau.": {
    en: "Skincare product classified by ingredients, goals, and skin types.",
    ar: "Ù…Ù†ØªØ¬ Ø¹Ù†Ø§ÙŠØ© Ù…ØµÙ†Ù‘Ù Ø­Ø³Ø¨ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª ÙˆØ§Ù„Ø£Ù‡Ø¯Ø§Ù ÙˆØ£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¨Ø´Ø±Ø©.",
  },
  "Type": {
    en: "Type",
    ar: "Ø§Ù„Ù†ÙˆØ¹",
  },
  "AdaptÃ© pour": {
    en: "Suitable for",
    ar: "Ù…Ù†Ø§Ø³Ø¨ Ù„Ù€",
  },
  "IngrÃ©dients clÃ©s": {
    en: "Key ingredients",
    ar: "Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
  },
  "Pourquoi ce produit": {
    en: "Why this product",
    ar: "Ù„Ù…Ø§Ø°Ø§ Ù‡Ø°Ø§ Ø§Ù„Ù…Ù†ØªØ¬",
  },
  "Non renseignÃ©": {
    en: "Not specified",
    ar: "ØºÙŠØ± Ù…Ø°ÙƒÙˆØ±",
  },
  "TrÃ¨s bon": {
    en: "Very good",
    ar: "Ø¬ÙŠØ¯ Ø¬Ø¯Ù‹Ø§",
  },
  "Bon match": {
    en: "Good match",
    ar: "ØªÙˆØ§ÙÙ‚ Ø¬ÙŠØ¯",
  },
  "Ã€ vÃ©rifier": {
    en: "Check",
    ar: "ÙŠØ­ØªØ§Ø¬ Ù…Ø±Ø§Ø¬Ø¹Ø©",
  },
  "Peau mixte": {
    en: "Combination skin",
    ar: "Ø¨Ø´Ø±Ø© Ù…Ø®ØªÙ„Ø·Ø©",
  },
  "Peau normale": {
    en: "Normal skin",
    ar: "Ø¨Ø´Ø±Ø© Ø¹Ø§Ø¯ÙŠØ©",
  },
  "Anti-Ã¢ge": {
    en: "Anti-aging",
    ar: "Ù…Ù‚Ø§ÙˆÙ…Ø© Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªÙ‚Ø¯Ù…",
  },
  "ExcÃ¨s de sÃ©bum": {
    en: "Excess sebum",
    ar: "Ø¥ÙØ±Ø§Ø²Ø§Øª Ø¯Ù‡Ù†ÙŠØ© Ø²Ø§Ø¦Ø¯Ø©",
  },
  "Faible": {
    en: "Low",
    ar: "Ù…Ù†Ø®ÙØ¶Ø©",
  },
  "Moyenne": {
    en: "Medium",
    ar: "Ù…ØªÙˆØ³Ø·Ø©",
  },
  "Ã‰levÃ©e": {
    en: "High",
    ar: "Ù…Ø±ØªÙØ¹Ø©",
  },
  "Nettoyants": {
    en: "Cleansers",
    ar: "ØºØ³ÙˆÙ„Ø§Øª",
  },
  "SÃ©rums": {
    en: "Serums",
    ar: "Ø³ÙŠØ±ÙˆÙ…Ø§Øª",
  },
  "CrÃ¨mes": {
    en: "Creams",
    ar: "ÙƒØ±ÙŠÙ…Ø§Øª",
  },
  "Exfoliants": {
    en: "Exfoliants",
    ar: "Ù…Ù‚Ø´Ø±Ø§Øª",
  },
  "Traitements": {
    en: "Treatments",
    ar: "Ø¹Ù„Ø§Ø¬Ø§Øª",
  },
  "BibliothÃ¨que dâ€™ingrÃ©dients": {
    en: "Ingredient library",
    ar: "Ù…ÙƒØªØ¨Ø© Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
  },
  "PrÃªte Ã  mieux comprendre votre peau ?": {
    en: "Ready to understand your skin better?",
    ar: "Ù‡Ù„ Ø£Ù†ØªÙ Ù…Ø³ØªØ¹Ø¯Ø© Ù„ÙÙ‡Ù… Ø¨Ø´Ø±ØªÙƒ Ø¨Ø´ÙƒÙ„ Ø£ÙØ¶Ù„ØŸ",
  },
  "Scanner un produit": {
    en: "Scan a product",
    ar: "ÙØ­Øµ Ù…Ù†ØªØ¬",
  },
  "Scannez un produit pour analyser ses ingrÃ©dients et sa formule.": {
    en: "Scan a product to analyze its ingredients and formula.",
    ar: "Ø§ÙØ­ØµÙŠ Ù…Ù†ØªØ¬Ù‹Ø§ Ù„ØªØ­Ù„ÙŠÙ„ Ù…ÙƒÙˆÙ†Ø§ØªÙ‡ ÙˆØªØ±ÙƒÙŠØ¨ØªÙ‡.",
  },
  "Scan du visage": {
    en: "Face scan",
    ar: "ÙØ­Øµ Ø§Ù„ÙˆØ¬Ù‡",
  },
  "PREMIUM": {
    en: "PREMIUM",
    ar: "Ø¨Ø±ÙŠÙ…ÙŠÙˆÙ…",
  },
  "DÃ©codez les ingrÃ©dients et comprenez ce qui convient Ã  votre peau.": {
    en: "Decode ingredients and understand what suits your skin.",
    ar: "Ø§ÙÙ‡Ù…ÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª ÙˆÙ…Ø§ ÙŠÙ†Ø§Ø³Ø¨ Ø¨Ø´Ø±ØªÙƒ.",
  },
  "Analyseur dâ€™ingrÃ©dients": {
    en: "Ingredient analyzer",
    ar: "Ù…Ø­Ù„Ù„ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
  },
  "DÃ©codez les ingrÃ©dients, vÃ©rifiez les points Ã  surveiller et comprenez ce qui convient Ã  votre peau.": {
    en: "Decode ingredients, check watchouts, and understand what suits your skin.",
    ar: "Ø­Ù„Ù„ÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§ØªØŒ ÙˆØªØ­Ù‚Ù‚ÙŠ Ù…Ù…Ø§ ÙŠØ¬Ø¨ Ø§Ù„Ø§Ù†ØªØ¨Ø§Ù‡ Ù„Ù‡ØŒ ÙˆØ§ÙÙ‡Ù…ÙŠ Ù…Ø§ ÙŠÙ†Ø§Ø³Ø¨ Ø¨Ø´Ø±ØªÙƒ.",
  },
  "Coach routine": {
    en: "Routine coach",
    ar: "Ù…Ø¯Ø±Ø¨ Ø§Ù„Ø±ÙˆØªÙŠÙ†",
  },
  "Recevez des routines personnalisÃ©es selon vos objectifs peau.": {
    en: "Get personalized routines based on your skin goals.",
    ar: "Ø§Ø­ØµÙ„ÙŠ Ø¹Ù„Ù‰ Ø±ÙˆØªÙŠÙ†Ø§Øª Ù…Ø®ØµØµØ© Ø­Ø³Ø¨ Ø£Ù‡Ø¯Ø§Ù Ø¨Ø´Ø±ØªÙƒ.",
  },
  "Scanner produit": {
    en: "Product scanner",
    ar: "Ù…Ø§Ø³Ø­ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
  },
  "Scannez un produit et analysez sa formule.": {
    en: "Scan a product and analyze its formula.",
    ar: "Ø§ÙØ­ØµÙŠ Ù…Ù†ØªØ¬Ù‹Ø§ ÙˆØ­Ù„Ù„ÙŠ ØªØ±ÙƒÙŠØ¨ØªÙ‡.",
  },
  "Insights peau": {
    en: "Skin insights",
    ar: "Ø±Ø¤Ù‰ Ø§Ù„Ø¨Ø´Ø±Ø©",
  },
  "Suivez vos analyses et obtenez des insights plus prÃ©cis sur votre peau.": {
    en: "Track your analyses and get more precise insights about your skin.",
    ar: "ØªØ§Ø¨Ø¹ÙŠ ØªØ­Ù„ÙŠÙ„Ø§ØªÙƒ ÙˆØ§Ø­ØµÙ„ÙŠ Ø¹Ù„Ù‰ Ø±Ø¤Ù‰ Ø£Ø¯Ù‚ Ø­ÙˆÙ„ Ø¨Ø´Ø±ØªÙƒ.",
  },
  "FonctionnalitÃ© SkinorAI": {
    en: "SkinorAI feature",
    ar: "Ù…ÙŠØ²Ø© SkinorAI",
  },
  "Fermer la fenÃªtre": {
    en: "Close window",
    ar: "Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ù†Ø§ÙØ°Ø©",
  },
  "Illustration de lâ€™analyse des ingrÃ©dients": {
    en: "Ingredient analysis illustration",
    ar: "Ø±Ø³Ù… ØªÙˆØ¶ÙŠØ­ÙŠ Ù„ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
  },
  "Illustration du coach routine": {
    en: "Routine coach illustration",
    ar: "Ø±Ø³Ù… ØªÙˆØ¶ÙŠØ­ÙŠ Ù„Ù…Ø¯Ø±Ø¨ Ø§Ù„Ø±ÙˆØªÙŠÙ†",
  },
  "Illustration du scanner produit": {
    en: "Product scanner illustration",
    ar: "Ø±Ø³Ù… ØªÙˆØ¶ÙŠØ­ÙŠ Ù„Ù…Ø§Ø³Ø­ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
  },
  "Illustration des insights peau": {
    en: "Skin insights illustration",
    ar: "Ø±Ø³Ù… ØªÙˆØ¶ÙŠØ­ÙŠ Ù„Ø±Ø¤Ù‰ Ø§Ù„Ø¨Ø´Ø±Ø©",
  },
  "Collez ou scannez la liste dâ€™ingrÃ©dients dâ€™un produit de soin.": {
    en: "Paste or scan a skincare product ingredient list.",
    ar: "Ø§Ù„ØµÙ‚ÙŠ Ø£Ùˆ Ø§Ù…Ø³Ø­ÙŠ Ù‚Ø§Ø¦Ù…Ø© Ù…ÙƒÙˆÙ†Ø§Øª Ù…Ù†ØªØ¬ Ø§Ù„Ø¹Ù†Ø§ÙŠØ©.",
  },
  "Comprenez le rÃ´le de chaque ingrÃ©dient.": {
    en: "Understand the role of each ingredient.",
    ar: "Ø§ÙÙ‡Ù…ÙŠ Ø¯ÙˆØ± ÙƒÙ„ Ù…ÙƒÙˆÙ‘Ù†.",
  },
  "RepÃ©rez les ingrÃ©dients pouvant irriter les peaux sensibles.": {
    en: "Spot ingredients that may irritate sensitive skin.",
    ar: "Ø§ÙƒØªØ´ÙÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„ØªÙŠ Ù‚Ø¯ ØªÙ‡ÙŠÙ‘Ø¬ Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø­Ø³Ø§Ø³Ø©.",
  },
  "Obtenez une explication claire, sans jargon INCI compliquÃ©.": {
    en: "Get a clear explanation without complicated INCI jargon.",
    ar: "Ø§Ø­ØµÙ„ÙŠ Ø¹Ù„Ù‰ Ø´Ø±Ø­ ÙˆØ§Ø¶Ø­ Ø¨Ø¯ÙˆÙ† Ù…ØµØ·Ù„Ø­Ø§Øª INCI Ù…Ø¹Ù‚Ø¯Ø©.",
  },
  "Analyser les ingrÃ©dients": {
    en: "Analyze ingredients",
    ar: "ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
  },
  "Construisez une routine simple pour le matin ou le soir.": {
    en: "Build a simple morning or evening routine.",
    ar: "Ø§Ø¨Ù†ÙŠ Ø±ÙˆØªÙŠÙ†Ù‹Ø§ Ø¨Ø³ÙŠØ·Ù‹Ø§ Ù„Ù„ØµØ¨Ø§Ø­ Ø£Ùˆ Ø§Ù„Ù…Ø³Ø§Ø¡.",
  },
  "Sachez quel produit appliquer en premier, ensuite et en dernier.": {
    en: "Know which product to apply first, next, and last.",
    ar: "Ø§Ø¹Ø±ÙÙŠ Ø£ÙŠ Ù…Ù†ØªØ¬ ÙŠÙØ·Ø¨Ù‚ Ø£ÙˆÙ„Ù‹Ø§ Ø«Ù… Ø¨Ø¹Ø¯Ù‡ Ø«Ù… Ø£Ø®ÙŠØ±Ù‹Ø§.",
  },
  "Ã‰vitez de mÃ©langer trop dâ€™actifs puissants.": {
    en: "Avoid mixing too many strong actives.",
    ar: "ØªØ¬Ù†Ø¨ÙŠ Ø®Ù„Ø· Ø§Ù„ÙƒØ«ÙŠØ± Ù…Ù† Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø© Ø§Ù„Ù‚ÙˆÙŠØ©.",
  },
  "Recevez des rappels sur le SPF et la frÃ©quence dâ€™utilisation.": {
    en: "Get reminders about SPF and usage frequency.",
    ar: "Ø§Ø­ØµÙ„ÙŠ Ø¹Ù„Ù‰ ØªØ°ÙƒÙŠØ±Ø§Øª Ø­ÙˆÙ„ ÙˆØ§Ù‚ÙŠ Ø§Ù„Ø´Ù…Ø³ ÙˆØªÙƒØ±Ø§Ø± Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù….",
  },
  "Importez une photo claire de lâ€™Ã©tiquette du produit.": {
    en: "Upload a clear photo of the product label.",
    ar: "Ø§Ø±ÙØ¹ÙŠ ØµÙˆØ±Ø© ÙˆØ§Ø¶Ø­Ø© Ù„Ù…Ù„ØµÙ‚ Ø§Ù„Ù…Ù†ØªØ¬.",
  },
  "Extrayez automatiquement les ingrÃ©dients grÃ¢ce Ã  lâ€™OCR.": {
    en: "Automatically extract ingredients with OCR.",
    ar: "Ø§Ø³ØªØ®Ø±Ø¬ÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª ØªÙ„Ù‚Ø§Ø¦ÙŠÙ‹Ø§ Ø¹Ø¨Ø± OCR.",
  },
  "Corrigez la liste dÃ©tectÃ©e avant lâ€™analyse.": {
    en: "Correct the detected list before analysis.",
    ar: "ØµØ­Ø­ÙŠ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…ÙƒØªØ´ÙØ© Ù‚Ø¨Ù„ Ø§Ù„ØªØ­Ù„ÙŠÙ„.",
  },
  "Recevez un score, un verdict, des points forts et des ingrÃ©dients Ã  surveiller.": {
    en: "Get a score, verdict, strengths, and ingredients to watch.",
    ar: "Ø§Ø­ØµÙ„ÙŠ Ø¹Ù„Ù‰ ØªÙ‚ÙŠÙŠÙ… ÙˆØ­ÙƒÙ… ÙˆÙ†Ù‚Ø§Ø· Ù‚ÙˆØ© ÙˆÙ…ÙƒÙˆÙ†Ø§Øª ÙŠØ¬Ø¨ Ø§Ù„Ø§Ù†ØªØ¨Ø§Ù‡ Ù„Ù‡Ø§.",
  },
  "Comprenez les tendances dans vos produits scannÃ©s.": {
    en: "Understand trends in your scanned products.",
    ar: "Ø§ÙÙ‡Ù…ÙŠ Ø§Ù„Ø§ØªØ¬Ø§Ù‡Ø§Øª ÙÙŠ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„ØªÙŠ ÙØ­ØµØªÙ‡Ø§.",
  },
  "Identifiez les ingrÃ©dients qui correspondent le plus souvent Ã  vos objectifs peau.": {
    en: "Identify ingredients that most often match your skin goals.",
    ar: "Ø­Ø¯Ø¯ÙŠ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„ØªÙŠ ØªÙ†Ø§Ø³Ø¨ Ø£Ù‡Ø¯Ø§Ù Ø¨Ø´Ø±ØªÙƒ ØºØ§Ù„Ø¨Ù‹Ø§.",
  },
  "RepÃ©rez ce que votre peau semble mieux tolÃ©rer.": {
    en: "Spot what your skin seems to tolerate best.",
    ar: "Ø§ÙƒØªØ´ÙÙŠ Ù…Ø§ ÙŠØ¨Ø¯Ùˆ Ø£Ù† Ø¨Ø´Ø±ØªÙƒ ØªØªØ­Ù…Ù„Ù‡ Ø¨Ø´ÙƒÙ„ Ø£ÙØ¶Ù„.",
  },
  "PrÃ©parez des recommandations plus intelligentes avec le temps.": {
    en: "Build smarter recommendations over time.",
    ar: "Ø­Ø¶Ù‘Ø±ÙŠ ØªÙˆØµÙŠØ§Øª Ø£Ø°ÙƒÙ‰ Ù…Ø¹ Ø§Ù„ÙˆÙ‚Øª.",
  },
  "AperÃ§u du scan du visage": {
    en: "Face scan preview",
    ar: "Ù…Ø¹Ø§ÙŠÙ†Ø© ÙØ­Øµ Ø§Ù„ÙˆØ¬Ù‡",
  },
  "BientÃ´t disponible": {
    en: "Coming soon",
    ar: "Ù‚Ø±ÙŠØ¨Ù‹Ø§",
  },
  "Le scan du visage arrive bientÃ´t": {
    en: "Face scan is coming soon",
    ar: "ÙØ­Øµ Ø§Ù„ÙˆØ¬Ù‡ Ù‚Ø§Ø¯Ù… Ù‚Ø±ÙŠØ¨Ù‹Ø§",
  },
  "BientÃ´t, SkinorAI aidera les utilisateurs Ã  scanner leur visage, comprendre les prÃ©occupations visibles de la peau et recevoir des conseils plus personnalisÃ©s.": {
    en: "Soon, SkinorAI will help users scan their face, understand visible skin concerns, and receive more personalized advice.",
    ar: "Ù‚Ø±ÙŠØ¨Ù‹Ø§ØŒ Ø³ÙŠØ³Ø§Ø¹Ø¯ SkinorAI Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ø¹Ù„Ù‰ ÙØ­Øµ Ø§Ù„ÙˆØ¬Ù‡ ÙˆÙÙ‡Ù… Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø¸Ø§Ù‡Ø±Ø© ÙˆØ§Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ù†ØµØ§Ø¦Ø­ Ø£ÙƒØ«Ø± ØªØ®ØµÙŠØµÙ‹Ø§.",
  },
  "Analyser les prÃ©occupations visibles grÃ¢ce Ã  un scan guidÃ© du visage.": {
    en: "Analyze visible concerns with a guided face scan.",
    ar: "ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¸Ø§Ù‡Ø±Ø© Ø¹Ø¨Ø± ÙØ­Øµ Ù…ÙˆØ¬Ù‡ Ù„Ù„ÙˆØ¬Ù‡.",
  },
  "AmÃ©liorer les recommandations selon lâ€™apparence de la peau et les objectifs.": {
    en: "Improve recommendations based on skin appearance and goals.",
    ar: "ØªØ­Ø³ÙŠÙ† Ø§Ù„ØªÙˆØµÙŠØ§Øª Ø­Ø³Ø¨ Ù…Ø¸Ù‡Ø± Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ§Ù„Ø£Ù‡Ø¯Ø§Ù.",
  },
  "Combiner les scans produits avec des insights peau personnalisÃ©s.": {
    en: "Combine product scans with personalized skin insights.",
    ar: "Ø¯Ù…Ø¬ ÙØ­ÙˆØµØ§Øª Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ù…Ø¹ Ø±Ø¤Ù‰ Ù…Ø®ØµØµØ© Ù„Ù„Ø¨Ø´Ø±Ø©.",
  },
  "Compris": {
    en: "Got it",
    ar: "ÙÙ‡Ù…Øª",
  },
};

const ignoredTags = new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CODE",
  "PRE",
]);

const WINDOWS_1252_BYTE_OVERRIDES = new Map<number, number>([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84], [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87],
  [0x02c6, 0x88], [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c], [0x017d, 0x8e],
  [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93], [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b], [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

function countEncodingArtifacts(value: string) {
  return (value.match(/[\u00c3\u00c2\u00e2\u00d8\u00d9\u00c5\u00d0\ufffd]/g) ?? []).length + (value.match(/\u00ef\u00bf\u00bd/g) ?? []).length * 3;
}

function countReplacementCharacters(value: string) {
  return (value.match(/[\ufffd]/g) ?? []).length + (value.match(/\u00ef\u00bf\u00bd/g) ?? []).length;
}

function encodeWindows1252(value: string) {
  const bytes: number[] = [];

  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 0xff) {
      bytes.push(code);
    } else if (WINDOWS_1252_BYTE_OVERRIDES.has(code)) {
      bytes.push(WINDOWS_1252_BYTE_OVERRIDES.get(code)!);
    } else {
      return null;
    }
  }

  return Uint8Array.from(bytes);
}

function normalizeEncodedText(value: string) {
  const knownRepairs: Record<string, string> = {
    "Pr\u00ef\u00bf\u00bdte \u00ef\u00bf\u00bd mieux comprendre votre peau ?": "Pr\u00eate \u00e0 mieux comprendre votre peau ?",
  };

  let normalized = knownRepairs[value] ?? value;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (countEncodingArtifacts(normalized) === 0) {
      break;
    }

    const bytes = encodeWindows1252(normalized);
    if (!bytes) {
      break;
    }

    const decoded = new TextDecoder("utf-8").decode(bytes);
    if (
      countEncodingArtifacts(decoded) < countEncodingArtifacts(normalized) &&
      countReplacementCharacters(decoded) <= countReplacementCharacters(normalized)
    ) {
      normalized = decoded;
    } else {
      break;
    }
  }

  return normalized;
}

function addPhraseTranslation(map: Map<string, string>, source: string, target: string) {
  const normalizedSource = normalizeEncodedText(source.trim());
  const normalizedTarget = normalizeEncodedText(target);

  map.set(source.trim(), normalizedTarget);
  map.set(normalizedSource, normalizedTarget);
}

function buildPhraseMap(locale: Locale) {
  const map = new Map<string, string>();

  Object.keys(dictionaries.fr).forEach((key) => {
    locales.forEach((sourceLocale) => {
      const source = dictionaries[sourceLocale][key];
      const target = dictionaries[locale][key];

      if (source && target) {
        addPhraseTranslation(map, source, target);
      }
    });
  });

  Object.entries(aliasKeys).forEach(([source, key]) => {
    const target = dictionaries[locale][key] ?? source;
    addPhraseTranslation(map, source, target);
  });

  Object.entries(phraseTranslations).forEach(([source, translations]) => {
    addPhraseTranslation(map, source, translations[locale] ?? source);
  });

  return map;
}

function translateTextValue(value: string, phraseMap: Map<string, string>) {
  const normalizedValue = normalizeEncodedText(value);
  const trimmed = normalizedValue.trim();
  if (!trimmed) return normalizedValue;

  const translated = phraseMap.get(trimmed);
  if (translated && translated !== trimmed) {
    return normalizedValue.replace(trimmed, translated);
  }

  const translatedValue = Array.from(phraseMap.entries())
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((message, [source, target]) => {
      if (!source || source === target || !message.includes(source)) {
        return message;
      }

      return message.replaceAll(source, target);
    }, normalizedValue);

  return normalizeEncodedText(translatedValue);
}

export function translateStaticText(value: string, locale: Locale) {
  return translateTextValue(value, buildPhraseMap(locale));
}

function translateNodeText(root: ParentNode, phraseMap: Map<string, string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const parent = node.parentElement;

    if (parent && !ignoredTags.has(parent.tagName)) {
      const translated = translateTextValue(node.textContent ?? "", phraseMap);
      if (translated !== node.textContent) {
        node.textContent = translated;
      }
    }

    node = walker.nextNode();
  }
}

function translateAttributes(root: ParentNode, phraseMap: Map<string, string>) {
  if (!(root instanceof Element || root instanceof Document)) return;

  const elements =
    root instanceof Element ? [root, ...Array.from(root.querySelectorAll("*"))] : Array.from(root.querySelectorAll("*"));

  elements.forEach((element) => {
    ["aria-label", "alt", "title", "placeholder"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;

      const translated = translateTextValue(value, phraseMap);
      if (translated !== value) {
        element.setAttribute(attribute, translated);
      }
    });
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY);
    const timeoutId = window.setTimeout(() => {
      if (isLocale(savedLocale)) setLocaleState(savedLocale);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback(
    (key: string) => dictionaries[locale][key] ?? dictionaries.fr[key] ?? key,
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
