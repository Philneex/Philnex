/**
 * Portfolio-Projekte
 * Neues Projekt hinzufügen = neues Objekt in das Array einfügen.
 *
 * Felder:
 *  id           – eindeutige ID (string, keine Leerzeichen)
 *  title        – Projekttitel
 *  brand        – Marke / Kunde
 *  category     – "Markenkampagne" | "Musikpromotion" | "Food-Vlogging" | "Eigene Marke" | "Spec Campaign" | "UGC"
 *                 ("UGC" = UGC-Videos; Probe-Ads ohne Auftrag tragen "Spec Ad" im Titel)
 *                 ("Spec Campaign" = eigenständig konzipiertes Konzeptprojekt ohne offiziellen Markenauftrag)
 *  description  – Kurzbeschreibung (1–2 Sätze)
 *  type         – "video" | "image"
 *  src          – Pfad zur Video-/Bilddatei (relativ zu index.html)
 *  poster       – Vorschaubild (bei Video als poster-Attribut genutzt)
 *  link         – optionaler externer Link (z. B. Instagram-Post) oder null
 */
const PROJECTS = [
  {
    id: "aftertaste-01",
    title: "The Aftertaste – Kurzfilm",
    brand: "Eigene Marke",
    category: "Eigene Marke",
    description: "Eigenständiges Kreativprojekt, Cinematic Satire (2:27 Min.): Eine kurzfristig zurückgezogene Jobzusage wird zum satirischen Kurzfilm – von Konzept und Creative Direction bis Schnitt und Sounddesign aus einer Hand.",
    type: "video",
    src: "assets/aftertaste/the-aftertaste.mp4",
    poster: "assets/aftertaste/poster.jpg",
    link: null
  },
  {
    id: "ugc-dw-home-candle",
    title: "DW Home Marshmallow Cherry – UGC Spec Ad",
    brand: "DW Home (Spec)",
    category: "UGC",
    description: "UGC Spec Ad für die Marshmallow-Cherry-Kerze von DW Home – eigenständig konzipiert und in meinem Studio produziert: Flammen, karamellisierte Marshmallows und Kirschen erzählen den Duft. Keine offizielle Zusammenarbeit.",
    type: "video",
    src: "assets/ugc/dw-home-candle-ugc-spec.mp4",
    poster: "assets/ugc/dw-home-candle-ugc-spec-poster.jpg",
    link: null
  },
  {
    id: "diesel-01",
    title: "Diesel Markenkampagne",
    brand: "Diesel",
    category: "Markenkampagne",
    description: "Vertikaler Kampagnen-Clip für Diesel mit Fokus auf starken Hook in den ersten Sekunden und schnellem, rhythmischem Schnitt.",
    type: "video",
    src: "assets/proyectos/diesel-markenkampagne-01.mp4",
    poster: "assets/proyectos/diesel-markenkampagne-01-poster.jpg",
    link: null
  },
  {
    id: "alfric-eden-01",
    title: "Alfric Eden Markenkampagne",
    brand: "Alfric Eden",
    category: "Markenkampagne",
    description: "Vertikaler Streetwear-Clip für Alfric Eden – extreme Weitwinkel-Perspektiven, Bewegung direkt in die Kamera und schneller Schnitt, der das Outfit in Szene setzt.",
    type: "video",
    src: "assets/proyectos/alfric-eden-markenkampagne-01.mp4",
    poster: "assets/proyectos/alfric-eden-markenkampagne-01-poster.jpg",
    link: null
  },
  {
    id: "art-of-techno-01",
    title: "Art of Techno Markenkampagne",
    brand: "Art of Techno",
    category: "Markenkampagne",
    description: "Vertikaler Clip für Art of Techno – gedreht auf der Rolltreppe mit Fisheye-Optik, rhythmisch geschnitten, die Prints der Kollektion im Mittelpunkt.",
    type: "video",
    src: "assets/proyectos/art-of-techno-markenkampagne-01.mp4",
    poster: "assets/proyectos/art-of-techno-markenkampagne-01-poster.jpg",
    link: null
  },
  {
    id: "calvin-klein-01",
    title: "Calvin Klein Spec Campaign",
    brand: "Calvin Klein (Spec)",
    category: "Spec Campaign",
    description: "Spec Campaign für Calvin Klein – eigenständig konzipiert und produziert, um zu zeigen, wie ich mit einer bestehenden Marke arbeiten würde. Keine offizielle Zusammenarbeit.",
    type: "video",
    src: "assets/proyectos/calvin-klein-markenkampagne-01.mp4",
    poster: "assets/proyectos/calvin-klein-markenkampagne-01-poster.jpg",
    link: null
  },
  {
    id: "calvin-klein-02",
    title: "Calvin Klein Spec Campaign II",
    brand: "Calvin Klein (Spec)",
    category: "Spec Campaign",
    description: "Zweiter Teil der Spec Campaign für Calvin Klein – Storytelling über mehrere Szenen mit durchgängigem Look. Eigenständiges Konzept, keine offizielle Zusammenarbeit.",
    type: "video",
    src: "assets/proyectos/calvin-klein-markenkampagne-02.mp4",
    poster: "assets/proyectos/calvin-klein-markenkampagne-02-poster.jpg",
    link: null
  },
  {
    id: "sang-sang-01",
    title: "Sang Sang – Food-Vlog",
    brand: "Sang Sang",
    category: "Food-Vlogging",
    description: "Food-Vlogging-Content aus dem Sang Sang in Wien – von der Bestellung bis zum ersten Bissen, gedreht und geschnitten aus einer Hand.",
    type: "video",
    src: "assets/proyectos/sang-sang-food-vlogging-01.mp4",
    poster: "assets/proyectos/sang-sang-food-vlogging-01-poster.jpg",
    link: null
  },
  {
    id: "tokki-01",
    title: "Tokki – Food-Vlog",
    brand: "Tokki",
    category: "Food-Vlogging",
    description: "Food-Vlog aus dem Tokki – nahbares Storytelling mit starkem Hook und viel Persönlichkeit vor der Kamera.",
    type: "video",
    src: "assets/proyectos/tokki-food-vlogging-01.mp4",
    poster: "assets/proyectos/tokki-food-vlogging-01-poster.jpg",
    link: null
  },
  {
    id: "tortilla-01",
    title: "Tortilla de Patata by Phil – Kochvideo",
    brand: "Eigene Marke",
    category: "Eigene Marke",
    description: "Eigenes Kochformat: Tortilla de Patata – vom kurzen Dialog als Einstieg über jeden einzelnen Schritt bis zum Wenden und Anschneiden, so geschnitten, dass man direkt nachkochen kann.",
    type: "video",
    src: "assets/proyectos/tortilla-de-patata-kochvideo-01.mp4",
    poster: "assets/proyectos/tortilla-de-patata-kochvideo-01-poster.jpg",
    link: null
  },
  {
    id: "salmon-dill-01",
    title: "Salmon in Dill Sauce by Phil – Kochvideo",
    brand: "Eigene Marke",
    category: "Eigene Marke",
    description: "Eigenes Kochformat: Lachs in Dillsauce – von der Zubereitung bis zum angerichteten Teller, in ruhigen, appetitlichen Bildern erzählt.",
    type: "video",
    src: "assets/proyectos/salmon-dill-kochvideo-01.mp4",
    poster: "assets/proyectos/salmon-dill-kochvideo-01-poster.jpg",
    link: null
  },
  {
    id: "meatballs-01",
    title: "Meatballs by Phil – Kochvideo",
    brand: "Eigene Marke",
    category: "Eigene Marke",
    description: "Eigenes Kochformat: Meatballs in Tomatensauce – Dampf, Textur und Close-ups, die Lust aufs Nachkochen machen.",
    type: "video",
    src: "assets/proyectos/meatballs-kochvideo-01.mp4",
    poster: "assets/proyectos/meatballs-kochvideo-01-poster.jpg",
    link: null
  }
];
