/**
 * One-off importer for the station directory.
 *
 * The 88 stations below were scraped from petrosol.com.gh/find-our-station,
 * which publishes a name, a manager and a phone number for each. Names and
 * managers are title-cased from the site's ALL CAPS; the transform was verified
 * by round-tripping the 14 North East stations that already lived in
 * `apps/website/src/app/stations/stations-data.ts` — it reproduces all 14
 * byte for byte.
 *
 * Amenities exist only for those same 14. Every other station imports with none
 * and shows no service chips until an editor records them. Nothing is guessed.
 *
 * Idempotent like the other importers: creates what is missing, leaves existing
 * documents alone. Pass `--replace` to overwrite them.
 *
 * Run (dataset comes from apps/studio/.env.local unless overridden):
 *   SANITY_WRITE_TOKEN=… bun run stations:import
 *   SANITY_STUDIO_DATASET=production SANITY_WRITE_TOKEN=… bun run stations:import
 */
import { createClient } from '@sanity/client'

import {
  resolveSanityApiVersion,
  resolveSanityDataset,
  resolveSanityProjectId,
} from '@workspace/config/env'

type StationSeed = {
  name: string
  slug: string
  manager: string
  phones: string[]
  amenities?: string[]
}

type TerritorySeed = {
  name: string
  slug: string
  stations: StationSeed[]
}

const territories: TerritorySeed[] = [
  {
    name: "North East Territory",
    slug: "north-east-territory",
    stations: [
      { name: "PETROSOL Garu No.2 Station", slug: "petrosol-garu-no-2-station", manager: "Vincent Sekle", phones: ["0248376729"], amenities: ["shop", "washroom", "fullcare"] },
      { name: "PETROSOL Pwalugu Station", slug: "petrosol-pwalugu-station", manager: "Albert Akumbisa", phones: ["0543274238"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Bazua Station", slug: "petrosol-bazua-station", manager: "Issaka Abdullah", phones: ["0540218902"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Langbinsi Station", slug: "petrosol-langbinsi-station", manager: "Issah Benjamin", phones: ["0246971612"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Sandema Station", slug: "petrosol-sandema-station", manager: "Alhassan Lansah", phones: ["0246640762"], amenities: ["shop", "washroom", "fullcare"] },
      { name: "PETROSOL Kulungungu Station", slug: "petrosol-kulungungu-station", manager: "Adam Manaan Gambo", phones: ["0595881281"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Tamale Bolga Rd Station", slug: "petrosol-tamale-bolga-rd-station", manager: "Latifa Surazu", phones: ["0549757578"], amenities: ["shop", "washroom", "fullcare"] },
      { name: "PETROSOL Issah Station", slug: "petrosol-issah-station", manager: "Eric Mutakilu", phones: ["0249981160"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Tempane Station", slug: "petrosol-tempane-station", manager: "Ndeogo Maxwell", phones: ["0544554142"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Garu Station", slug: "petrosol-garu-station", manager: "Kwaku Asasim", phones: ["0243019548"], amenities: ["shop", "washroom", "fullcare"] },
      { name: "PETROSOL Zuarungu Station", slug: "petrosol-zuarungu-station", manager: "Bashiru Amaar Kolg", phones: ["0554077729"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Mognori Station", slug: "petrosol-mognori-station", manager: "Hamadu Ubaida", phones: ["0592245206"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Kasaligu Station", slug: "petrosol-kasaligu-station", manager: "Gifty Tamakloe", phones: ["0240441379"], amenities: ["shop", "washroom"] },
      { name: "PETROSOL Daporetindongo Station", slug: "petrosol-daporetindongo-station", manager: "Matthew Kubalimba Adams", phones: ["0201151695", "0553131245"], amenities: ["shop", "washroom"] },
    ],
  },
  {
    name: "North West Territory",
    slug: "north-west-territory",
    stations: [
      { name: "PETROSOL Bole No. 1 Station", slug: "petrosol-bole-no-1-station", manager: "Sadat Mohammed", phones: ["0248704600"] },
      { name: "PETROSOL Banda Nkwanta No.2 Station", slug: "petrosol-banda-nkwanta-no-2-station", manager: "Masaudu Ahmed", phones: ["0242878595"] },
      { name: "PETROSOL Wa Industrial Area (Magazine) Station", slug: "petrosol-wa-industrial-area-magazine-station", manager: "Isaac Dabuo", phones: ["0247971890"] },
      { name: "PETROSOL Tuna Station", slug: "petrosol-tuna-station", manager: "Mohammed Damba Abu", phones: ["0547639949"] },
      { name: "PETROSOL Wa Airport Residential Station", slug: "petrosol-wa-airport-residential-station", manager: "Seidu Memuna", phones: ["0545237679"] },
      { name: "PETROSOL Damongo Station", slug: "petrosol-damongo-station", manager: "Abdulai Samed", phones: ["0206165810"] },
      { name: "PETROSOL Wa Dondoli Station", slug: "petrosol-wa-dondoli-station", manager: "Adinan Yussif", phones: ["0541254169"] },
      { name: "PETROSOL Kalba Station", slug: "petrosol-kalba-station", manager: "Donkor Mohammed", phones: ["0248991672"] },
      { name: "PETROSOL Mangu Station", slug: "petrosol-mangu-station", manager: "Abdul Moomen Nabeel", phones: ["0206869299"] },
      { name: "PETROSOL Napogbakole No. 2 Station", slug: "petrosol-napogbakole-no-2-station", manager: "Umar Osman Jimba", phones: ["0200126677"] },
      { name: "PETROSOL Loho Station", slug: "petrosol-loho-station", manager: "Abdulai Hafishetu", phones: ["0591564830"] },
      { name: "PETROSOL Bole No. 2 Station", slug: "petrosol-bole-no-2-station", manager: "Vivian Kpirko", phones: ["0548644481"] },
      { name: "PETROSOL Sawla Damongo Rd Station", slug: "petrosol-sawla-damongo-rd-station", manager: "John Baptiste Akalimwai", phones: ["0243947514"] },
      { name: "PETROSOL Busa Station", slug: "petrosol-busa-station", manager: "Rashid Iddrisu", phones: ["0246437096"] },
      { name: "PETROSOL Kunfabiala Station", slug: "petrosol-kunfabiala-station", manager: "Avadu Peter Rahman", phones: ["0242542039"] },
      { name: "PETROSOL Kadelso Station", slug: "petrosol-kadelso-station", manager: "Abdul Wahid Ibrahim", phones: ["0543517346"] },
      { name: "PETROSOL Sorbelle Station", slug: "petrosol-sorbelle-station", manager: "Abdul Sallam Sulley", phones: ["0243881298"] },
      { name: "PETROSOL Bamahu Station", slug: "petrosol-bamahu-station", manager: "Yakubu Memuna", phones: ["0544046438"] },
      { name: "PETROSOL Kpasalka Station", slug: "petrosol-kpasalka-station", manager: "Robert Antuongmen", phones: ["0248209050"] },
      { name: "PETROSOL Yapei Station", slug: "petrosol-yapei-station", manager: "Victor Labori", phones: ["0241190837"] },
    ],
  },
  {
    name: "Ashanti Territory",
    slug: "ashanti-territory",
    stations: [
      { name: "PETROSOL Mim Station", slug: "petrosol-mim-station", manager: "Thomas Adu Acheampong", phones: ["0547436077"] },
      { name: "PETROSOL Manso Akropong Service Station", slug: "petrosol-manso-akropong-service-station", manager: "Samuel Mensah", phones: ["0248623272"] },
      { name: "PETROSOL Nkawie Station", slug: "petrosol-nkawie-station", manager: "Eric Awusi", phones: ["0204144900"] },
      { name: "PETROSOL Sunyani Station", slug: "petrosol-sunyani-station", manager: "Justine Anaise", phones: ["0501437855"] },
      { name: "PETROSOL Ohwim Station", slug: "petrosol-ohwim-station", manager: "Ruth Sarpong", phones: ["0243801381"] },
      { name: "PETROSOL Sefwi Boako Station", slug: "petrosol-sefwi-boako-station", manager: "Daniel Duah", phones: ["0240042102"] },
      { name: "PETROSOL Sefwi Adabokrom Station", slug: "petrosol-sefwi-adabokrom-station", manager: "Joseph Sansah Boateng", phones: ["0542657889"] },
      { name: "PETROSOL Sefwi Akaatiso Station", slug: "petrosol-sefwi-akaatiso-station", manager: "Mary Kwarteng", phones: ["0592142270"] },
      { name: "PETROSOL Barekese Service Station", slug: "petrosol-barekese-service-station", manager: "Abigail Mensah", phones: ["0546392485"] },
      { name: "PETROSOL Atwima Takoradi Station", slug: "petrosol-atwima-takoradi-station", manager: "Francis Opoku", phones: ["0247712995"] },
      { name: "PETROSOL Goaso Station", slug: "petrosol-goaso-station", manager: "Thomas Adu-Acheampong", phones: ["0547436077"] },
    ],
  },
  {
    name: "Accra West Territory",
    slug: "accra-west-territory",
    stations: [
      { name: "PETROSOL Adjen Kokotu Station", slug: "petrosol-adjen-kokotu-station", manager: "Seyram Ahiabor", phones: ["0243055971"] },
      { name: "PETROSOL Elmina Station", slug: "petrosol-elmina-station", manager: "Frederick Asare", phones: ["0503531117"] },
      { name: "PETROSOL Israel Station", slug: "petrosol-israel-station", manager: "Lawrence Nyadjor", phones: ["0246521090"] },
      { name: "PETROSOL West Hills Station", slug: "petrosol-west-hills-station", manager: "Fred Asafo", phones: ["0244462005"] },
      { name: "PETROSOL Gbawe Station", slug: "petrosol-gbawe-station", manager: "Albert Teye", phones: ["0246942748"] },
      { name: "PETROSOL Santa Maria Service Station", slug: "petrosol-santa-maria-service-station", manager: "Alhassan Yabdow", phones: ["0555823943"] },
      { name: "PETROSOL Gomoa Jukwa Station", slug: "petrosol-gomoa-jukwa-station", manager: "Hope Gawugah", phones: ["0207973447"] },
      { name: "PETROSOL Kasoa No. 2 Station", slug: "petrosol-kasoa-no-2-station", manager: "Frank Eghan", phones: ["0548568162"] },
      { name: "PETROSOL Akim Swedru Station", slug: "petrosol-akim-swedru-station", manager: "Kelvin Precious Kubuafor", phones: ["0208568021"] },
      { name: "PETROSOL Mankessim Station", slug: "petrosol-mankessim-station", manager: "Adams Amlade", phones: ["0268265641"] },
      { name: "PETROSOL Gomoa Besease Station", slug: "petrosol-gomoa-besease-station", manager: "Ebenezer Okutu", phones: ["0592870934"] },
      { name: "PETROSOL Obom Station", slug: "petrosol-obom-station", manager: "Mitchelle Adjei", phones: ["0557434634"] },
      { name: "PETROSOL Asikasu", slug: "petrosol-asikasu", manager: "Eunice Awotwe", phones: ["0559826795"] },
    ],
  },
  {
    name: "Accra East Territory",
    slug: "accra-east-territory",
    stations: [
      { name: "PETROSOL Kwabenya Service Station", slug: "petrosol-kwabenya-service-station", manager: "Elizabeth Yaribil", phones: ["0501416297"] },
      { name: "PETROSOL Spintex Station", slug: "petrosol-spintex-station", manager: "Peter Bankole", phones: ["0501416172"] },
      { name: "PETROSOL Oyarifa Service Station", slug: "petrosol-oyarifa-service-station", manager: "Charles Edem Doe", phones: ["0508618957"] },
      { name: "PETROSOL Zenu Station", slug: "petrosol-zenu-station", manager: "Prospect Edem Trekpah", phones: ["0246442237"] },
      { name: "PETROSOL Dodowa Station", slug: "petrosol-dodowa-station", manager: "Nancy Addo", phones: ["0248185830"] },
      { name: "PETROSOL Teshie Main Station", slug: "petrosol-teshie-main-station", manager: "Gabriel Tetteh", phones: ["0241046031"] },
      { name: "PETROSOL Oyoko Station", slug: "petrosol-oyoko-station", manager: "Daniel Amofa", phones: ["0241897955"] },
      { name: "PETROSOL Ada Station", slug: "petrosol-ada-station", manager: "Carl Denyu", phones: ["0244476599"] },
      { name: "PETROSOL Teshie Bush Road Service Station", slug: "petrosol-teshie-bush-road-service-station", manager: "Desmond Sakyi", phones: ["0545819474"] },
      { name: "PETROSOL Dawa Station", slug: "petrosol-dawa-station", manager: "Eunice Nyarko", phones: ["0549173163"] },
      { name: "PETROSOL Aboabo Koforidua Station", slug: "petrosol-aboabo-koforidua-station", manager: "Rita Tamakloe", phones: ["0547355079"] },
    ],
  },
  {
    name: "Western Territory",
    slug: "western-territory",
    stations: [
      { name: "PETROSOL Enchi Kwahu Station", slug: "petrosol-enchi-kwahu-station", manager: "Ophelia Mensah", phones: ["0559536635"] },
      { name: "PETROSOL Wassa Akropong Station", slug: "petrosol-wassa-akropong-station", manager: "Patricia Boadu", phones: ["0545937331"] },
      { name: "PETROSOL Dompoase Station", slug: "petrosol-dompoase-station", manager: "Aboagye Appiah", phones: ["0501450743"] },
      { name: "PETROSOL Essamang Station", slug: "petrosol-essamang-station", manager: "Alfred Arthur", phones: ["0240368522"] },
      { name: "PETROSOL Nkotumso Station", slug: "petrosol-nkotumso-station", manager: "Loveland Tweneboah", phones: ["0204429460"] },
      { name: "PETROSOL Buabinso Station", slug: "petrosol-buabinso-station", manager: "Angelina Ofosuhemaa", phones: ["0503100312"] },
      { name: "PETROSOL Enchi Abokyia Station", slug: "petrosol-enchi-abokyia-station", manager: "Augustina Gyamfi", phones: ["0242999294"] },
      { name: "PETROSOL Bawdie Station", slug: "petrosol-bawdie-station", manager: "Christiana Duah", phones: ["0249156943"] },
      { name: "PETROSOL Agyeimpaboa Station", slug: "petrosol-agyeimpaboa-station", manager: "Doreen Obeng", phones: ["0597605358"] },
      { name: "PETROSOL Wassa Kwabeng Station", slug: "petrosol-wassa-kwabeng-station", manager: "Ernest Boateng", phones: ["0501416177"] },
      { name: "PETROSOL Takyikrom Station", slug: "petrosol-takyikrom-station", manager: "Richard Aidoo", phones: ["0246057896"] },
      { name: "PETROSOL Bogoso No.2 Station", slug: "petrosol-bogoso-no-2-station", manager: "Augustine Baidoo", phones: ["0241477928"] },
      { name: "PETROSOL Asakngragua Station", slug: "petrosol-asakngragua-station", manager: "Richard Oduro", phones: ["0204044816"] },
      { name: "PETROSOL Ayanfuri No. 2 Station", slug: "petrosol-ayanfuri-no-2-station", manager: "Emmanuel Amakye", phones: ["0558280202"] },
      { name: "PETROSOL Bogoso No.1 Station", slug: "petrosol-bogoso-no-1-station", manager: "Emelia Coffie", phones: ["0558248723"] },
      { name: "PETROSOL Asankra Saa Station", slug: "petrosol-asankra-saa-station", manager: "Augustine Tetteh", phones: ["0542781912"] },
      { name: "PETROSOL Adansi Asokwa Station", slug: "petrosol-adansi-asokwa-station", manager: "Ebenezer Nyarko", phones: ["0592963093"] },
      { name: "PETROSOL Assin Akonfudi Station", slug: "petrosol-assin-akonfudi-station", manager: "Charlotte Aboagye", phones: ["0593524369"] },
      { name: "PETROSOL Nyamebekyere Station", slug: "petrosol-nyamebekyere-station", manager: "Jennifer Devor", phones: ["0597027232"] },
    ],
  },]

const replace = process.argv.includes('--replace')

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error(
    'Missing SANITY_WRITE_TOKEN. Create an editor token in sanity.io/manage and\n' +
      'pass it inline — it is a secret and does not belong in .env.local.',
  )
  process.exit(1)
}

const dataset = resolveSanityDataset(process.env)
const client = createClient({
  projectId: resolveSanityProjectId(process.env),
  dataset,
  apiVersion: resolveSanityApiVersion(process.env),
  token,
  useCdn: false,
})

async function write(doc: Record<string, unknown>): Promise<'created' | 'kept'> {
  if (replace) {
    await client.createOrReplace(doc as never)
    return 'created'
  }
  const before = await client.fetch<string | null>('*[_id == $id][0]._id', {
    id: doc._id,
  })
  if (before) return 'kept'
  await client.create(doc as never)
  return 'created'
}

async function main() {
  const total = territories.reduce((n, t) => n + t.stations.length, 0)
  console.log(
    `Importing ${territories.length} territories and ${total} stations into ` +
      `"${dataset}"${replace ? ' (overwriting existing documents)' : ''}.`,
  )

  for (const [index, territory] of territories.entries()) {
    const result = await write({
      _id: `stationTerritory-${territory.slug}`,
      _type: 'stationTerritory',
      name: territory.name,
      slug: { _type: 'slug', current: territory.slug },
      order: index,
    })

    let created = 0
    let kept = 0
    for (const [position, station] of territory.stations.entries()) {
      const outcome = await write({
        _id: `station-${station.slug}`,
        _type: 'station',
        name: station.name,
        slug: { _type: 'slug', current: station.slug },
        territory: {
          _type: 'reference',
          _ref: `stationTerritory-${territory.slug}`,
        },
        manager: station.manager,
        phones: station.phones,
        ...(station.amenities?.length ? { amenities: station.amenities } : {}),
        // Global sequence, so territories stay in their published order even
        // when the directory shows them all at once during a search.
        order: index * 100 + position,
      })
      if (outcome === 'created') created++
      else kept++
    }

    console.log(
      `  ${result === 'kept' ? '·' : '✓'} ${territory.name.padEnd(24)} ` +
        `${created} created, ${kept} already present`,
    )
  }

  console.log('Done.')
}

await main()
