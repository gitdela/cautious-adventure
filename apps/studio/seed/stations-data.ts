/**
 * The station directory's seed data: Ghana's sixteen regions, PETROSOL's six
 * internal sales territories, and the 88 stations that sit in both.
 *
 * Pure data, no side effects — `stations-import.ts` seeds a fresh dataset from
 * it and `stations-region-backfill.ts` patches an existing one. Keeping it in
 * its own module is what lets both import it; the importer runs `main()` at
 * module scope, so importing from *it* would run an import as a side effect.
 *
 * The 88 stations were scraped from petrosol.com.gh/find-our-station, which
 * publishes a name, a manager and a phone number for each. Amenities exist only
 * for the 14 North East stations. Nothing is guessed there.
 *
 * Regions, however, ARE inferred — the source data has no region column, only a
 * town embedded in each station name. 63 are unambiguous. The 25 marked
 * `// best-bet` are towns whose name appears in more than one region, or which
 * could not be placed confidently at all; they were assigned on the client's
 * instruction to go with the most likely reading rather than leave them blank.
 * They are customer-facing, so correct them here (and re-run the backfill with
 * `--force`) as soon as someone with local knowledge reviews them.
 *
 * Note that region and territory genuinely cross: Ayanfuri and Assin Akonfudi
 * are Central but sit in Western Territory, Adansi Asokwa is Ashanti, and the
 * three Sefwi stations are Western North despite sitting in Ashanti Territory.
 * That is the whole reason the public site had to stop showing territories.
 */

export type RegionSeed = {
  name: string
  slug: string
  order: number
}

export type StationSeed = {
  name: string
  slug: string
  /** Slug of the `RegionSeed` this station belongs to. */
  region: string
  manager: string
  phones: string[]
  amenities?: string[]
}

export type TerritorySeed = {
  name: string
  slug: string
  stations: StationSeed[]
}

/**
 * All sixteen regions, including the four with no station today — an editor
 * adding a Volta site should find Volta in the picker rather than be blocked.
 * The public query hides the empty ones, so the dropdown never offers a dead end.
 *
 * Greater Accra is pinned at 0 because the first region is what the directory
 * opens on, and it is both the capital and the largest group. The rest run
 * alphabetically, numbered in tens so a region can be slotted in later without
 * renumbering its neighbours.
 */
export const regions: RegionSeed[] = [
  { name: 'Greater Accra', slug: 'greater-accra', order: 0 },
  { name: 'Ahafo', slug: 'ahafo', order: 10 },
  { name: 'Ashanti', slug: 'ashanti', order: 20 },
  { name: 'Bono', slug: 'bono', order: 30 },
  { name: 'Bono East', slug: 'bono-east', order: 40 },
  { name: 'Central', slug: 'central', order: 50 },
  { name: 'Eastern', slug: 'eastern', order: 60 },
  { name: 'North East', slug: 'north-east', order: 70 },
  { name: 'Northern', slug: 'northern', order: 80 },
  { name: 'Oti', slug: 'oti', order: 90 },
  { name: 'Savannah', slug: 'savannah', order: 100 },
  { name: 'Upper East', slug: 'upper-east', order: 110 },
  { name: 'Upper West', slug: 'upper-west', order: 120 },
  { name: 'Volta', slug: 'volta', order: 130 },
  { name: 'Western', slug: 'western', order: 140 },
  { name: 'Western North', slug: 'western-north', order: 150 },
]

/**
 * Stations grouped by their internal sales territory — the shape the original
 * scrape arrived in, and still how the importer writes territory references.
 * Each station additionally carries its public `region`.
 */
export const territories: TerritorySeed[] = [
  {
    name: "North East Territory",
    slug: "north-east-territory",
    stations: [
      { name: "PETROSOL Garu No.2 Station", slug: "petrosol-garu-no-2-station", region: "upper-east", manager: "Vincent Sekle", phones: ["0248376729"], amenities: ["shop", "washroom", "fullcare"] },
      { name: "PETROSOL Pwalugu Station", slug: "petrosol-pwalugu-station", region: "upper-east", manager: "Albert Akumbisa", phones: ["0543274238"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Bazua Station", slug: "petrosol-bazua-station", region: "upper-east", manager: "Issaka Abdullah", phones: ["0540218902"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Langbinsi Station", slug: "petrosol-langbinsi-station", region: "north-east", manager: "Issah Benjamin", phones: ["0246971612"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Sandema Station", slug: "petrosol-sandema-station", region: "upper-east", manager: "Alhassan Lansah", phones: ["0246640762"], amenities: ["shop", "washroom", "fullcare"] },
      { name: "PETROSOL Kulungungu Station", slug: "petrosol-kulungungu-station", region: "upper-east", manager: "Adam Manaan Gambo", phones: ["0595881281"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Tamale Bolga Rd Station", slug: "petrosol-tamale-bolga-rd-station", region: "northern", manager: "Latifa Surazu", phones: ["0549757578"], amenities: ["shop", "washroom", "fullcare"] },
      { name: "PETROSOL Issah Station", slug: "petrosol-issah-station", region: "upper-west", manager: "Eric Mutakilu", phones: ["0249981160"], amenities: ["shop", "washroom"] },  // best-bet
      { name: "PETROSOL Tempane Station", slug: "petrosol-tempane-station", region: "upper-east", manager: "Ndeogo Maxwell", phones: ["0544554142"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Garu Station", slug: "petrosol-garu-station", region: "upper-east", manager: "Kwaku Asasim", phones: ["0243019548"], amenities: ["shop", "washroom", "fullcare"] },
      { name: "PETROSOL Zuarungu Station", slug: "petrosol-zuarungu-station", region: "upper-east", manager: "Bashiru Amaar Kolg", phones: ["0554077729"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Mognori Station", slug: "petrosol-mognori-station", region: "upper-east", manager: "Hamadu Ubaida", phones: ["0592245206"], amenities: ["shop", "washroom"] },  // best-bet
      { name: "PETROSOL Kasaligu Station", slug: "petrosol-kasaligu-station", region: "northern", manager: "Gifty Tamakloe", phones: ["0240441379"], amenities: ["shop", "washroom"] },  // best-bet
      { name: "PETROSOL Daporetindongo Station", slug: "petrosol-daporetindongo-station", region: "upper-east", manager: "Matthew Kubalimba Adams", phones: ["0201151695", "0553131245"], amenities: ["shop", "washroom"] },
    ],
  },
  {
    name: "North West Territory",
    slug: "north-west-territory",
    stations: [
      { name: "PETROSOL Bole No. 1 Station", slug: "petrosol-bole-no-1-station", region: "savannah", manager: "Sadat Mohammed", phones: ["0248704600"] },
      { name: "PETROSOL Banda Nkwanta No.2 Station", slug: "petrosol-banda-nkwanta-no-2-station", region: "savannah", manager: "Masaudu Ahmed", phones: ["0242878595"] },
      { name: "PETROSOL Wa Industrial Area (Magazine) Station", slug: "petrosol-wa-industrial-area-magazine-station", region: "upper-west", manager: "Isaac Dabuo", phones: ["0247971890"] },
      { name: "PETROSOL Tuna Station", slug: "petrosol-tuna-station", region: "savannah", manager: "Mohammed Damba Abu", phones: ["0547639949"] },
      { name: "PETROSOL Wa Airport Residential Station", slug: "petrosol-wa-airport-residential-station", region: "upper-west", manager: "Seidu Memuna", phones: ["0545237679"] },
      { name: "PETROSOL Damongo Station", slug: "petrosol-damongo-station", region: "savannah", manager: "Abdulai Samed", phones: ["0206165810"] },
      { name: "PETROSOL Wa Dondoli Station", slug: "petrosol-wa-dondoli-station", region: "upper-west", manager: "Adinan Yussif", phones: ["0541254169"] },
      { name: "PETROSOL Kalba Station", slug: "petrosol-kalba-station", region: "savannah", manager: "Donkor Mohammed", phones: ["0248991672"] },
      { name: "PETROSOL Mangu Station", slug: "petrosol-mangu-station", region: "upper-west", manager: "Abdul Moomen Nabeel", phones: ["0206869299"] },  // best-bet
      { name: "PETROSOL Napogbakole No. 2 Station", slug: "petrosol-napogbakole-no-2-station", region: "upper-west", manager: "Umar Osman Jimba", phones: ["0200126677"] },  // best-bet
      { name: "PETROSOL Loho Station", slug: "petrosol-loho-station", region: "upper-west", manager: "Abdulai Hafishetu", phones: ["0591564830"] },  // best-bet
      { name: "PETROSOL Bole No. 2 Station", slug: "petrosol-bole-no-2-station", region: "savannah", manager: "Vivian Kpirko", phones: ["0548644481"] },
      { name: "PETROSOL Sawla Damongo Rd Station", slug: "petrosol-sawla-damongo-rd-station", region: "savannah", manager: "John Baptiste Akalimwai", phones: ["0243947514"] },
      { name: "PETROSOL Busa Station", slug: "petrosol-busa-station", region: "upper-west", manager: "Rashid Iddrisu", phones: ["0246437096"] },
      { name: "PETROSOL Kunfabiala Station", slug: "petrosol-kunfabiala-station", region: "upper-west", manager: "Avadu Peter Rahman", phones: ["0242542039"] },  // best-bet
      { name: "PETROSOL Kadelso Station", slug: "petrosol-kadelso-station", region: "upper-west", manager: "Abdul Wahid Ibrahim", phones: ["0543517346"] },  // best-bet
      { name: "PETROSOL Sorbelle Station", slug: "petrosol-sorbelle-station", region: "upper-west", manager: "Abdul Sallam Sulley", phones: ["0243881298"] },  // best-bet
      { name: "PETROSOL Bamahu Station", slug: "petrosol-bamahu-station", region: "upper-west", manager: "Yakubu Memuna", phones: ["0544046438"] },
      { name: "PETROSOL Kpasalka Station", slug: "petrosol-kpasalka-station", region: "savannah", manager: "Robert Antuongmen", phones: ["0248209050"] },  // best-bet
      { name: "PETROSOL Yapei Station", slug: "petrosol-yapei-station", region: "savannah", manager: "Victor Labori", phones: ["0241190837"] },
    ],
  },
  {
    name: "Ashanti Territory",
    slug: "ashanti-territory",
    stations: [
      { name: "PETROSOL Mim Station", slug: "petrosol-mim-station", region: "ahafo", manager: "Thomas Adu Acheampong", phones: ["0547436077"] },
      { name: "PETROSOL Manso Akropong Service Station", slug: "petrosol-manso-akropong-service-station", region: "ashanti", manager: "Samuel Mensah", phones: ["0248623272"] },
      { name: "PETROSOL Nkawie Station", slug: "petrosol-nkawie-station", region: "ashanti", manager: "Eric Awusi", phones: ["0204144900"] },
      { name: "PETROSOL Sunyani Station", slug: "petrosol-sunyani-station", region: "bono", manager: "Justine Anaise", phones: ["0501437855"] },
      { name: "PETROSOL Ohwim Station", slug: "petrosol-ohwim-station", region: "ashanti", manager: "Ruth Sarpong", phones: ["0243801381"] },
      { name: "PETROSOL Sefwi Boako Station", slug: "petrosol-sefwi-boako-station", region: "western-north", manager: "Daniel Duah", phones: ["0240042102"] },
      { name: "PETROSOL Sefwi Adabokrom Station", slug: "petrosol-sefwi-adabokrom-station", region: "western-north", manager: "Joseph Sansah Boateng", phones: ["0542657889"] },
      { name: "PETROSOL Sefwi Akaatiso Station", slug: "petrosol-sefwi-akaatiso-station", region: "western-north", manager: "Mary Kwarteng", phones: ["0592142270"] },
      { name: "PETROSOL Barekese Service Station", slug: "petrosol-barekese-service-station", region: "ashanti", manager: "Abigail Mensah", phones: ["0546392485"] },
      { name: "PETROSOL Atwima Takoradi Station", slug: "petrosol-atwima-takoradi-station", region: "ashanti", manager: "Francis Opoku", phones: ["0247712995"] },  // best-bet
      { name: "PETROSOL Goaso Station", slug: "petrosol-goaso-station", region: "ahafo", manager: "Thomas Adu-Acheampong", phones: ["0547436077"] },
    ],
  },
  {
    name: "Accra West Territory",
    slug: "accra-west-territory",
    stations: [
      { name: "PETROSOL Adjen Kokotu Station", slug: "petrosol-adjen-kokotu-station", region: "greater-accra", manager: "Seyram Ahiabor", phones: ["0243055971"] },
      { name: "PETROSOL Elmina Station", slug: "petrosol-elmina-station", region: "central", manager: "Frederick Asare", phones: ["0503531117"] },
      { name: "PETROSOL Israel Station", slug: "petrosol-israel-station", region: "greater-accra", manager: "Lawrence Nyadjor", phones: ["0246521090"] },  // best-bet
      { name: "PETROSOL West Hills Station", slug: "petrosol-west-hills-station", region: "greater-accra", manager: "Fred Asafo", phones: ["0244462005"] },
      { name: "PETROSOL Gbawe Station", slug: "petrosol-gbawe-station", region: "greater-accra", manager: "Albert Teye", phones: ["0246942748"] },
      { name: "PETROSOL Santa Maria Service Station", slug: "petrosol-santa-maria-service-station", region: "greater-accra", manager: "Alhassan Yabdow", phones: ["0555823943"] },
      { name: "PETROSOL Gomoa Jukwa Station", slug: "petrosol-gomoa-jukwa-station", region: "central", manager: "Hope Gawugah", phones: ["0207973447"] },
      { name: "PETROSOL Kasoa No. 2 Station", slug: "petrosol-kasoa-no-2-station", region: "central", manager: "Frank Eghan", phones: ["0548568162"] },  // best-bet
      { name: "PETROSOL Akim Swedru Station", slug: "petrosol-akim-swedru-station", region: "eastern", manager: "Kelvin Precious Kubuafor", phones: ["0208568021"] },
      { name: "PETROSOL Mankessim Station", slug: "petrosol-mankessim-station", region: "central", manager: "Adams Amlade", phones: ["0268265641"] },
      { name: "PETROSOL Gomoa Besease Station", slug: "petrosol-gomoa-besease-station", region: "central", manager: "Ebenezer Okutu", phones: ["0592870934"] },
      { name: "PETROSOL Obom Station", slug: "petrosol-obom-station", region: "greater-accra", manager: "Mitchelle Adjei", phones: ["0557434634"] },
      { name: "PETROSOL Asikasu", slug: "petrosol-asikasu", region: "eastern", manager: "Eunice Awotwe", phones: ["0559826795"] },  // best-bet
    ],
  },
  {
    name: "Accra East Territory",
    slug: "accra-east-territory",
    stations: [
      { name: "PETROSOL Kwabenya Service Station", slug: "petrosol-kwabenya-service-station", region: "greater-accra", manager: "Elizabeth Yaribil", phones: ["0501416297"] },
      { name: "PETROSOL Spintex Station", slug: "petrosol-spintex-station", region: "greater-accra", manager: "Peter Bankole", phones: ["0501416172"] },
      { name: "PETROSOL Oyarifa Service Station", slug: "petrosol-oyarifa-service-station", region: "greater-accra", manager: "Charles Edem Doe", phones: ["0508618957"] },
      { name: "PETROSOL Zenu Station", slug: "petrosol-zenu-station", region: "greater-accra", manager: "Prospect Edem Trekpah", phones: ["0246442237"] },
      { name: "PETROSOL Dodowa Station", slug: "petrosol-dodowa-station", region: "greater-accra", manager: "Nancy Addo", phones: ["0248185830"] },
      { name: "PETROSOL Teshie Main Station", slug: "petrosol-teshie-main-station", region: "greater-accra", manager: "Gabriel Tetteh", phones: ["0241046031"] },
      { name: "PETROSOL Oyoko Station", slug: "petrosol-oyoko-station", region: "eastern", manager: "Daniel Amofa", phones: ["0241897955"] },  // best-bet
      { name: "PETROSOL Ada Station", slug: "petrosol-ada-station", region: "greater-accra", manager: "Carl Denyu", phones: ["0244476599"] },
      { name: "PETROSOL Teshie Bush Road Service Station", slug: "petrosol-teshie-bush-road-service-station", region: "greater-accra", manager: "Desmond Sakyi", phones: ["0545819474"] },
      { name: "PETROSOL Dawa Station", slug: "petrosol-dawa-station", region: "greater-accra", manager: "Eunice Nyarko", phones: ["0549173163"] },
      { name: "PETROSOL Aboabo Koforidua Station", slug: "petrosol-aboabo-koforidua-station", region: "eastern", manager: "Rita Tamakloe", phones: ["0547355079"] },
    ],
  },
  {
    name: "Western Territory",
    slug: "western-territory",
    stations: [
      { name: "PETROSOL Enchi Kwahu Station", slug: "petrosol-enchi-kwahu-station", region: "western-north", manager: "Ophelia Mensah", phones: ["0559536635"] },
      { name: "PETROSOL Wassa Akropong Station", slug: "petrosol-wassa-akropong-station", region: "western", manager: "Patricia Boadu", phones: ["0545937331"] },
      { name: "PETROSOL Dompoase Station", slug: "petrosol-dompoase-station", region: "western", manager: "Aboagye Appiah", phones: ["0501450743"] },  // best-bet
      { name: "PETROSOL Essamang Station", slug: "petrosol-essamang-station", region: "western", manager: "Alfred Arthur", phones: ["0240368522"] },  // best-bet
      { name: "PETROSOL Nkotumso Station", slug: "petrosol-nkotumso-station", region: "western", manager: "Loveland Tweneboah", phones: ["0204429460"] },  // best-bet
      { name: "PETROSOL Buabinso Station", slug: "petrosol-buabinso-station", region: "western", manager: "Angelina Ofosuhemaa", phones: ["0503100312"] },  // best-bet
      { name: "PETROSOL Enchi Abokyia Station", slug: "petrosol-enchi-abokyia-station", region: "western-north", manager: "Augustina Gyamfi", phones: ["0242999294"] },
      { name: "PETROSOL Bawdie Station", slug: "petrosol-bawdie-station", region: "western", manager: "Christiana Duah", phones: ["0249156943"] },
      { name: "PETROSOL Agyeimpaboa Station", slug: "petrosol-agyeimpaboa-station", region: "western", manager: "Doreen Obeng", phones: ["0597605358"] },  // best-bet
      { name: "PETROSOL Wassa Kwabeng Station", slug: "petrosol-wassa-kwabeng-station", region: "western", manager: "Ernest Boateng", phones: ["0501416177"] },
      { name: "PETROSOL Takyikrom Station", slug: "petrosol-takyikrom-station", region: "western", manager: "Richard Aidoo", phones: ["0246057896"] },  // best-bet
      { name: "PETROSOL Bogoso No.2 Station", slug: "petrosol-bogoso-no-2-station", region: "western", manager: "Augustine Baidoo", phones: ["0241477928"] },
      { name: "PETROSOL Asakngragua Station", slug: "petrosol-asakngragua-station", region: "western", manager: "Richard Oduro", phones: ["0204044816"] },
      { name: "PETROSOL Ayanfuri No. 2 Station", slug: "petrosol-ayanfuri-no-2-station", region: "central", manager: "Emmanuel Amakye", phones: ["0558280202"] },  // best-bet
      { name: "PETROSOL Bogoso No.1 Station", slug: "petrosol-bogoso-no-1-station", region: "western", manager: "Emelia Coffie", phones: ["0558248723"] },
      { name: "PETROSOL Asankra Saa Station", slug: "petrosol-asankra-saa-station", region: "western", manager: "Augustine Tetteh", phones: ["0542781912"] },  // best-bet
      { name: "PETROSOL Adansi Asokwa Station", slug: "petrosol-adansi-asokwa-station", region: "ashanti", manager: "Ebenezer Nyarko", phones: ["0592963093"] },  // best-bet
      { name: "PETROSOL Assin Akonfudi Station", slug: "petrosol-assin-akonfudi-station", region: "central", manager: "Charlotte Aboagye", phones: ["0593524369"] },
      { name: "PETROSOL Nyamebekyere Station", slug: "petrosol-nyamebekyere-station", region: "western", manager: "Jennifer Devor", phones: ["0597027232"] },  // best-bet
    ],
  },]

/**
 * Station display order, keyed by station slug.
 *
 * `order` is a single global sequence rather than a per-region counter, so that
 * a search — which spans the whole network and ignores the dropdown — still
 * returns results clustered by region instead of interleaved. Within a region
 * stations are alphabetical, which is the only defensible order when the source
 * data carries no ranking.
 *
 * Shared by the importer and the backfill so the two can never disagree about
 * what `order` means. The x100 block size caps a region at 100 stations before
 * blocks would collide; the largest today is Greater Accra at 15.
 */
export function ordersByStationSlug(): Map<string, number> {
  const regionIndex = new Map(regions.map((region, index) => [region.slug, index]))
  const grouped = new Map<string, StationSeed[]>()

  for (const territory of territories) {
    for (const station of territory.stations) {
      const list = grouped.get(station.region) ?? []
      list.push(station)
      grouped.set(station.region, list)
    }
  }

  const orders = new Map<string, number>()
  for (const [regionSlug, stations] of grouped) {
    const index = regionIndex.get(regionSlug)
    if (index === undefined) {
      throw new Error(`Station region "${regionSlug}" is not in the region list.`)
    }
    const sorted = [...stations].sort((a, b) => a.name.localeCompare(b.name))
    sorted.forEach((station, position) => {
      orders.set(station.slug, index * 100 + position)
    })
  }

  return orders
}
