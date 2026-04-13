import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

import { useState } from "react"
import { CONSTANTS } from "../scene/CONSTANTS"
import { Earth } from "../scene/earth"
import "../scene/lil-gui.css"
import { StarsV2 } from "./StarsV2"
import { Sun } from "./Sun"



export const DigitalTwin = (props: {}) =>
{
    useThree(({ scene }) =>
    {
        scene.background = new THREE.Color(0x000011)
    })

    const [sun_direction, set_sun_direction] = useState(new THREE.Vector3())

    return <>
        <OrbitControls
            makeDefault
            enableDamping={true}
            rotateSpeed={0.5}
            // Update controls min/max distance based on sun distance and earth radius
            minDistance={CONSTANTS.controls.zoom.min}
            maxDistance={CONSTANTS.controls.zoom.max}
        />
        <PerspectiveCamera
            makeDefault
            position={[5, 0, 0]}
            // position={[12, 5, 4]} // show whole earth
            // Focus on UK
            // camera.position.x = 1.8
            // camera.position.y = 2.65
            // camera.position.z = 0
            // camera.position.x = 1.340
            // camera.position.y = 1.617
            // camera.position.z = 0.192
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[ 5, 5, 5 ]} intensity={0.5} />

        <Sun
            sun_direction={sun_direction}
            set_sun_direction={set_sun_direction}
        />
        <Earth sun_direction={sun_direction} />
        <StarsV2 />
        {/*
        load_and_render_model_data(common_dependencies, earth_mesh)
        load_and_render_countries(common_dependencies, earth_mesh)
        draw_earth_grid(common_dependencies, earth_mesh)
        get_run_display_model()
        */}
    </>
}




// const user_choices: UserChoices = {
//     chosen_region: "UK",
//     wind_mw_power_plants: new DataMap([
//         [
//             new LatLonWithIsOnshore({ lat: 60.8333, lon: -0.7697, is_onshore: true }),
//             { name: "London Wind Farm", installed_mw_capacity: 10000 }
//         ],
//     ], LatLonWithIsOnshore.to_str, LatLonWithIsOnshore.from_str),
//     solar_mw_power_plants: new DataMap([], LatLonWithIsOnshore.to_str, LatLonWithIsOnshore.from_str),
//     storage_mw_power_plants: new DataMap([], LatLonWithIsOnshore.to_str, LatLonWithIsOnshore.from_str),
// }

// async function get_run_display_model()
// {
//     const model_data = await get_model_data()

//     const scenario: ModelScenario = {
//         datetime_range: new DatetimeRange({
//             start: new Date("2018-01-01T00:00:00Z"),
//             end: new Date("2019-01-01T00:00:00Z"),
//             repeat_every: "hour",
//         }),
//     }

//     const model_run_output = run_model(model_data, scenario, user_choices)

//     console.log("Model Run Output:", model_run_output)
//     const hours_lacking_power = model_run_output.hourly_net_supply_mw.filter(v => v < 0).length
//     const total_hours = model_run_output.model_datetime_steps.length
//     const time_without_sufficient_power_supply_percentage = (hours_lacking_power / total_hours) * 100
//     console.log(`% time without sufficient power supply: ${time_without_sufficient_power_supply_percentage.toFixed(2)}% (${hours_lacking_power} hours out of ${total_hours} total hours)`)
//     console.log(`Total generated TWh: ${(model_run_output.hourly_total_generation_mw.reduce((sum, v) => sum + v, 0)/1e6).toFixed(2)} TWh`)
//     console.log(`Net supplied TWh: ${(model_run_output.hourly_net_supply_mw.reduce((sum, v) => sum + v, 0)/1e6).toFixed(2)} TWh`)
// }


// function add_power_plant()
// {
//     user_choices.solar_mw_power_plants.set(
//         new LatLonWithIsOnshore({ lat: 50.9096, lon: 0.0000, is_onshore: true }),
//         { name: "London Solar Farm", installed_mw_capacity: 5000 }
//     )
// }
// ;(window as any).add_power_plant = add_power_plant
// ;(window as any).get_run_display_model = get_run_display_model
