
import { land_or_sea_types, LandOrSeaType } from "../data/land_coverage/uk/data"
import { tile_colour } from "./tile"
import "./VisualKey.css"


export function VisualKey()
{
    return <div id="visual_key" className="ui_info_box">
        <div className="ui_info_box_header">
            Visual Key
        </div>

        {Object.keys(land_or_sea_types).map(at =>
        {
            const area_type = at as LandOrSeaType

            const class_name = "visual_key_item " + area_type
            return <div key={area_type} className={class_name}>
                <Mock3dTile colour={tile_colour(area_type)} />{area_type_to_human_readable(area_type)}
            </div>
        })}
    </div>
}

function area_type_to_human_readable(area_type: string): string
{
    area_type = area_type.split("_").map(word =>
    {
        const [first, ...rest] = word.split("")
        if (!first) return word
        return first.toUpperCase() + rest.join("")
    }).join(" ")
    return area_type
}



function Mock3dTile(props: { colour: string })
{
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Diamond */}
        <polygon points="10,6 20,13 10,20 0,13" fill={props.colour} />
    </svg>
}
