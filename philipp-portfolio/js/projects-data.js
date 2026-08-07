/**
 * Portfolio-Projekte
 * Neues Projekt hinzufügen = neues Objekt in das Array einfügen.
 *
 * Felder:
 *  id           – eindeutige ID (string, keine Leerzeichen)
 *  title        – Projekttitel
 *  brand        – Marke / Kunde
 *  category     – "Markenkampagne" | "Musikpromotion" | "Food-Vlogging" | "Eigene Marke"
 *  description  – Kurzbeschreibung (1–2 Sätze)
 *  type         – "video" | "image"
 *  src          – Pfad zur Video-/Bilddatei (relativ zu index.html)
 *  poster       – Vorschaubild (bei Video als poster-Attribut genutzt)
 *  link         – optionaler externer Link (z. B. Instagram-Post) oder null
 */
const PROJECTS = [
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
    id: "calvin-klein-01",
    title: "Calvin Klein Markenkampagne",
    brand: "Calvin Klein",
    category: "Markenkampagne",
    description: "Content-Piece für Calvin Klein – reduzierte Bildsprache, klare Botschaft, gemacht für den ersten Blick im Feed.",
    type: "video",
    src: "assets/proyectos/calvin-klein-markenkampagne-01.mp4",
    poster: "assets/proyectos/calvin-klein-markenkampagne-01-poster.jpg",
    link: null
  },
  {
    id: "calvin-klein-02",
    title: "Calvin Klein Markenkampagne II",
    brand: "Calvin Klein",
    category: "Markenkampagne",
    description: "Zweiter Teil der Zusammenarbeit mit Calvin Klein – Storytelling über mehrere Szenen mit durchgängigem Look.",
    type: "video",
    src: "assets/proyectos/calvin-klein-markenkampagne-02.mp4",
    poster: "assets/proyectos/calvin-klein-markenkampagne-02-poster.jpg",
    link: null
  },
  {
    id: "temu-01",
    title: "Temu Markenkampagne I",
    brand: "Temu",
    category: "Markenkampagne",
    description: "Langform-Content für Temu mit mehreren Hooks und Produktmomenten, gebaut für hohe Watchtime.",
    type: "video",
    src: "assets/proyectos/temu-markenkampagne-01.mp4",
    poster: "assets/proyectos/temu-markenkampagne-01-poster.jpg",
    link: null
  },
  {
    id: "temu-02",
    title: "Temu Markenkampagne II",
    brand: "Temu",
    category: "Markenkampagne",
    description: "Weiterer Beitrag der Temu-Reihe – schneller Schnitt, klare Call-to-Action, optimiert für TikTok & Reels.",
    type: "video",
    src: "assets/proyectos/temu-markenkampagne-02.mp4",
    poster: "assets/proyectos/temu-markenkampagne-02-poster.jpg",
    link: null
  },
  {
    id: "temu-03",
    title: "Temu Markenkampagne III",
    brand: "Temu",
    category: "Markenkampagne",
    description: "Dritter Clip der Kampagne – Fokus auf Authentizität vor der Kamera statt klassischer Werbe-Optik.",
    type: "video",
    src: "assets/proyectos/temu-markenkampagne-03.mp4",
    poster: "assets/proyectos/temu-markenkampagne-03-poster.jpg",
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
  }
];
