type StationAmenity = "shop" | "washroom" | "fullcare";

type Station = {
  name: string;
  manager: string;
  phones: string[];
  amenities: StationAmenity[];
};

const sw: StationAmenity[] = ["shop", "washroom"];
const swf: StationAmenity[] = ["shop", "washroom", "fullcare"];

const territories: Record<string, Station[]> = {
  "North East Territory": [
    {
      name: "PETROSOL Garu No.2 Station",
      manager: "Vincent Sekle",
      phones: ["0248376729"],
      amenities: swf,
    },
    {
      name: "PETROSOL Pwalugu Station",
      manager: "Albert Akumbisa",
      phones: ["0543274238"],
      amenities: sw,
    },
    {
      name: "PETROSOL Bazua Station",
      manager: "Issaka Abdullah",
      phones: ["0540218902"],
      amenities: sw,
    },
    {
      name: "PETROSOL Langbinsi Station",
      manager: "Issah Benjamin",
      phones: ["0246971612"],
      amenities: sw,
    },
    {
      name: "PETROSOL Sandema Station",
      manager: "Alhassan Lansah",
      phones: ["0246640762"],
      amenities: swf,
    },
    {
      name: "PETROSOL Kulungungu Station",
      manager: "Adam Manaan Gambo",
      phones: ["0595881281"],
      amenities: sw,
    },
    {
      name: "PETROSOL Tamale Bolga Rd Station",
      manager: "Latifa Surazu",
      phones: ["0549757578"],
      amenities: swf,
    },
    {
      name: "PETROSOL Issah Station",
      manager: "Eric Mutakilu",
      phones: ["0249981160"],
      amenities: sw,
    },
    {
      name: "PETROSOL Tempane Station",
      manager: "Ndeogo Maxwell",
      phones: ["0544554142"],
      amenities: sw,
    },
    {
      name: "PETROSOL Garu Station",
      manager: "Kwaku Asasim",
      phones: ["0243019548"],
      amenities: swf,
    },
    {
      name: "PETROSOL Zuarungu Station",
      manager: "Bashiru Amaar Kolg",
      phones: ["0554077729"],
      amenities: sw,
    },
    {
      name: "PETROSOL Mognori Station",
      manager: "Hamadu Ubaida",
      phones: ["0592245206"],
      amenities: sw,
    },
    {
      name: "PETROSOL Kasaligu Station",
      manager: "Gifty Tamakloe",
      phones: ["0240441379"],
      amenities: sw,
    },
    {
      name: "PETROSOL Daporetindongo Station",
      manager: "Matthew Kubalimba Adams",
      phones: ["0201151695", "0553131245"],
      amenities: sw,
    },
  ],
  "North West Territory": [],
  "Accra East": [],
  "Accra West": [],
};

const territoryNames = Object.keys(territories);

export { territories, territoryNames, type Station, type StationAmenity };
