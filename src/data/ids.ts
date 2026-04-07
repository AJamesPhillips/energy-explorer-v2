import { IdAndMaybeVersion, IdOnly, parse_id } from "core/data/id"
import { EnergyFactorName } from "./interface"


const uk_budget_general = new IdOnly(1239)
const uk_budget_mackay_2009 = new IdOnly(1252)

// Will be fetched, and will recursively fetch all their dependencies.
export const top_ids_to_fetch = [
    uk_budget_general,
    uk_budget_mackay_2009,
]

const cars_uk = new IdOnly(1205)
const planes_uk = new IdOnly(1209)
const heating_cooling_uk = new IdOnly(1220)
const lighting_uk = new IdOnly(1227)
const gadgets_uk = new IdOnly(1228)
const food_and_farming_uk = new IdOnly(1229)
const producing_stuff_uk = new IdOnly(1230)
const transporting_stuff_uk = new IdOnly(1231)
const public_services_uk = new IdOnly(1232)

const onshore_wind = new IdOnly(1206)
const solar_heating_potential_per_person_UK = new IdOnly(1191)
const solar_residential_pv_potential_per_person_UK = new IdOnly(1202)
const solar_farm_pv_potential_per_person_UK = new IdOnly(1204)
const biofuel_potential_per_person_UK = new IdOnly(1210)
const hydro_UK = new IdOnly(1221)
const shallow_offshore_wind_UK = new IdOnly(1222)
const deep_offshore_wind_UK = new IdOnly(1223)
const wave_UK = new IdOnly(1224)
const tide_UK = new IdOnly(1225)
const geothermal_UK = new IdOnly(1226)

export const map_factor_name_to_ido: Record<EnergyFactorName, IdOnly | undefined> = {
    "Car": cars_uk,
    "Jet flights": planes_uk,
    "Heating, cooling": heating_cooling_uk,
    "Light": lighting_uk,
    "Gadgets": gadgets_uk,
    "Food, farming, fertiliser": food_and_farming_uk,
    "Stuff": producing_stuff_uk,
    "Transporting stuff": transporting_stuff_uk,
    "Defence": public_services_uk,

    "Onshore wind": onshore_wind,
    "Solar heating": solar_heating_potential_per_person_UK,
    "PV residential": solar_residential_pv_potential_per_person_UK,
    "PV farm": solar_farm_pv_potential_per_person_UK,
    "Biomass: food, biofuel, wood, waste incineration, landfill gas": biofuel_potential_per_person_UK,
    "Hydroelectricity": hydro_UK,
    "Shallow offshore wind": shallow_offshore_wind_UK,
    "Deep offshore wind": deep_offshore_wind_UK,
    "Wave": wave_UK,
    "Tide": tide_UK,
    "Geothermal": geothermal_UK,
}


// This is not necessary but it slightly increases the initial loading speed of
// the application.  It has been manually created by copying and pasting the
// "Fetching N dependencies... 1191v7, " ... etc. log from the console.
export const other_ids_performance_boost: IdAndMaybeVersion[] = [
    "1191v7",
    "1202v9",
    "1204v4",
    "1205v5",
    "1206v4",
    "1209v7",
    "1210v6",
    "1220v10",
    "1221v4",
    "1222v7",
    "1223v5",
    "1224v4",
    "1225v3",
    "1226v3",
    "1227v4",
    "1228v4",
    "1229v4",
    "1230v5",
    "1231v4",
    "1232v3",
    "1237v1",
    "1238v6",
    "1251v2",
    "1254v2",
    "1255v2",
    "1181v1",
    "1192v3",
    "1193v1",
    "1194v1",
    "1201v2",
    "1203v2",
    "1208v1",
    "1244v5",
    "1245v4",
    "1246v4",
    "1248v3",
    "1253v1",
    "1011v7",
    "1011v9",
    "1187v1",
    "1187v2",
    "1188v3",
    "1190v1",
    "1200v1",
    "1183v1",
    "1184v5",
    "1186v2",
    "1186v4",
    "1189v2",
].map(id => parse_id(id))
