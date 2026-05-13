export interface BuildingResource {
  title: string;
  url: string;
  category: string;
  description: string;
}

export const buildingResources: BuildingResource[] = [
  // Konstruktion & stomme
  {
    title: "Enkelstugan — Svenskt Trä Byggbeskrivning",
    url: "https://www.byggbeskrivningar.se/utvandigt/enkelstugan/",
    category: "Konstruktion",
    description: "Komplett ritnings- och byggbeskrivning för enkelstuga 40 m². Fritt tillgänglig.",
  },
  {
    title: "Svensk Trä — Byggregler",
    url: "https://www.svenskttra.se/bygg-med-tra/byggande/byggregler/",
    category: "Konstruktion",
    description: "Byggregler och konstruktionsguider för träbyggnad.",
  },
  {
    title: "TräGuiden — Ytterväggar",
    url: "https://www.traguiden.se/konstruktion/konstruktiv-utformning/stomme/vaggar/yttervaggar/",
    category: "Konstruktion",
    description: "Uppbyggnad och U-värden för ytterväggskonstruktioner i trä.",
  },
  {
    title: "TräGuiden — Sadeltak",
    url: "https://www.traguiden.se/konstruktion/konstruktiv-utformning/stomme/tak/sadeltak/",
    category: "Konstruktion",
    description: "Konstruktionsdetaljer för sadeltak i trä.",
  },

  // Byggregler & lov
  {
    title: "Boverket — Nya byggregler (2025/2026)",
    url: "https://www.boverket.se/sv/PBL-kunskapsbanken/regler-om-byggande/byggregelsystemet/nya-byggregler/",
    category: "Byggregler",
    description: "Nya byggregler som ersätter BBR. Övergångsperiod till 1 juli 2026.",
  },
  {
    title: "Boverket — Om BBR",
    url: "https://www.boverket.se/sv/byggande/regler-for-byggande/om-boverkets--byggregler-bbr/",
    category: "Byggregler",
    description: "Boverkets byggregler (BBR) — gäller parallellt med nya regler till juli 2026.",
  },
  {
    title: "Boverket — Komplementbyggnad",
    url: "https://www.boverket.se/sv/PBL-kunskapsbanken/lov--byggande/anmalningsplikt/byggnader/nybyggnad/komplementbyggnad/",
    category: "Byggregler",
    description: "Nya regler för komplementbyggnad (ersätter friggebod/attefallshus).",
  },
  {
    title: "Boverket — Komplementbostadshus",
    url: "https://www.boverket.se/sv/PBL-kunskapsbanken/lov--byggande/anmalningsplikt/byggnader/nybyggnad/komplementbostadshus/",
    category: "Byggregler",
    description: "Regler för komplementbostadshus (självständig bostad utan bygglov).",
  },
  {
    title: "Bygglov24 — Bygga utan bygglov 2026",
    url: "https://www.bygglov24.se/guide/bygga-utan-bygglov",
    category: "Byggregler",
    description: "Guide till vad som gäller för bygglovsfria åtgärder 2026.",
  },

  // Isolering
  {
    title: "ISOVER — Isoleringsguide småhus",
    url: "https://www.isover.se/losningar/smahus",
    category: "Isolering",
    description: "Isoleringstjocklekar och lösningar för småhus.",
  },
  {
    title: "Byggahus.se — Isolera med rätt tjocklek",
    url: "https://www.byggahus.se/isolera-med-ratt-tjocklek-och-metod",
    category: "Isolering",
    description: "Guide till isolertjocklekar och metoder.",
  },

  // Våtrum
  {
    title: "Boverket — Badrum och våtrum",
    url: "https://www.boverket.se/sv/PBL-kunskapsbanken/regler-om-byggande/boverkets-byggregler/fuktsakerhet/badrum-och-andra-vatrum/",
    category: "Våtrum",
    description: "BBR-krav för fuktsäkerhet i badrum och andra våtrum.",
  },
  {
    title: "GVK — Tätskikt i våtrum (BBV)",
    url: "https://sakravatrum.gvk.se/branschregler-2016-1/2-tatskikt-i-vatrum/",
    category: "Våtrum",
    description: "GVK branschregler för tätskikt. BBV26:1 gäller från 1 januari 2026.",
  },
  {
    title: "Weber — Tätskikt steg för steg",
    url: "https://www.se.weber/tat-och-vattat/tatskikt",
    category: "Våtrum",
    description: "Praktisk guide till tätskiktsapplicering.",
  },

  // Tak
  {
    title: "Moelven — Takstolar",
    url: "https://www.moelven.com/se/byggsystem/takstolar/",
    category: "Tak",
    description: "Prefab-takstolar — beställning och dimensionering.",
  },
  {
    title: "Uppsala Takläggare — Minsta taklutning",
    url: "https://uppsala-taklaggare.se/minsta-taklutning-for-tegel-betong-plat-guide-och-tabell/",
    category: "Tak",
    description: "Guide till minsta taklutning för olika takmaterial.",
  },

  // Grund
  {
    title: "Byggmax — Guide till plintgrund",
    url: "https://www.byggmax.se/bygga/grund/plintgrund",
    category: "Grund",
    description: "Steg-för-steg-guide för plintgrund.",
  },
  {
    title: "Isolergrund — Vanliga misstag krypgrund",
    url: "https://www.isolergrund.se/post/vanliga-misstag-vid-byggnation-av-krypgrund",
    category: "Grund",
    description: "Vanliga misstag vid grundläggning och krypgrunder.",
  },

  // Fukt & kallställning
  {
    title: "LFS — Kallställt hus och mögel",
    url: "https://www.lfs-web.se/kallstallt-hus-mogel.htm",
    category: "Fukt",
    description: "Risker med kallställda hus — mögel och kondens i golvbjälklag.",
  },
  {
    title: "Avfuktningsteknik — Fukt i fritidshus",
    url: "https://avfuktningsteknik.se/fukt-och-mogel-i-fritidshus-vanliga-problem-och-losningar/",
    category: "Fukt",
    description: "Vanliga fuktproblem i fritidshus och lösningar.",
  },

  // Fasad & fönster
  {
    title: "Moelven — Fasadpanel montering",
    url: "https://www.moelven.com/se/wood/fasadpanel/",
    category: "Fasad",
    description: "Monteringsanvisning för fasadpanel.",
  },
  {
    title: "Elitfönster — Monteringsanvisning",
    url: "https://www.elitfonster.se/monteringsanvisningar/",
    category: "Fönster",
    description: "Monteringsanvisningar för fönster och dörrar.",
  },

  // Övrigt
  {
    title: "Kährs — Golvläggningsanvisning",
    url: "https://www.kahrs.com/sv-se/laggningsanvisningar/",
    category: "Golv",
    description: "Läggningsanvisning för trägolv och parkett.",
  },
  {
    title: "Gyproc — System och lösningar",
    url: "https://www.gyproc.se/system-och-losningar",
    category: "Innervägg",
    description: "Monteringsanvisning för gipsskivor.",
  },
];
