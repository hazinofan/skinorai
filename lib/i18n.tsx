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
    "language.french": "Français",
    "language.english": "English",
    "language.arabic": "العربية",
    "language.label": "Langue",
    "nav.home": "Accueil",
    "nav.products": "Produits",
    "nav.ingredients": "Ingrédients",
    "nav.pricing": "Tarifs",
    "nav.scanCta": "Commencer le scan",
    "nav.scanShort": "Scanner",
    "nav.openMenu": "Ouvrir le menu",
    "nav.closeMenu": "Fermer le menu",
    "nav.account": "Compte de {name}",
    "nav.settings": "Paramètres",
    "nav.logout": "Se déconnecter",
    "nav.login": "Se connecter",
    "hero.title": "Révélez tout le potentiel de votre peau",
    "hero.text": "Notre IA analyse votre visage et identifie les points à améliorer",
    "hero.cta": "Analyser ma peau",
    "hero.stat.accuracyValue": "95 %",
    "hero.stat.accuracy": "d’analyse cutanée précise",
    "hero.stat.concernsValue": "30+",
    "hero.stat.concerns": "problématiques de peau analysées",
    "hero.stat.routineValue": "7 jours",
    "hero.stat.routine": "de routine personnalisée",
    "how.imageAlt": "Analyse skincare personnalisée avec SkinorAI",
    "how.label.analyze": "ANALYSER",
    "how.label.hydrate": "HYDRATER",
    "how.label.understand": "COMPRENDRE",
    "how.title": "AI Skincare",
    "how.text": "SkinorAI ne promet pas la perfection. Il analyse, apprend et adapte ses recommandations à votre type de peau, vos objectifs et les produits que vous utilisez.",
    "how.outroTitle": "Une beauté plus consciente",
    "how.outroText": "Nous ne pouvons pas arrêter le temps, mais nous pouvons vous aider à mieux comprendre votre peau, choisir vos produits et construire une routine plus adaptée.",
    "scan.badge": "Scanner d'ingrédients intelligent",
    "scan.title": "Scannez l'étiquette.",
    "scan.titleAccent": "Comprenez la formule.",
    "scan.text": "Importez l'étiquette d'un produit skincare et laissez SkinorAI identifier les ingrédients, expliquer leurs bienfaits et révéler les points auxquels votre peau doit faire attention.",
    "scan.cta": "Scanner un produit",
    "scan.imageAlt": "Produit skincare en cours d'analyse",
    "scan.reading": "Lecture de la formule",
    "scan.compatibility": "Compatibilité cutanée",
    "scan.hyaluronic": "Acide hyaluronique",
    "scan.hydration": "Hydratation intense",
    "scan.niacinamide": "Niacinamide",
    "scan.niacinamideDetail": "Soutien de la barrière cutanée",
    "scan.panthenol": "Panthénol",
    "scan.panthenolDetail": "Apaisant",
    "scan.barrier": "Formule respectueuse de la barrière cutanée",
    "scan.hydrationSupport": "Hydratation soutenue",
    "scan.fragrance": "Parfum détecté",
    "scan.recommendedFor": "Recommandé pour",
    "scan.skinType": "Peau normale à sèche",
    "scan.scroll": "Défilez pour scanner",
    "library.productsEyebrow": "Page produits",
    "library.productsTitle": "Explorez les produits skincare en un coup d'oeil.",
    "library.productsText": "La page produits permet de parcourir les nettoyants, sérums, crèmes et soins ciblés avant d'ouvrir une fiche détaillée. La galerie circulaire rend la comparaison plus fluide, visuelle et intuitive.",
    "library.productsCta": "Voir tous les produits",
    "library.ingredientsEyebrow": "Bibliothèque d'ingrédients",
    "library.ingredientsTitle": "Transformez les formules en bibliothèque visuelle claire.",
    "library.ingredientsText": "La bibliothèque d'ingrédients aide les utilisateurs à relier chaque produit aux actifs qu'il contient. Le masonry garde une vue riche et dynamique, tout en restant simple à explorer par bénéfice, préoccupation ou étape de routine.",
    "library.ingredientsCta": "Voir tous les ingrédients",
    "testimonials.title": "Les réponses que vous cherchez avant de choisir un soin.",
    "testimonials.intro": "Découvrez comment SkinorAI aide ses utilisateurs à mieux comprendre leurs produits et à construire une routine plus claire.",
    "testimonials.how": "Comment fonctionne SkinorAI",
    "testimonials.note": "Les témoignages présentés peuvent être remplacés par les retours vérifiés de vos utilisateurs après le lancement.",
    "testimonials.cta": "Analyser mon produit",
    "testimonials.01.question": "Est-ce que SkinorAI comprend vraiment les ingrédients ?",
    "testimonials.01.answer": "SkinorAI transforme les listes INCI complexes en explications simples. Il identifie le rôle des ingrédients, leurs bénéfices potentiels et les points auxquels vous devez faire attention selon votre peau.",
    "testimonials.01.quote": "Je regardais toujours les ingrédients sans rien comprendre. Maintenant, je sais enfin pourquoi un produit me convient ou non.",
    "testimonials.01.profile": "Peau mixte et sensible",
    "testimonials.02.question": "Les recommandations sont-elles personnalisées ?",
    "testimonials.02.answer": "Oui. L'analyse prend en compte votre type de peau, vos préoccupations, vos sensibilités et l'objectif que vous souhaitez atteindre, comme l'hydratation, les imperfections ou les rougeurs.",
    "testimonials.02.quote": "L'analyse ne m'a pas donné une réponse générique. Elle a vraiment pris en compte ma peau sensible et mes rougeurs.",
    "testimonials.02.profile": "Peau sèche avec rougeurs",
    "testimonials.03.question": "Puis-je analyser les produits que je possède déjà ?",
    "testimonials.03.answer": "Vous pouvez importer une photo claire de la liste d'ingrédients présente sur l'emballage. SkinorAI extrait les ingrédients et vous permet de les vérifier avant de lancer l'analyse.",
    "testimonials.03.quote": "J'ai scanné plusieurs produits de ma routine et découvert que deux soins avaient presque la même fonction.",
    "testimonials.03.profile": "Routine anti-imperfections",
    "testimonials.04.question": "SkinorAI peut-il m'aider à éviter les mauvais achats ?",
    "testimonials.04.answer": "SkinorAI vous aide à évaluer un produit avant de l'acheter. Vous pouvez comprendre s'il correspond à vos objectifs, s'il contient des ingrédients potentiellement irritants et s'il apporte réellement quelque chose à votre routine.",
    "testimonials.04.quote": "Avant, j'achetais selon les vidéos sur les réseaux sociaux. Maintenant, je vérifie le produit avant de dépenser.",
    "testimonials.04.profile": "Peau grasse à tendance acnéique",
    "testimonials.05.question": "Est-ce que SkinorAI remplace un dermatologue ?",
    "testimonials.05.answer": "Non. SkinorAI fournit des informations éducatives et des recommandations générales sur les produits cosmétiques. Il ne pose aucun diagnostic et ne remplace pas l'avis d'un professionnel de santé.",
    "testimonials.05.quote": "J'aime que les réponses restent claires et prudentes, sans prétendre remplacer un professionnel.",
    "testimonials.05.profile": "Peau réactive",
    "footer.description": "Comprenez les ingrédients de vos soins et trouvez les produits les plus adaptés à votre peau.",
    "footer.scan": "Analyser un produit",
    "footer.navigation": "Navigation",
    "footer.productsLibrary": "Bibliothèque de produits",
    "footer.ingredientsLibrary": "Bibliothèque d’ingrédients",
    "footer.ai": "Analyse assistée par IA",
    "footer.rights": "© {year} SkinorAI. Tous droits réservés.",
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
    "footer.rights": "© {year} SkinorAI. All rights reserved.",
    "footer.disclaimer": "Analyses are informational and do not replace dermatological advice.",
  },
  ar: {
    "language.french": "الفرنسية",
    "language.english": "الإنجليزية",
    "language.arabic": "العربية",
    "language.label": "اللغة",
    "nav.home": "الرئيسية",
    "nav.products": "المنتجات",
    "nav.ingredients": "المكونات",
    "nav.pricing": "الأسعار",
    "nav.scanCta": "ابدأ الفحص",
    "nav.scanShort": "فحص",
    "nav.openMenu": "فتح القائمة",
    "nav.closeMenu": "إغلاق القائمة",
    "nav.account": "حساب {name}",
    "nav.settings": "الإعدادات",
    "nav.logout": "تسجيل الخروج",
    "nav.login": "تسجيل الدخول",
    "hero.title": "اكشفي الإمكانات الكاملة لبشرتك",
    "hero.text": "يقوم الذكاء الاصطناعي بتحليل وجهك وتحديد النقاط التي يمكن تحسينها",
    "hero.cta": "حللي بشرتي",
    "hero.stat.accuracyValue": "95%",
    "hero.stat.accuracy": "تحليل دقيق للبشرة",
    "hero.stat.concernsValue": "+30",
    "hero.stat.concerns": "مشكلة جلدية تم تحليلها",
    "hero.stat.routineValue": "7 أيام",
    "hero.stat.routine": "روتين مخصص",
    "how.imageAlt": "تحليل عناية بالبشرة مخصص مع SkinorAI",
    "how.label.analyze": "تحليل",
    "how.label.hydrate": "ترطيب",
    "how.label.understand": "فهم",
    "how.title": "العناية بالبشرة بالذكاء الاصطناعي",
    "how.text": "لا يعد SkinorAI بالكمال. إنه يحلل ويتعلم ويكيف توصياته حسب نوع بشرتك وأهدافك والمنتجات التي تستخدمينها.",
    "how.outroTitle": "جمال بوعي أكبر",
    "how.outroText": "لا يمكننا إيقاف الزمن، لكن يمكننا مساعدتك على فهم بشرتك بشكل أفضل، واختيار منتجاتك، وبناء روتين أنسب لك.",
    "scan.badge": "ماسح ذكي للمكونات",
    "scan.title": "امسحي الملصق.",
    "scan.titleAccent": "وافهمي التركيبة.",
    "scan.text": "ارفعي ملصق منتج العناية بالبشرة ودعي SkinorAI يحدد المكونات، يشرح فوائدها، ويوضح ما يجب أن تنتبه له بشرتك.",
    "scan.cta": "فحص منتج",
    "scan.imageAlt": "منتج عناية بالبشرة قيد التحليل",
    "scan.reading": "قراءة التركيبة",
    "scan.compatibility": "توافق البشرة",
    "scan.hyaluronic": "حمض الهيالورونيك",
    "scan.hydration": "ترطيب عميق",
    "scan.niacinamide": "نياسيناميد",
    "scan.niacinamideDetail": "دعم حاجز البشرة",
    "scan.panthenol": "بانثينول",
    "scan.panthenolDetail": "مهدئ",
    "scan.barrier": "تركيبة لطيفة على حاجز البشرة",
    "scan.hydrationSupport": "دعم قوي للترطيب",
    "scan.fragrance": "تم اكتشاف عطر",
    "scan.recommendedFor": "مناسب لـ",
    "scan.skinType": "البشرة العادية إلى الجافة",
    "scan.scroll": "مرري للفحص",
    "library.productsEyebrow": "صفحة المنتجات",
    "library.productsTitle": "استكشفي منتجات العناية بالبشرة بلمحة واحدة.",
    "library.productsText": "تتيح صفحة المنتجات تصفح الغسولات والسيرومات والكريمات والعلاجات المستهدفة قبل فتح تفاصيل المنتج. تجعل المعرض الدائري المقارنة أكثر سلاسة ووضوحا.",
    "library.productsCta": "عرض كل المنتجات",
    "library.ingredientsEyebrow": "مكتبة المكونات",
    "library.ingredientsTitle": "حوّلي التركيبات إلى مكتبة بصرية واضحة.",
    "library.ingredientsText": "تساعد مكتبة المكونات المستخدمين على ربط كل منتج بالمكونات الفعالة التي يحتويها. يحافظ عرض الماسونري على تجربة غنية وسهلة حسب الفائدة أو المشكلة أو خطوة الروتين.",
    "library.ingredientsCta": "عرض كل المكونات",
    "testimonials.title": "الإجابات التي تحتاجينها قبل اختيار منتج عناية.",
    "testimonials.intro": "اكتشفي كيف يساعد SkinorAI المستخدمين على فهم منتجاتهم وبناء روتين أوضح.",
    "testimonials.how": "كيف يعمل SkinorAI",
    "testimonials.note": "يمكن استبدال هذه الشهادات بتعليقات مستخدمين موثقة بعد الإطلاق.",
    "testimonials.cta": "حللي منتجي",
    "testimonials.01.question": "هل يفهم SkinorAI المكونات حقا؟",
    "testimonials.01.answer": "يحوّل SkinorAI قوائم INCI المعقدة إلى شروحات بسيطة. يحدد دور كل مكون وفوائده المحتملة والنقاط التي يجب الانتباه لها حسب بشرتك.",
    "testimonials.01.quote": "كنت أنظر إلى المكونات دون أن أفهم شيئا. الآن أعرف أخيرا لماذا يناسبني منتج ما أو لا.",
    "testimonials.01.profile": "بشرة مختلطة وحساسة",
    "testimonials.02.question": "هل التوصيات مخصصة؟",
    "testimonials.02.answer": "نعم. يأخذ التحليل نوع بشرتك ومشاكلك وحساسياتك والهدف الذي تريدين تحقيقه بعين الاعتبار، مثل الترطيب أو الحبوب أو الاحمرار.",
    "testimonials.02.quote": "لم يعطني التحليل إجابة عامة. لقد أخذ بشرتي الحساسة والاحمرار بعين الاعتبار فعلا.",
    "testimonials.02.profile": "بشرة جافة مع احمرار",
    "testimonials.03.question": "هل يمكنني تحليل المنتجات التي أملكها بالفعل؟",
    "testimonials.03.answer": "يمكنك رفع صورة واضحة لقائمة المكونات على العبوة. يستخرج SkinorAI المكونات ويتيح لك مراجعتها قبل بدء التحليل.",
    "testimonials.03.quote": "فحصت عدة منتجات من روتيني واكتشفت أن منتجين لهما تقريبا نفس الوظيفة.",
    "testimonials.03.profile": "روتين مضاد للشوائب",
    "testimonials.04.question": "هل يمكن أن يساعدني SkinorAI على تجنب المشتريات غير المناسبة؟",
    "testimonials.04.answer": "يساعدك SkinorAI على تقييم المنتج قبل شرائه. يمكنك فهم ما إذا كان يناسب أهدافك، أو يحتوي على مكونات قد تهيج البشرة، أو يضيف شيئا حقيقيا إلى روتينك.",
    "testimonials.04.quote": "سابقا كنت أشتري حسب فيديوهات الشبكات الاجتماعية. الآن أتحقق من المنتج قبل أن أدفع.",
    "testimonials.04.profile": "بشرة دهنية معرضة للحبوب",
    "testimonials.05.question": "هل يعوض SkinorAI طبيب الجلدية؟",
    "testimonials.05.answer": "لا. يقدم SkinorAI معلومات تعليمية وتوصيات عامة حول منتجات التجميل. لا يقدم تشخيصا ولا يعوض نصيحة الطبيب.",
    "testimonials.05.quote": "أحب أن تبقى الإجابات واضحة وحذرة دون أن تدعي أنها تعوض المختص.",
    "testimonials.05.profile": "بشرة تفاعلية",
    "footer.description": "افهمي مكونات منتجات العناية الخاصة بك واعثري على المنتجات الأنسب لبشرتك.",
    "footer.scan": "تحليل منتج",
    "footer.navigation": "التنقل",
    "footer.productsLibrary": "مكتبة المنتجات",
    "footer.ingredientsLibrary": "مكتبة المكونات",
    "footer.ai": "تحليل بمساعدة الذكاء الاصطناعي",
    "footer.rights": "© {year} SkinorAI. جميع الحقوق محفوظة.",
    "footer.disclaimer": "التحليلات معلوماتية ولا تغني عن استشارة طبيب الجلدية.",
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
  "Ingrédients": "nav.ingredients",
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
    ar: "فحص جديد",
  },
  "Rechercher un scan...": {
    en: "Search a scan...",
    ar: "ابحثي عن فحص...",
  },
  "Historique": {
    en: "History",
    ar: "السجل",
  },
  "Chargement de l historique...": {
    en: "Loading history...",
    ar: "جارٍ تحميل السجل...",
  },
  "Choisissez votre objectif peau": {
    en: "Choose your skin goal",
    ar: "اختاري هدف بشرتك",
  },
  "Selectionnez votre priorite du moment pour personnaliser l analyse.": {
    en: "Select your current priority to personalize the analysis.",
    ar: "حددي أولويتك الحالية لتخصيص التحليل.",
  },
  "Objectif peau": {
    en: "Skin goal",
    ar: "هدف البشرة",
  },
  "Acne & imperfections": {
    en: "Acne & blemishes",
    ar: "حبوب وعيوب",
  },
  "Reparation de la barriere": {
    en: "Barrier repair",
    ar: "إصلاح الحاجز",
  },
  "Routine du matin": {
    en: "Morning routine",
    ar: "روتين الصباح",
  },
  "Routine du soir": {
    en: "Evening routine",
    ar: "روتين المساء",
  },
  "hydrater et repulper": {
    en: "hydrate and plump",
    ar: "الترطيب والامتلاء",
  },
  "cibler les imperfections": {
    en: "target blemishes",
    ar: "استهداف العيوب",
  },
  "renforcer la barriere cutanee": {
    en: "strengthen the skin barrier",
    ar: "تقوية حاجز البشرة",
  },
  "apaiser les rougeurs": {
    en: "soothe redness",
    ar: "تهدئة الاحمرار",
  },
  "equilibrer l exces de sebum": {
    en: "balance excess sebum",
    ar: "موازنة الإفرازات الدهنية الزائدة",
  },
  "optimiser la routine du matin": {
    en: "optimize the morning routine",
    ar: "تحسين روتين الصباح",
  },
  "optimiser la routine du soir": {
    en: "optimize the evening routine",
    ar: "تحسين روتين المساء",
  },
  "cibler les peaux sensibles": {
    en: "target sensitive skin",
    ar: "مراعاة البشرة الحساسة",
  },
  "Scannez un produit dans la conversation": {
    en: "Scan a product in the conversation",
    ar: "افحصي منتجًا داخل المحادثة",
  },
  "Ajoutez une photo ou collez les ingrédients, confirmez votre objectif peau, puis l'analyse sera enregistrée comme discussion.": {
    en: "Add a photo or paste the ingredients, confirm your skin goal, then the analysis will be saved as a conversation.",
    ar: "أضيفي صورة أو الصقي المكونات، أكدي هدف بشرتك، ثم سيُحفظ التحليل كمحادثة.",
  },
  "Annuler": {
    en: "Cancel",
    ar: "إلغاء",
  },
  "Produit sélectionné": {
    en: "Selected product",
    ar: "المنتج المحدد",
  },
  "Importer une photo de l'étiquette": {
    en: "Upload a label photo",
    ar: "حمّلي صورة الملصق",
  },
  "Extraction des informations visibles...": {
    en: "Extracting visible information...",
    ar: "جارٍ استخراج المعلومات الظاهرة...",
  },
  "Vérifiez les ingrédients détectés avant de lancer l'analyse.": {
    en: "Check the detected ingredients before starting the analysis.",
    ar: "راجعي المكونات المكتشفة قبل بدء التحليل.",
  },
  "Vous pouvez aussi coller directement la liste INCI ci-dessous.": {
    en: "You can also paste the INCI list directly below.",
    ar: "يمكنك أيضًا لصق قائمة INCI مباشرة أدناه.",
  },
  "Liste complète": {
    en: "Full list",
    ar: "القائمة الكاملة",
  },
  "Liste partielle": {
    en: "Partial list",
    ar: "قائمة جزئية",
  },
  "Ingrédients confirmés": {
    en: "Confirmed ingredients",
    ar: "المكونات المؤكدة",
  },
  "Collez les ingrédients ici, séparés par des virgules.": {
    en: "Paste the ingredients here, separated by commas.",
    ar: "الصقي المكونات هنا، مفصولة بفواصل.",
  },
  "Préférence chargée depuis vos paramètres.": {
    en: "Preference loaded from your settings.",
    ar: "تم تحميل التفضيل من إعداداتك.",
  },
  "Choisissez une fois, vous pourrez la changer dans Paramètres.": {
    en: "Choose once, you can change it later in Settings.",
    ar: "اختاري مرة واحدة، ويمكنك تغييرها لاحقًا من الإعدادات.",
  },
  "Analyse en cours...": {
    en: "Analysis in progress...",
    ar: "جارٍ التحليل...",
  },
  "Analyser dans la conversation": {
    en: "Analyze in the conversation",
    ar: "حللي داخل المحادثة",
  },
  "Le résultat sera enregistré et ouvert comme une discussion.": {
    en: "The result will be saved and opened as a conversation.",
    ar: "سيُحفظ الناتج ويُفتح كمحادثة.",
  },
  "Nouveau produit": {
    en: "New product",
    ar: "منتج جديد",
  },
  "Produits recommandés": {
    en: "Recommended products",
    ar: "منتجات موصى بها",
  },
  "Découvrez des soins classés par type de peau, objectif et ingrédients clés.": {
    en: "Discover skincare sorted by skin type, goal, and key ingredients.",
    ar: "اكتشفي منتجات عناية مصنفة حسب نوع البشرة والهدف والمكونات الرئيسية.",
  },
  "Votre profil peau": {
    en: "Your skin profile",
    ar: "ملف بشرتك",
  },
  "Optionnel. Personnalisez vos recommandations ou affichez tout le catalogue.": {
    en: "Optional. Personalize your recommendations or view the full catalog.",
    ar: "اختياري. خصصي توصياتك أو اعرضي الكتالوج الكامل.",
  },
  "Voir tous les produits": {
    en: "View all products",
    ar: "عرض كل المنتجات",
  },
  "Personnaliser": {
    en: "Personalize",
    ar: "تخصيص",
  },
  "Réinitialiser": {
    en: "Reset",
    ar: "إعادة ضبط",
  },
  "Type de peau": {
    en: "Skin type",
    ar: "نوع البشرة",
  },
  "Objectif": {
    en: "Goal",
    ar: "الهدف",
  },
  "Sensibilité": {
    en: "Sensitivity",
    ar: "الحساسية",
  },
  "Produit": {
    en: "Product",
    ar: "المنتج",
  },
  "À éviter": {
    en: "Avoid",
    ar: "يجب تجنبه",
  },
  "Tous": {
    en: "All",
    ar: "الكل",
  },
  "Tous les objectifs": {
    en: "All goals",
    ar: "كل الأهداف",
  },
  "Je ne sais pas": {
    en: "I don't know",
    ar: "لا أعرف",
  },
  "Tous les produits": {
    en: "All products",
    ar: "كل المنتجات",
  },
  "Aucun": {
    en: "None",
    ar: "لا شيء",
  },
  "Peau sèche": {
    en: "Dry skin",
    ar: "بشرة جافة",
  },
  "Peau grasse": {
    en: "Oily skin",
    ar: "بشرة دهنية",
  },
  "Peau sensible": {
    en: "Sensitive skin",
    ar: "بشرة حساسة",
  },
  "Acné & imperfections": {
    en: "Acne & blemishes",
    ar: "حبوب وشوائب",
  },
  "Rougeurs": {
    en: "Redness",
    ar: "احمرار",
  },
  "Barrière abîmée": {
    en: "Damaged barrier",
    ar: "حاجز البشرة متضرر",
  },
  "Éclat & taches": {
    en: "Glow & spots",
    ar: "إشراقة وبقع",
  },
  "produits trouvés": {
    en: "products found",
    ar: "منتجا تم العثور عليها",
  },
  "Chargement des produits...": {
    en: "Loading products...",
    ar: "جاري تحميل المنتجات...",
  },
  "Profil ignoré. Tous les produits actifs sont affichés.": {
    en: "Profile ignored. All active products are shown.",
    ar: "تم تجاهل الملف. يتم عرض كل المنتجات النشطة.",
  },
  "Classés selon votre profil peau.": {
    en: "Sorted according to your skin profile.",
    ar: "مرتبة حسب ملف بشرتك.",
  },
  "Ajoutez votre profil pour obtenir un classement plus précis.": {
    en: "Add your profile to get a more precise ranking.",
    ar: "أضيفي ملفك للحصول على ترتيب أدق.",
  },
  "Rechercher une marque...": {
    en: "Search for a brand...",
    ar: "ابحثي عن علامة تجارية...",
  },
  "Aucun produit trouvé": {
    en: "No products found",
    ar: "لم يتم العثور على منتجات",
  },
  "Personnaliser vos recommandations": {
    en: "Personalize your recommendations",
    ar: "خصّصي توصياتك",
  },
  "Aucun ingrédient à surveiller renseigné.": {
    en: "No watchout ingredient provided.",
    ar: "لا توجد مكونات يجب مراقبتها.",
  },
  "Bibliothèque d'ingrédients": {
    en: "Ingredient library",
    ar: "مكتبة المكونات",
  },
  "Découvrez, apprenez et créez des routines plus intelligentes avec des ingrédients adaptés à votre peau.": {
    en: "Discover, learn, and create smarter routines with ingredients adapted to your skin.",
    ar: "اكتشفي وتعلمي وابني روتينات أذكى بمكونات مناسبة لبشرتك.",
  },
  "Trier par": {
    en: "Sort by",
    ar: "ترتيب حسب",
  },
  "Pertinence": {
    en: "Relevance",
    ar: "الملاءمة",
  },
  "Tous les ingrédients": {
    en: "All ingredients",
    ar: "كل المكونات",
  },
  "Hydratation": {
    en: "Hydration",
    ar: "ترطيب",
  },
  "Acné": {
    en: "Acne",
    ar: "حبوب",
  },
  "Éclat": {
    en: "Glow",
    ar: "إشراقة",
  },
  "Réparation de la barrière": {
    en: "Barrier repair",
    ar: "إصلاح الحاجز",
  },
  "ingrédients trouvés": {
    en: "ingredients found",
    ar: "مكونا تم العثور عليها",
  },
  "Bienfaits clés": {
    en: "Key benefits",
    ar: "الفوائد الرئيسية",
  },
  "Idéal pour": {
    en: "Ideal for",
    ar: "مثالي لـ",
  },
  "Conseils d'utilisation": {
    en: "Usage tips",
    ar: "نصائح الاستخدام",
  },
  "Compatibilité": {
    en: "Compatibility",
    ar: "التوافق",
  },
  "Excellent": {
    en: "Excellent",
    ar: "ممتاز",
  },
  "Éviter": {
    en: "Avoid",
    ar: "تجنبي",
  },
  "Azelaic Acid": {
    en: "Azelaic Acid",
    ar: "حمض الأزيليك",
  },
  "Lactic Acid": {
    en: "Lactic Acid",
    ar: "حمض اللاكتيك",
  },
  "Glycolic Acid": {
    en: "Glycolic Acid",
    ar: "حمض الجليكوليك",
  },
  "Benzoyl Peroxide": {
    en: "Benzoyl Peroxide",
    ar: "بنزويل بيروكسيد",
  },
  "Gluconolactone": {
    en: "Gluconolactone",
    ar: "غلوكونولاكتون",
  },
  "Mandelic Acid": {
    en: "Mandelic Acid",
    ar: "حمض الماندليك",
  },
  "Actif multi-action pour l’éclat": {
    en: "Multi-action active for glow",
    ar: "مكون متعدد التأثير للإشراقة",
  },
  "Aide à améliorer le teint irrégulier, les imperfections et les rougeurs visibles.": {
    en: "Helps improve uneven tone, blemishes, and visible redness.",
    ar: "يساعد على تحسين تفاوت اللون والشوائب والاحمرار الظاهر.",
  },
  "Exfolie la surface de la peau et aide à raviver le teint terne.": {
    en: "Exfoliates the skin surface and helps revive dull tone.",
    ar: "يقشر سطح البشرة ويساعد على إنعاش اللون الباهت.",
  },
  "Un exfoliant doux qui aide la peau à paraître plus lisse et plus hydratée.": {
    en: "A gentle exfoliant that helps skin look smoother and more hydrated.",
    ar: "مقشر لطيف يساعد البشرة على أن تبدو أنعم وأكثر ترطيبا.",
  },
  "Exfolie tout en aidant la peau à paraître plus lisse et plus hydratée": {
    en: "Exfoliates while helping skin look smoother and more hydrated",
    ar: "يقشر البشرة ويساعدها على أن تبدو أنعم وأكثر ترطيبا",
  },
  "Un exfoliant doux souvent utilisé pour la texture, le teint et les peaux sujettes aux imperfections.": {
    en: "A gentle exfoliant often used for texture, tone, and blemish-prone skin.",
    ar: "مقشر لطيف يستخدم غالبا للملمس واللون والبشرة المعرضة للشوائب.",
  },
  "Aide à lutter contre les bactéries liées à l’acné et à réduire les imperfections.": {
    en: "Helps fight acne-related bacteria and reduce blemishes.",
    ar: "يساعد على محاربة البكتيريا المرتبطة بالحبوب وتقليل الشوائب.",
  },
  "Texture": {
    en: "Texture",
    ar: "الملمس",
  },
  "Exfoliation": {
    en: "Exfoliation",
    ar: "تقشير",
  },
  "Doux": {
    en: "Gentle",
    ar: "لطيف",
  },
  "Taches": {
    en: "Spots",
    ar: "بقع",
  },
  "Taches pigmentaires": {
    en: "Dark spots",
    ar: "تصبغات",
  },
  "Anti-imperfections": {
    en: "Anti-blemish",
    ar: "مضاد للشوائب",
  },
  "Contrôle du sébum": {
    en: "Sebum control",
    ar: "تنظيم الإفرازات الدهنية",
  },
  "Imperfections": {
    en: "Blemishes",
    ar: "شوائب",
  },
  "Teint": {
    en: "Tone",
    ar: "لون البشرة",
  },
  "Aide à utiliser avec prudence": {
    en: "Use with caution",
    ar: "يستخدم بحذر",
  },
  "À utiliser avec prudence": {
    en: "Use with caution",
    ar: "يستخدم بحذر",
  },
  "Nouvelle discussion": {
    en: "New discussion",
    ar: "محادثة جديدة",
  },
  "Menu": {
    en: "Menu",
    ar: "القائمة",
  },
  "Discussions": {
    en: "Discussions",
    ar: "المحادثات",
  },
  "Récent": {
    en: "Recent",
    ar: "الأحدث",
  },
  "Chargement des discussions...": {
    en: "Loading discussions...",
    ar: "جاري تحميل المحادثات...",
  },
  "Discussion enregistrée": {
    en: "Saved discussion",
    ar: "محادثة محفوظة",
  },
  "Discussion enregistrée dans votre historique SkinorAI.": {
    en: "Discussion saved in your SkinorAI history.",
    ar: "تم حفظ المحادثة في سجل SkinorAI الخاص بك.",
  },
  "Aucune discussion pour le moment. Lancez un scan pour alimenter cette liste.": {
    en: "No discussions yet. Start a scan to fill this list.",
    ar: "لا توجد محادثات بعد. ابدئي فحصًا لإضافة عناصر إلى هذه القائمة.",
  },
  "Débloquer Premium": {
    en: "Unlock Premium",
    ar: "فتح بريميوم",
  },
  "Obtenez des analyses plus poussées, des scans illimités et des routines personnalisées.": {
    en: "Get deeper analyses, unlimited scans, and personalized routines.",
    ar: "احصلي على تحليلات أعمق، وفحوصات غير محدودة، وروتينات مخصصة.",
  },
  "Passer à Premium": {
    en: "Go Premium",
    ar: "الترقية إلى بريميوم",
  },
  "Plan Pro actif": {
    en: "Pro plan active",
    ar: "خطة Pro مفعلة",
  },
  "Votre abonnement Pro est actif sur ce compte.": {
    en: "Your Pro plan is active on this account.",
    ar: "خطة Pro مفعلة على هذا الحساب.",
  },
  "Clair": {
    en: "Light",
    ar: "فاتح",
  },
  "Sombre": {
    en: "Dark",
    ar: "داكن",
  },
  "Paramètres": {
    en: "Settings",
    ar: "الإعدادات",
  },
  "Rechercher niacinamide, rétinol, acide salicylique...": {
    en: "Search niacinamide, retinol, salicylic acid...",
    ar: "ابحثي عن النياسيناميد، الريتينول، حمض الساليسيليك...",
  },
  "Voir l'analyse détaillée de l'ingrédient": {
    en: "View the detailed ingredient analysis",
    ar: "عرض التحليل المفصل للمكوّن",
  },
  "Adapté aux débutants": {
    en: "Beginner-friendly",
    ar: "مناسب للمبتدئين",
  },
  "Peau à tendance acnéique": {
    en: "Acne-prone skin",
    ar: "بشرة معرّضة لحب الشباب",
  },
  "Teint irrégulier": {
    en: "Uneven tone",
    ar: "لون بشرة غير موحد",
  },
  "Peau sujette aux rougeurs": {
    en: "Redness-prone skin",
    ar: "بشرة معرّضة للاحمرار",
  },
  "Teint terne": {
    en: "Dull tone",
    ar: "لون باهت",
  },
  "Peau texturée": {
    en: "Textured skin",
    ar: "بشرة ذات ملمس غير متجانس",
  },
  "Exfoliation débutant": {
    en: "Beginner exfoliation",
    ar: "تقشير للمبتدئين",
  },
  "Niacinamide": {
    en: "Niacinamide",
    ar: "نياسيناميد",
  },
  "Acide hyaluronique": {
    en: "Hyaluronic acid",
    ar: "حمض الهيالورونيك",
  },
  "Céramides": {
    en: "Ceramides",
    ar: "سيراميدات",
  },
  "Rétinol": {
    en: "Retinol",
    ar: "ريتينول",
  },
  "Acides AHA/BHA": {
    en: "AHA/BHA acids",
    ar: "أحماض AHA/BHA",
  },
  "Acide salicylique": {
    en: "Salicylic acid",
    ar: "حمض الساليسيليك",
  },
  "Vitamine C": {
    en: "Vitamin C",
    ar: "فيتامين C",
  },
  "Acides BHA": {
    en: "BHA acids",
    ar: "أحماض BHA",
  },
  "Barrière": {
    en: "Barrier",
    ar: "حاجز البشرة",
  },
  "Apaisant": {
    en: "Soothing",
    ar: "مهدئ",
  },
  "Confort": {
    en: "Comfort",
    ar: "راحة",
  },
  "Réparation": {
    en: "Repair",
    ar: "إصلاح",
  },
  "Pores": {
    en: "Pores",
    ar: "مسام",
  },
  "Adoucissant": {
    en: "Softening",
    ar: "ملطف",
  },
  "Page": {
    en: "Page",
    ar: "صفحة",
  },
  "Précédent": {
    en: "Previous",
    ar: "السابق",
  },
  "Suivant": {
    en: "Next",
    ar: "التالي",
  },
  "Essayez un autre objectif ou affichez tous les produits.": {
    en: "Try another goal or view all products.",
    ar: "جرّبي هدفًا آخر أو اعرضي كل المنتجات.",
  },
  "Répondez à quelques questions pour classer les produits selon votre peau. Vous pouvez ignorer cette étape et voir tout le catalogue.": {
    en: "Answer a few questions to rank products for your skin. You can skip this step and view the full catalog.",
    ar: "أجيبي عن بعض الأسئلة لترتيب المنتجات حسب بشرتك. يمكنك تخطي هذه الخطوة ورؤية الكتالوج كاملًا.",
  },
  "Objectif principal": {
    en: "Main goal",
    ar: "الهدف الرئيسي",
  },
  "Produit recherché": {
    en: "Product you need",
    ar: "المنتج المطلوب",
  },
  "Ingrédients à éviter": {
    en: "Ingredients to avoid",
    ar: "مكونات يجب تجنبها",
  },
  "Parfum, alcohol denat, huiles essentielles...": {
    en: "Fragrance, alcohol denat, essential oils...",
    ar: "عطر، كحول دينات، زيوت عطرية...",
  },
  "Ignorer pour l’instant": {
    en: "Skip for now",
    ar: "تخطي الآن",
  },
  "Voir mes recommandations": {
    en: "View my recommendations",
    ar: "عرض توصياتي",
  },
  "À surveiller": {
    en: "Watch out",
    ar: "يجب الانتباه",
  },
  "Sans parfum irritant détecté": {
    en: "No irritating fragrance detected",
    ar: "لم يتم اكتشاف عطر مهيّج",
  },
  "Score SkinorAI": {
    en: "SkinorAI score",
    ar: "تقييم SkinorAI",
  },
  "Score global": {
    en: "Overall score",
    ar: "التقييم العام",
  },
  "Global": {
    en: "Overall",
    ar: "عام",
  },
  "Voir": {
    en: "View",
    ar: "عرض",
  },
  "Produit skincare classé selon ses ingrédients, objectifs et types de peau.": {
    en: "Skincare product classified by ingredients, goals, and skin types.",
    ar: "منتج عناية مصنّف حسب المكونات والأهداف وأنواع البشرة.",
  },
  "Type": {
    en: "Type",
    ar: "النوع",
  },
  "Adapté pour": {
    en: "Suitable for",
    ar: "مناسب لـ",
  },
  "Ingrédients clés": {
    en: "Key ingredients",
    ar: "المكونات الرئيسية",
  },
  "Pourquoi ce produit": {
    en: "Why this product",
    ar: "لماذا هذا المنتج",
  },
  "Non renseigné": {
    en: "Not specified",
    ar: "غير مذكور",
  },
  "Très bon": {
    en: "Very good",
    ar: "جيد جدًا",
  },
  "Bon match": {
    en: "Good match",
    ar: "توافق جيد",
  },
  "À vérifier": {
    en: "Check",
    ar: "يحتاج مراجعة",
  },
  "Peau mixte": {
    en: "Combination skin",
    ar: "بشرة مختلطة",
  },
  "Peau normale": {
    en: "Normal skin",
    ar: "بشرة عادية",
  },
  "Anti-âge": {
    en: "Anti-aging",
    ar: "مقاومة علامات التقدم",
  },
  "Excès de sébum": {
    en: "Excess sebum",
    ar: "إفرازات دهنية زائدة",
  },
  "Faible": {
    en: "Low",
    ar: "منخفضة",
  },
  "Moyenne": {
    en: "Medium",
    ar: "متوسطة",
  },
  "Élevée": {
    en: "High",
    ar: "مرتفعة",
  },
  "Nettoyants": {
    en: "Cleansers",
    ar: "غسولات",
  },
  "Sérums": {
    en: "Serums",
    ar: "سيرومات",
  },
  "Crèmes": {
    en: "Creams",
    ar: "كريمات",
  },
  "Exfoliants": {
    en: "Exfoliants",
    ar: "مقشرات",
  },
  "Traitements": {
    en: "Treatments",
    ar: "علاجات",
  },
  "Bibliothèque d’ingrédients": {
    en: "Ingredient library",
    ar: "مكتبة المكونات",
  },
  "Prête à mieux comprendre votre peau ?": {
    en: "Ready to understand your skin better?",
    ar: "هل أنتِ مستعدة لفهم بشرتك بشكل أفضل؟",
  },
  "Scanner un produit": {
    en: "Scan a product",
    ar: "فحص منتج",
  },
  "Scannez un produit pour analyser ses ingrédients et sa formule.": {
    en: "Scan a product to analyze its ingredients and formula.",
    ar: "افحصي منتجًا لتحليل مكوناته وتركيبته.",
  },
  "Scan du visage": {
    en: "Face scan",
    ar: "فحص الوجه",
  },
  "PREMIUM": {
    en: "PREMIUM",
    ar: "بريميوم",
  },
  "Décodez les ingrédients et comprenez ce qui convient à votre peau.": {
    en: "Decode ingredients and understand what suits your skin.",
    ar: "افهمي المكونات وما يناسب بشرتك.",
  },
  "Analyseur d’ingrédients": {
    en: "Ingredient analyzer",
    ar: "محلل المكونات",
  },
  "Décodez les ingrédients, vérifiez les points à surveiller et comprenez ce qui convient à votre peau.": {
    en: "Decode ingredients, check watchouts, and understand what suits your skin.",
    ar: "حللي المكونات، وتحققي مما يجب الانتباه له، وافهمي ما يناسب بشرتك.",
  },
  "Coach routine": {
    en: "Routine coach",
    ar: "مدرب الروتين",
  },
  "Recevez des routines personnalisées selon vos objectifs peau.": {
    en: "Get personalized routines based on your skin goals.",
    ar: "احصلي على روتينات مخصصة حسب أهداف بشرتك.",
  },
  "Scanner produit": {
    en: "Product scanner",
    ar: "ماسح المنتجات",
  },
  "Scannez un produit et analysez sa formule.": {
    en: "Scan a product and analyze its formula.",
    ar: "افحصي منتجًا وحللي تركيبته.",
  },
  "Insights peau": {
    en: "Skin insights",
    ar: "رؤى البشرة",
  },
  "Suivez vos analyses et obtenez des insights plus précis sur votre peau.": {
    en: "Track your analyses and get more precise insights about your skin.",
    ar: "تابعي تحليلاتك واحصلي على رؤى أدق حول بشرتك.",
  },
  "Fonctionnalité SkinorAI": {
    en: "SkinorAI feature",
    ar: "ميزة SkinorAI",
  },
  "Fermer la fenêtre": {
    en: "Close window",
    ar: "إغلاق النافذة",
  },
  "Illustration de l’analyse des ingrédients": {
    en: "Ingredient analysis illustration",
    ar: "رسم توضيحي لتحليل المكونات",
  },
  "Illustration du coach routine": {
    en: "Routine coach illustration",
    ar: "رسم توضيحي لمدرب الروتين",
  },
  "Illustration du scanner produit": {
    en: "Product scanner illustration",
    ar: "رسم توضيحي لماسح المنتجات",
  },
  "Illustration des insights peau": {
    en: "Skin insights illustration",
    ar: "رسم توضيحي لرؤى البشرة",
  },
  "Collez ou scannez la liste d’ingrédients d’un produit de soin.": {
    en: "Paste or scan a skincare product ingredient list.",
    ar: "الصقي أو امسحي قائمة مكونات منتج العناية.",
  },
  "Comprenez le rôle de chaque ingrédient.": {
    en: "Understand the role of each ingredient.",
    ar: "افهمي دور كل مكوّن.",
  },
  "Repérez les ingrédients pouvant irriter les peaux sensibles.": {
    en: "Spot ingredients that may irritate sensitive skin.",
    ar: "اكتشفي المكونات التي قد تهيّج البشرة الحساسة.",
  },
  "Obtenez une explication claire, sans jargon INCI compliqué.": {
    en: "Get a clear explanation without complicated INCI jargon.",
    ar: "احصلي على شرح واضح بدون مصطلحات INCI معقدة.",
  },
  "Analyser les ingrédients": {
    en: "Analyze ingredients",
    ar: "تحليل المكونات",
  },
  "Construisez une routine simple pour le matin ou le soir.": {
    en: "Build a simple morning or evening routine.",
    ar: "ابني روتينًا بسيطًا للصباح أو المساء.",
  },
  "Sachez quel produit appliquer en premier, ensuite et en dernier.": {
    en: "Know which product to apply first, next, and last.",
    ar: "اعرفي أي منتج يُطبق أولًا ثم بعده ثم أخيرًا.",
  },
  "Évitez de mélanger trop d’actifs puissants.": {
    en: "Avoid mixing too many strong actives.",
    ar: "تجنبي خلط الكثير من المكونات النشطة القوية.",
  },
  "Recevez des rappels sur le SPF et la fréquence d’utilisation.": {
    en: "Get reminders about SPF and usage frequency.",
    ar: "احصلي على تذكيرات حول واقي الشمس وتكرار الاستخدام.",
  },
  "Importez une photo claire de l’étiquette du produit.": {
    en: "Upload a clear photo of the product label.",
    ar: "ارفعي صورة واضحة لملصق المنتج.",
  },
  "Extrayez automatiquement les ingrédients grâce à l’OCR.": {
    en: "Automatically extract ingredients with OCR.",
    ar: "استخرجي المكونات تلقائيًا عبر OCR.",
  },
  "Corrigez la liste détectée avant l’analyse.": {
    en: "Correct the detected list before analysis.",
    ar: "صححي القائمة المكتشفة قبل التحليل.",
  },
  "Recevez un score, un verdict, des points forts et des ingrédients à surveiller.": {
    en: "Get a score, verdict, strengths, and ingredients to watch.",
    ar: "احصلي على تقييم وحكم ونقاط قوة ومكونات يجب الانتباه لها.",
  },
  "Comprenez les tendances dans vos produits scannés.": {
    en: "Understand trends in your scanned products.",
    ar: "افهمي الاتجاهات في المنتجات التي فحصتها.",
  },
  "Identifiez les ingrédients qui correspondent le plus souvent à vos objectifs peau.": {
    en: "Identify ingredients that most often match your skin goals.",
    ar: "حددي المكونات التي تناسب أهداف بشرتك غالبًا.",
  },
  "Repérez ce que votre peau semble mieux tolérer.": {
    en: "Spot what your skin seems to tolerate best.",
    ar: "اكتشفي ما يبدو أن بشرتك تتحمله بشكل أفضل.",
  },
  "Préparez des recommandations plus intelligentes avec le temps.": {
    en: "Build smarter recommendations over time.",
    ar: "حضّري توصيات أذكى مع الوقت.",
  },
  "Aperçu du scan du visage": {
    en: "Face scan preview",
    ar: "معاينة فحص الوجه",
  },
  "Bientôt disponible": {
    en: "Coming soon",
    ar: "قريبًا",
  },
  "Le scan du visage arrive bientôt": {
    en: "Face scan is coming soon",
    ar: "فحص الوجه قادم قريبًا",
  },
  "Bientôt, SkinorAI aidera les utilisateurs à scanner leur visage, comprendre les préoccupations visibles de la peau et recevoir des conseils plus personnalisés.": {
    en: "Soon, SkinorAI will help users scan their face, understand visible skin concerns, and receive more personalized advice.",
    ar: "قريبًا، سيساعد SkinorAI المستخدمين على فحص الوجه وفهم مشاكل البشرة الظاهرة والحصول على نصائح أكثر تخصيصًا.",
  },
  "Analyser les préoccupations visibles grâce à un scan guidé du visage.": {
    en: "Analyze visible concerns with a guided face scan.",
    ar: "تحليل المشاكل الظاهرة عبر فحص موجه للوجه.",
  },
  "Améliorer les recommandations selon l’apparence de la peau et les objectifs.": {
    en: "Improve recommendations based on skin appearance and goals.",
    ar: "تحسين التوصيات حسب مظهر البشرة والأهداف.",
  },
  "Combiner les scans produits avec des insights peau personnalisés.": {
    en: "Combine product scans with personalized skin insights.",
    ar: "دمج فحوصات المنتجات مع رؤى مخصصة للبشرة.",
  },
  "Compris": {
    en: "Got it",
    ar: "فهمت",
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
