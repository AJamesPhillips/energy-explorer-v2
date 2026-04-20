import { useState } from "react"

import { InfoBox } from "../../components/InfoBox"
import "./Info.css"


export function Info()
{
    const [show_info_box, set_show_info_box] = useState(false)

    return <div>
        <span
            id="info_button"
            onClick={() => set_show_info_box(true)}
        >
            Info
        </span>

        {show_info_box && <InfoBox
            id="simple_sim_info"
            message={<>
                <h1>Info</h1>

                <p>
                    This is a simplified simulation of the UK's energy system, focused on renewable energy generation and demand.
                </p>

                <p>
                    The grid is divided into 400 squares, each representing about 35 km × 35 km (≈ 1250 km²) of land or sea. Only ⅓ of the sea in the UK's exclusive economic zone (sea) is shown, so the real area of the UK land and sea is twice as large.  The UK is mostly sea!
                </p>

                <p>
                    Click on the grid to add different energy sources.
                    {/* Click on ℹ️ symbols to get more information about each source. */}
                </p>

                <p>
                    Why? To get a better intuitive understanding of the scale of energy demand and renewable energy generation area, and resources required for different sources of energy.
                </p>

            </>}
            on_close={() => set_show_info_box(false)}
        />}
    </div>
}
