import { SimplifiedLandAreaType } from "../data/land_coverage/uk/data"
import { OffshoreAreaType } from "../data/offshore_coverage/uk/data"


export type LandOrSea = {
    type: "land"
    subtype: SimplifiedLandAreaType
} | {
    type: "sea"
    subtype: OffshoreAreaType
}

export type CellData = LandOrSea &
{
    has_wind_turbine: boolean
    // altitude_m: number
}

export interface CellsData
{
    [x: number]: {
        [y: number]: CellData
    }
}
