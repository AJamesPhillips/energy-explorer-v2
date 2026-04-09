import { SimplifiedLandAreaType } from "../data/land_coverage/uk/data"
import { OffshoreAreaType } from "../data/offshore_coverage/uk/data"
import { LandOrSea } from "./interface"


export type LetterType = (
    | "w"  // woodland
    | "f"  // arable
    | "g"  // grassland
    | "e"  // wetland
    | "r"  // rock
    | "a"  // water
    | "u"  // urban
    | "s"  // suburban

    | "o"  // shallow open sea
    | "d"  // deep open sea
    // | "m"  // farm
)

const map_type_to_letter: {
    land: {[k in SimplifiedLandAreaType]: LetterType}
    sea: {[k in OffshoreAreaType]: LetterType}
} = {
    "land": {
        "woodland": "w",
        "arable": "f",
        "grassland": "g",
        "wetland": "e",
        "rock": "r",
        "inland_water": "a",
        "urban": "u",
        "suburban": "s",
    },
    "sea": {
        "shallow": "o",
        "deep": "d",
        // "farm": "m",
    }
}

export function get_letter_for_land_or_sea(cell: LandOrSea): LetterType
{
    const type_mapping = map_type_to_letter[cell.type] as any
    if (!type_mapping) throw new Error(`No letter mapping for cell type ${cell.type}`)

    const letter = type_mapping[cell.subtype]
    if (!letter) throw new Error(`No letter mapping for cell type ${cell.type} and subtype ${cell.subtype}`)

    return letter
}

const map_letter_to_type = Object.entries(map_type_to_letter).reduce((acc, [type, subtypes]) =>
    {
        const subtype_entries = Object.entries(subtypes as Record<string, LetterType>)
        subtype_entries.forEach(([subtype, letter]) =>
        {
            acc[letter] = { type, subtype } as LandOrSea
        })
        return acc
    }, {} as Record<LetterType, LandOrSea>)


export function get_land_or_sea_for_letter(letter_type: LetterType): LandOrSea
{
    const type_mapping = map_letter_to_type[letter_type]
    if (!type_mapping) throw new Error(`No letter mapping for letter_type ${letter_type}`)

    return type_mapping
}
