import { LandOrSea } from "./interface";


export function tile_colour(type: LandOrSea): string
{
    if (type.type === "land")
    {
        switch (type.subtype)
        {
            case "woodland": return "#228B22"
            case "arable": return "#DEB887"
            case "grassland": return "#7CFC00"
            case "wetland": return "#698b2e"
            case "rock": return "#A9A9A9"
            case "inland_water": return "#399cff"
            case "urban": return "#696969"
            case "suburban": return "#D3D3D3"
        }
    }
    else if (type.type === "sea")
    {
        switch (type.subtype)
        {
            case "shallow": return "#0d84fa"
            case "deep": return "#0a5096"
            // case "farm": return "#00BFFF"
            // case "turbine": return "#87CEFA"
            // case "oilrig": return "#4682B4"
        }
    }

    return "#FFFFFF"
}
