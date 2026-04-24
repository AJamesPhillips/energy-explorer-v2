import { OffshoreAreaType, SimplifiedLandAreaType } from "../data/land_coverage/uk/data"


export type LandOrSea = {
    type: "land"
    subtype: SimplifiedLandAreaType
} | {
    type: "sea"
    subtype: OffshoreAreaType
}

export type CellData = LandOrSea &
{
    x: number
    y: number
    has_wind_turbine: boolean
    has_solar_farm: boolean
    has_oil_rig: OilRigConfig | undefined
    // has_hydro: boolean
    // altitude_m: number
}

export interface CellsData
{
    [x: number]: {
        [y: number]: CellData
    }
}


export type OilRigState = "extracting" | "dormant"
export type OilRigConfig = { state: OilRigState }
