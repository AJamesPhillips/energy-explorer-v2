
export type LandOrSea = {
    type: "land"
    subtype: string
} | {
    type: "sea"
    subtype: string
}

export type CellData = LandOrSea &
{
}

export interface CellsData
{
    [x: number]: {
        [y: number]: CellData
    }
}
