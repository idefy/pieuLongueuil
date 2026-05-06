/**
 * FICHES DE SERVICE PASTORAL
 * ===========================
 * Contenu complet des 8 fiches, importé depuis servicepastoral.ca
 * Images hébergées sur le site source — remplacer par vos propres copies.
 *
 * Pour ajouter une fiche : ajouter un objet dans le tableau.
 * Pour modifier le contenu : éditer les sections ideesFamille / ideesPastorale / ressourcesEglise / ressourcesCommunautaires
 */
const FICHES_DATA = [
  {
    id: "autonomie-temporelle",
    slug: "a-la-recherche-de-lautonomie-temporelle",
    image: "/assets/servicepastoral/autonomie-temporelle.webp",
    color: "#2E5E3E",
    num: "01",
    title: {
      fr: "Autonomie temporelle",
      es: "Autosuficiencia temporal",
      en: "Temporal Self-Reliance"
    },
    quote: {
      fr: "« J'ai l'intention de pourvoir aux besoins de mes saints. » — D&A 104:15",
      es: "«Tengo la intención de proveer para mis santos.» — D&C 104:15",
      en: "\"I will provide for my saints.\" — D&C 104:15"
    },
    ideesFamille: {
      fr: [
        "Participer à un des cours des groupes d'autonomie : Finances personnelles, Lancer mon entreprise, Trouver un meilleur emploi, Des études pour un meilleur emploi.",
        "Évaluer la possibilité de retourner aux études pour obtenir un meilleur emploi.",
        "Lors d'un conseil de famille, élaborer un budget et s'engager à le respecter.",
        "Faire des démarches pour trouver un meilleur emploi.",
        "Contacter le spécialiste d'emploi du pieu ou de votre unité."
      ],
      es: [
        "Participar en uno de los cursos de grupos de autosuficiencia: Finanzas personales, Iniciar y hacer crecer un negocio, Encontrar un mejor empleo, Educación para un mejor empleo.",
        "Evaluar la posibilidad de continuar los estudios para obtener un mejor empleo.",
        "En un consejo familiar, elaborar un presupuesto y comprometerse a cumplirlo.",
        "Hacer gestiones para encontrar un mejor empleo.",
        "Contactar al especialista de empleo de la estaca o de su unidad."
      ],
      en: [
        "Participate in one of the self-reliance group courses: Personal Finances, Starting and Growing My Business, Finding a Better Job, Education for Better Work.",
        "Evaluate the possibility of returning to school for a better job.",
        "In a family council, develop a budget and commit to following it.",
        "Take steps to find a better job.",
        "Contact the stake or unit employment specialist."
      ]
    },
    ideesPastorale: {
      fr: [
        "S'inscrire à un groupe d'autonomie avec la famille.",
        "Aider la famille avec leur recherche d'emploi ou leurs projets d'études.",
        "Accompagner la famille vers les ressources communautaires disponibles.",
        "Être ou trouver un mentor pour les aider et les accompagner (transport, conseils, appels de soutien)."
      ],
      es: [
        "Inscribirse en un grupo de autosuficiencia con la familia.",
        "Ayudar a la familia con su búsqueda de empleo o proyectos de estudio.",
        "Acompañar a la familia hacia los recursos comunitarios disponibles.",
        "Ser o encontrar un mentor para ayudarlos y acompañarlos."
      ],
      en: [
        "Enroll in a self-reliance group with the family.",
        "Help the family with their job search or study plans.",
        "Guide the family toward available community resources.",
        "Be or find a mentor to help and accompany them."
      ]
    },
    ressourcesEglise: {
      fr: [
        { label: "Les services d'autonomie", url: "https://www.churchofjesuschrist.org/study/life-help/self-reliance?lang=fra" },
        { label: "Préparez tout ce qui est nécessaire : Réserves au foyer", url: "https://www.churchofjesuschrist.org/bc/content/shared/content/french/pdf/language-materials/04008_fra.pdf" },
        { label: "Préparez tout ce qui est nécessaire : Finances familiales", url: "https://www.churchofjesuschrist.org/bc/content/shared/content/french/pdf/language-materials/04007_fra.pdf" },
        { label: "Guide de ressources pour les immigrants", url: "https://docs.google.com/presentation/d/1czDtTQBLruSSDDzGQN96xG3htAwTEPfam5_0no6u4SU/present" }
      ]
    },
    ressourcesCommunautaires: {
      fr: [
        { label: "Répertoire de ressources communautaires du Québec", url: "http://www.qc.211.ca" },
        { label: "Composer le 211 (téléphone)", url: null }
      ]
    }
  },
  {
    id: "vaincre-dependance",
    slug: "vaincre-la-dependance",
    image: "/assets/servicepastoral/recovery.webp",
    color: "#5C3A1E",
    num: "02",
    title: {
      fr: "Vaincre la dépendance",
      es: "Superar la adicción",
      en: "Overcoming Addiction"
    },
    quote: {
      fr: "« Vous connaîtrez la vérité, et la vérité vous affranchira. » — Jean 8:32",
      es: "«Conoceréis la verdad, y la verdad os hará libres.» — Juan 8:32",
      en: "\"You will know the truth, and the truth will set you free.\" — John 8:32"
    },
    ideesFamille: {
      fr: [
        "Prendre le temps d'avoir des discussions honnêtes et intimes avec une personne de confiance.",
        "Jeûner pour recevoir de la force.",
        "Reconnaître le besoin d'aide pour surmonter la dépendance et travailler honnêtement avec le Seigneur.",
        "Étudier le sacrifice expiatoire et le pouvoir du repentir.",
        "Lire des discours de conférence générale à l'appui."
      ],
      es: [
        "Tomarse el tiempo de tener conversaciones honestas e íntimas con una persona de confianza.",
        "Ayunar para recibir fortaleza.",
        "Reconocer la necesidad de ayuda para superar la adicción y trabajar honestamente con el Señor.",
        "Estudiar el sacrificio expiatorio y el poder del arrepentimiento.",
        "Leer discursos de conferencia general de apoyo."
      ],
      en: [
        "Take time for honest, intimate conversations with a trusted person.",
        "Fast for strength.",
        "Recognize the need for help to overcome addiction and work honestly with the Lord.",
        "Study the Atonement and the power of repentance.",
        "Read supporting General Conference talks."
      ]
    },
    ideesPastorale: {
      fr: [
        "Présenter les étapes du programme de dépendance de l'Église et son introduction.",
        "Proposer l'accompagnement au programme.",
        "Aider la famille à trouver un soutien personnel (parrain), ou le devenir."
      ],
      es: [
        "Presentar los pasos del programa de adicciones de la Iglesia y su introducción.",
        "Proponer acompañamiento al programa.",
        "Ayudar a la familia a encontrar un apoyo personal (padrino), o convertirse en uno."
      ],
      en: [
        "Present the steps of the Church addiction program and its introduction.",
        "Offer to accompany them to the program.",
        "Help the family find personal support (sponsor), or become one."
      ]
    },
    ressourcesEglise: {
      fr: [
        { label: "Programme de traitement de la dépendance", url: "https://addictionrecovery.churchofjesuschrist.org/?lang=fra" },
        { label: "Il guérit ceux qui sont chargés – Dallin H. Oaks", url: "https://www.churchofjesuschrist.org/study/general-conference/2006/10/he-heals-the-heavy-laden?lang=fra" },
        { label: "Fortifiés par l'expiation de Jésus-Christ – Dallin H. Oaks", url: "https://www.churchofjesuschrist.org/study/general-conference/2015/10/strengthened-by-the-atonement-of-jesus-christ?lang=fra" },
        { label: "Vidéos de l'Église sur la dépendance", url: "https://addictionrecovery.churchofjesuschrist.org/videos?lang=fra" }
      ]
    },
    ressourcesCommunautaires: {
      fr: [
        { label: "Alcooliques Anonymes", url: "https://aa-quebec.org/aaqc_wp/" },
        { label: "Ligne de prévention du suicide – 1-866-APPELLE", url: "https://www.aqps.info/" },
        { label: "Tel-jeunes", url: "https://www.teljeunes.com/Accueil" },
        { label: "811 (Info-santé, Info-social)", url: "https://www.quebec.ca/sante/trouver-une-ressource/consulter-un-professionnel/info-sante-811/" },
        { label: "Répertoire de ressources – qc.211.ca", url: "http://www.qc.211.ca" }
      ]
    }
  },
  {
    id: "bien-etre-emotionnel",
    slug: "bien-etre-emotionnel",
    image: "/assets/servicepastoral/bien-etre.webp",
    color: "#1E3A5C",
    num: "03",
    title: {
      fr: "Bien-être émotionnel",
      es: "Bienestar emocional",
      en: "Emotional Wellbeing"
    },
    quote: {
      fr: "« Bien que nous puissions ressentir que nous sommes comme un vase brisé... ce vase est dans les mains du potier divin. » — Jeffrey R. Holland, octobre 2013",
      es: "«Aunque podamos sentir que somos como un vaso quebrado... ese vaso está en manos del alfarero divino.» — Jeffrey R. Holland, octubre 2013",
      en: "\"Though we may feel like a broken vessel... that vessel is in the hands of the divine Potter.\" — Jeffrey R. Holland, October 2013"
    },
    ideesFamille: {
      fr: [
        "Étudier l'article « Comme un vase brisé » de Jeffrey R. Holland dans un esprit de prière.",
        "Lire « 14 manières de retrouver la santé émotionnelle » (Liahona, jan. 2019).",
        "Si besoin, demander une bénédiction de prêtrise.",
        "Si besoin, demander conseil à des personnes de bonne foi ayant une formation certifiée et de bonnes valeurs.",
        "Suivre les recommandations des articles de référence."
      ],
      es: [
        "Estudiar el artículo 'Como un vaso quebrado' de Jeffrey R. Holland con un espíritu de oración.",
        "Leer '14 maneras de recuperar la salud emocional' (Liahona, ene. 2019).",
        "Si es necesario, pedir una bendición de sacerdocio.",
        "Si es necesario, buscar consejo de personas de buena fe con formación certificada y buenos valores.",
        "Seguir las recomendaciones de los artículos de referencia."
      ],
      en: [
        "Study Jeffrey R. Holland's 'Like a Broken Vessel' in a spirit of prayer.",
        "Read '14 Ways to Get Your Emotional Health Back on Track' (Liahona, Jan. 2019).",
        "If needed, request a priesthood blessing.",
        "If needed, seek counsel from people of good faith with certified training and good values.",
        "Follow the recommendations in the reference articles."
      ]
    },
    ideesPastorale: {
      fr: [
        "Partager et discuter « Comme un vase brisé » selon l'inspiration de l'Esprit.",
        "Inviter la personne/famille à demander conseil à ceux qui détiennent les clés de leur bien-être spirituel.",
        "Inviter à consulter un professionnel de santé mentale certifié et de bonne foi.",
        "Partager les ressources sur la santé mentale de l'Église."
      ],
      es: [
        "Compartir y discutir 'Como un vaso quebrado' según la inspiración del Espíritu.",
        "Invitar a la persona/familia a buscar consejo de quienes tienen las llaves de su bienestar espiritual.",
        "Invitar a consultar a un profesional de salud mental certificado y de buena fe.",
        "Compartir los recursos de salud mental de la Iglesia."
      ],
      en: [
        "Share and discuss 'Like a Broken Vessel' as the Spirit inspires.",
        "Invite the person/family to seek counsel from those who hold the keys to their spiritual wellbeing.",
        "Invite them to consult a certified mental health professional of good faith.",
        "Share the Church's mental health resources."
      ]
    },
    ressourcesEglise: {
      fr: [
        { label: "Comme un vase brisé – Jeffrey R. Holland", url: "https://www.lds.org/general-conference/2013/10/like-a-broken-vessel?lang=fra" },
        { label: "Quand les ténèbres me menacent – Liahona, nov. 2019", url: "https://www.churchofjesuschrist.org/study/general-conference/2019/10/31aburto?lang=fra" },
        { label: "Guide en trois étapes pour la santé mentale", url: "https://www.churchofjesuschrist.org/study/liahona/2020/09/young-adults/a-3-step-guide-to-maintaining-your-mental-health?lang=fra" }
      ]
    },
    ressourcesCommunautaires: {
      fr: [
        { label: "Ligne de prévention du suicide – 1-866-APPELLE", url: "https://www.aqps.info/" },
        { label: "Tel-jeunes", url: "https://www.teljeunes.com/Accueil" },
        { label: "811 (Info-santé, Info-social)", url: "https://www.quebec.ca/sante/trouver-une-ressource/consulter-un-professionnel/info-sante-811/" },
        { label: "Centre de crise – 418 688-4240", url: "http://centredecrise.com/" },
        { label: "CLSC de votre quartier – demander l'accueil psychosocial", url: null }
      ]
    }
  },
  {
    id: "fortifier-couple",
    slug: "fortifier-notre-couple",
    image: "/assets/servicepastoral/couple.webp",
    color: "#6B2D3E",
    num: "04",
    title: {
      fr: "Fortifier notre couple",
      es: "Fortalecer nuestra pareja",
      en: "Strengthening Our Marriage"
    },
    quote: {
      fr: "« On n'atteint l'harmonie dans le mariage que lorsque l'on estime le bien-être de son conjoint comme l'une des principales priorités. » — Russell M. Nelson, octobre 2008",
      es: "«Solo se logra la armonía en el matrimonio cuando se considera el bienestar del cónyuge como una de las principales prioridades.» — Russell M. Nelson, octubre 2008",
      en: "\"Harmony in marriage comes only when one esteems the welfare of his or her spouse among the highest of priorities.\" — Russell M. Nelson, October 2008"
    },
    ideesFamille: {
      fr: [
        "Étudier en couple le livre « Le mariage éternel » et le manuel « Édifier un mariage éternel ».",
        "Si besoin, ne pas hésiter à consulter un dirigeant ou un professionnel des relations conjugales.",
        "Prendre une marche en couple régulièrement et être à l'écoute des sentiments de l'autre.",
        "Organiser une sortie en tête-à-tête régulièrement.",
        "Trouver une activité de loisir commune.",
        "Assister au temple et partager ses sentiments et son témoignage.",
        "Prier ensemble tous les soirs et partager ses impressions spirituelles."
      ],
      es: [
        "Estudiar en pareja el libro 'El matrimonio eterno' y el manual 'Construir un matrimonio eterno'.",
        "Si es necesario, no dudar en consultar a un líder o profesional de relaciones conyugales.",
        "Dar un paseo en pareja regularmente y escuchar los sentimientos del otro.",
        "Organizar una salida romántica regularmente.",
        "Encontrar una actividad recreativa común.",
        "Asistir al templo y compartir sentimientos y testimonio.",
        "Orar juntos cada noche y compartir las impresiones espirituales."
      ],
      en: [
        "Study together 'Eternal Marriage' and 'Building an Eternal Marriage'.",
        "If needed, don't hesitate to consult a leader or marital relations professional.",
        "Take a walk together regularly and listen to each other's feelings.",
        "Plan regular one-on-one outings.",
        "Find a shared leisure activity.",
        "Attend the temple and share feelings and testimony.",
        "Pray together each evening and share spiritual impressions."
      ]
    },
    ideesPastorale: {
      fr: [
        "Suggérer d'étudier ensemble « Fortifier le mariage » — une fois par mois durant six mois.",
        "Enseigner le plan de salut et la doctrine de la famille éternelle.",
        "Accompagner la famille pour aller au temple ou s'y préparer.",
        "Regarder des vidéos de l'Église et discuter du contenu selon l'inspiration de l'Esprit.",
        "Lors d'une période difficile, inviter à demander conseil à des personnes qualifiées et de bonne foi."
      ],
      es: [
        "Sugerir estudiar juntos 'Fortalecer el matrimonio' — una vez al mes durante seis meses.",
        "Enseñar el plan de salvación y la doctrina de la familia eterna.",
        "Acompañar a la familia al templo o ayudarlos a prepararse.",
        "Ver videos de la Iglesia y discutir el contenido según la inspiración del Espíritu.",
        "En tiempos difíciles, invitar a buscar consejo de personas calificadas y de buena fe."
      ],
      en: [
        "Suggest studying 'Strengthening Marriage' together — once a month for six months.",
        "Teach the plan of salvation and the doctrine of the eternal family.",
        "Accompany the family to the temple or help them prepare.",
        "Watch Church videos and discuss content as the Spirit inspires.",
        "During difficult times, invite them to seek counsel from qualified people of good faith."
      ]
    },
    ressourcesEglise: {
      fr: [
        { label: "Foyer et famille", url: "https://www.churchofjesuschrist.org/topics/family?lang=fra" },
        { label: "La Famille – Déclaration au monde", url: "https://www.churchofjesuschrist.org/bc/content/shared/content/french/pdf/language-materials/35602_fra.pdf?lang=fra" },
        { label: "Fortifier le mariage – Manuel", url: "https://www.churchofjesuschrist.org/bc/content/shared/content/french/pdf/language-materials/36889_fra.pdf" }
      ]
    },
    ressourcesCommunautaires: {
      fr: [
        { label: "Tel-aide – (514) 935-1101", url: "http://www.telaide.org/ressources/couple-en-crise/" },
        { label: "Ordre des travailleurs sociaux et thérapeutes du Québec", url: "https://www1.otstcfq.org/" },
        { label: "SOS Violence conjugale", url: "http://www.sosviolenceconjugale.ca/" },
        { label: "811 (Info-santé, Info-social)", url: "https://www.quebec.ca/sante/trouver-une-ressource/consulter-un-professionnel/info-sante-811/" }
      ]
    }
  },
  {
    id: "oeuvre-missionnaire",
    slug: "oeuvre-missionnaire",
    image: "/assets/servicepastoral/bom.webp",
    color: "#2E4A6B",
    num: "05",
    title: {
      fr: "Œuvre missionnaire",
      es: "Obra misional",
      en: "Missionary Work"
    },
    quote: {
      fr: "« L'œuvre missionnaire est la manifestation de notre identité et de notre héritage spirituels. » — David A. Bednar, Liahona, octobre 2005",
      es: "«La obra misional es la manifestación de nuestra identidad y herencia espirituales.» — David A. Bednar, Liahona, octubre 2005",
      en: "\"Missionary work is the manifestation of our spiritual identity and heritage.\" — David A. Bednar, Liahona, October 2005"
    },
    ideesFamille: {
      fr: [
        "S'impliquer avec les missionnaires de votre paroisse dans le cadre de Souviens-toi.",
        "Prier avec une réelle intention d'avoir des opportunités missionnaires.",
        "Nourrir les missionnaires de la paroisse et apprendre à les connaître.",
        "Inviter un ami ou un voisin à une bénédiction, un baptême, un mariage.",
        "Partager une vidéo de l'Évangile sur les médias sociaux.",
        "Donner un Livre de Mormon à quelqu'un.",
        "Partager votre écriture préférée avec quelqu'un que vous aimez."
      ],
      es: [
        "Involucrarse con los misioneros de su parroquia.",
        "Orar con la intención real de tener oportunidades misioneras.",
        "Alimentar a los misioneros de la parroquia y conocerlos.",
        "Invitar a un amigo o vecino a una bendición, bautismo o boda.",
        "Compartir un video del Evangelio en las redes sociales.",
        "Dar un Libro de Mormón a alguien.",
        "Compartir su escritura favorita con alguien que amas."
      ],
      en: [
        "Get involved with the ward missionaries.",
        "Pray with genuine intent for missionary opportunities.",
        "Feed the ward missionaries and get to know them.",
        "Invite a friend or neighbor to a blessing, baptism, or wedding.",
        "Share a Gospel video on social media.",
        "Give someone a Book of Mormon.",
        "Share your favorite scripture with someone you love."
      ]
    },
    ideesPastorale: {
      fr: [
        "Partager des histoires personnelles de succès dans le partage de l'Évangile.",
        "Demander comment les familles ont connu l'Église et obtenu leur témoignage.",
        "Réviser avec les familles les idées pour soutenir l'œuvre missionnaire."
      ],
      es: [
        "Compartir historias personales de éxito al compartir el Evangelio.",
        "Preguntar cómo las familias conocieron la Iglesia y obtuvieron su testimonio.",
        "Revisar con las familias las ideas para apoyar la obra misional."
      ],
      en: [
        "Share personal success stories of sharing the Gospel.",
        "Ask how families came to know the Church and received their testimony.",
        "Review with families the ideas to support missionary work."
      ]
    },
    ressourcesEglise: {
      fr: [
        { label: "Faire connaître l'Évangile rétabli", url: "https://www.churchofjesuschrist.org/study/general-conference/2016/10/sharing-the-restored-gospel?lang=fra" },
        { label: "Pourquoi sommes-nous missionnaires ?", url: "https://www.churchofjesuschrist.org/study/liahona/2009/09/why-do-we-do-missionary-work?lang=fra" },
        { label: "Sept idées simples pour partager l'Évangile", url: "https://www.churchofjesuschrist.org/topics/missionary-work/seven-simple-suggestions-for-sharing-the-gospel?lang=fra" }
      ]
    },
    ressourcesCommunautaires: { fr: [] }
  },
  {
    id: "tourne-vers-avenir",
    slug: "tourne-vers-lavenir",
    image: "/assets/servicepastoral/youth.webp",
    color: "#3A4A2E",
    num: "06",
    title: {
      fr: "Tourné vers l'avenir",
      es: "Mirando hacia el futuro",
      en: "Looking to the Future"
    },
    quote: {
      fr: "« Dieu a un plan pour chacun de nous. En Lui, notre avenir est lumière. » — Pieu Longueuil",
      es: "«Dios tiene un plan para cada uno de nosotros. En Él, nuestro futuro es luz.» — Estaca Longueuil",
      en: "\"God has a plan for each of us. In Him, our future is light.\" — Longueuil Stake"
    },
    ideesFamille: {
      fr: [
        "Établir des objectifs personnels et familiaux fondés sur les principes de l'Évangile.",
        "Planifier les prochaines ordonnances du temple pour chaque membre de la famille.",
        "Étudier régulièrement les Écritures et la Proclamation sur la famille.",
        "Participer aux activités de la paroisse et du pieu.",
        "Identifier les rêves et aspirations de chaque membre de la famille et les soutenir."
      ],
      es: [
        "Establecer metas personales y familiares basadas en los principios del Evangelio.",
        "Planificar las próximas ordenanzas del templo para cada miembro de la familia.",
        "Estudiar regularmente las Escrituras y la Proclamación sobre la familia.",
        "Participar en las actividades de la parroquia y la estaca.",
        "Identificar los sueños y aspiraciones de cada miembro de la familia y apoyarlos."
      ],
      en: [
        "Set personal and family goals grounded in Gospel principles.",
        "Plan upcoming temple ordinances for each family member.",
        "Study the scriptures and the Family Proclamation regularly.",
        "Participate in ward and stake activities.",
        "Identify each family member's dreams and aspirations and support them."
      ]
    },
    ideesPastorale: {
      fr: [
        "Aider la famille à identifier ses forces et son potentiel.",
        "Partager des témoignages d'espoir et de foi en l'avenir.",
        "Encourager la participation aux programmes d'autonomie.",
        "Soutenir la préparation aux ordonnances du temple."
      ],
      es: [
        "Ayudar a la familia a identificar sus fortalezas y potencial.",
        "Compartir testimonios de esperanza y fe en el futuro.",
        "Fomentar la participación en los programas de autosuficiencia.",
        "Apoyar la preparación para las ordenanzas del templo."
      ],
      en: [
        "Help the family identify their strengths and potential.",
        "Share testimonies of hope and faith in the future.",
        "Encourage participation in self-reliance programs.",
        "Support preparation for temple ordinances."
      ]
    },
    ressourcesEglise: {
      fr: [
        { label: "La Proclamation sur la famille", url: "https://www.churchofjesuschrist.org/bc/content/shared/content/french/pdf/language-materials/35602_fra.pdf" },
        { label: "Aide mémorielle – Planifier mon avenir", url: "https://www.churchofjesuschrist.org/study/life-help/self-reliance?lang=fra" }
      ]
    },
    ressourcesCommunautaires: { fr: [] }
  },
  {
    id: "histoire-familiale-temple",
    slug: "histoire-familiale-et-temple",
    image: "/assets/servicepastoral/temple.webp",
    color: "#4A3A6B",
    num: "07",
    title: {
      fr: "Histoire familiale & Temple",
      es: "Historia familiar y Templo",
      en: "Family History & Temple"
    },
    quote: {
      fr: "« Il tournera le cœur des pères vers leurs enfants, et le cœur des enfants vers leurs pères. » — Malachie 4:6",
      es: "«Él hará volver el corazón de los padres hacia los hijos, y el corazón de los hijos hacia los padres.» — Malaquías 4:6",
      en: "\"He shall turn the heart of the fathers to the children, and the heart of the children to their fathers.\" — Malachi 4:6"
    },
    ideesFamille: {
      fr: [
        "Se créer un compte sur FamilySearch et commencer à construire l'arbre généalogique.",
        "Interviewer des parents âgés pour recueillir des histoires et des photos de famille.",
        "Identifier les ancêtres qui n'ont pas encore reçu leurs ordonnances.",
        "Planifier des visites régulières au temple.",
        "Participer aux activités d'histoire familiale de la paroisse ou du pieu."
      ],
      es: [
        "Crear una cuenta en FamilySearch y comenzar a construir el árbol genealógico.",
        "Entrevistar a familiares mayores para recopilar historias y fotos de familia.",
        "Identificar a los antepasados que aún no han recibido sus ordenanzas.",
        "Planificar visitas regulares al templo.",
        "Participar en las actividades de historia familiar de la parroquia o estaca."
      ],
      en: [
        "Create a FamilySearch account and begin building the family tree.",
        "Interview older relatives to collect family stories and photos.",
        "Identify ancestors who have not yet received their ordinances.",
        "Plan regular temple visits.",
        "Participate in ward or stake family history activities."
      ]
    },
    ideesPastorale: {
      fr: [
        "Aider la famille à créer ou enrichir son compte FamilySearch.",
        "Accompagner la famille au temple ou pour s'y préparer.",
        "Connecter la famille avec le spécialiste d'histoire familiale de la paroisse.",
        "Partager des témoignages sur les bénédictions du travail au temple."
      ],
      es: [
        "Ayudar a la familia a crear o enriquecer su cuenta de FamilySearch.",
        "Acompañar a la familia al templo o ayudarles a prepararse.",
        "Conectar a la familia con el especialista de historia familiar de la parroquia.",
        "Compartir testimonios sobre las bendiciones del trabajo en el templo."
      ],
      en: [
        "Help the family create or enrich their FamilySearch account.",
        "Accompany the family to the temple or help them prepare.",
        "Connect the family with the ward family history consultant.",
        "Share testimonies about the blessings of temple work."
      ]
    },
    ressourcesEglise: {
      fr: [
        { label: "FamilySearch", url: "https://www.familysearch.org" },
        { label: "Réservations au temple", url: "https://www.churchofjesuschrist.org/temples" }
      ]
    },
    ressourcesCommunautaires: { fr: [] }
  },
  {
    id: "autonomie-spirituelle",
    slug: "autonomie-spirituelle",
    image: "/assets/servicepastoral/prayer.webp",
    color: "#1B3A6B",
    num: "08",
    title: {
      fr: "Autonomie spirituelle",
      es: "Autosuficiencia espiritual",
      en: "Spiritual Self-Reliance"
    },
    quote: {
      fr: "« Fortifiez votre témoignage, et dans le monde vous aurez de la tribulation ; mais prenez courage, j'ai vaincu le monde. » — Jean 16:33",
      es: "«Fortifiquen su testimonio, y en el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.» — Juan 16:33",
      en: "\"Strengthen your testimony; in the world you will have tribulation. But take heart; I have overcome the world.\" — John 16:33"
    },
    ideesFamille: {
      fr: [
        "Établir une routine quotidienne de prière et d'étude des Écritures.",
        "Tenir un journal personnel de foi et de gratitude.",
        "Participer à toutes les réunions du dimanche et aux activités de la paroisse.",
        "Consacrer du temps à la méditation et à la prière en famille.",
        "Renouveler régulièrement les alliances par la Sainte-Cène."
      ],
      es: [
        "Establecer una rutina diaria de oración y estudio de las Escrituras.",
        "Llevar un diario personal de fe y gratitud.",
        "Participar en todas las reuniones dominicales y actividades de la parroquia.",
        "Dedicar tiempo a la meditación y oración en familia.",
        "Renovar regularmente los convenios mediante la Santa Cena."
      ],
      en: [
        "Establish a daily routine of prayer and scripture study.",
        "Keep a personal journal of faith and gratitude.",
        "Attend all Sunday meetings and ward activities.",
        "Dedicate time to family meditation and prayer.",
        "Regularly renew covenants through the Sacrament."
      ]
    },
    ideesPastorale: {
      fr: [
        "Partager des témoignages personnels de la puissance de la prière.",
        "Enseigner comment l'étude des Écritures peut transformer la vie.",
        "Encourager la famille à fixer des objectifs spirituels mesurables.",
        "Inviter à participer à des activités qui renforcent la foi."
      ],
      es: [
        "Compartir testimonios personales del poder de la oración.",
        "Enseñar cómo el estudio de las Escrituras puede transformar la vida.",
        "Animar a la familia a establecer metas espirituales medibles.",
        "Invitar a participar en actividades que fortalezcan la fe."
      ],
      en: [
        "Share personal testimonies of the power of prayer.",
        "Teach how scripture study can transform life.",
        "Encourage the family to set measurable spiritual goals.",
        "Invite participation in faith-building activities."
      ]
    },
    ressourcesEglise: {
      fr: [
        { label: "Fortifier l'autonomie spirituelle", url: "https://www.churchofjesuschrist.org/study/life-help/self-reliance?lang=fra" },
        { label: "Viens à moi", url: "https://www.comeuntochrist.org/?lang=fra" }
      ]
    },
    ressourcesCommunautaires: { fr: [] }
  }
];

window.FICHES_DATA = FICHES_DATA;
