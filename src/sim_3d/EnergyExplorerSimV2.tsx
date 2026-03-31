import { useEffect, useRef } from "preact/hooks"

import { DataMap } from "core/data/values/DataMap"
import { DatetimeRange } from "core/data/values/DatetimeRange"
import { LatLonWithIsOnshore } from "core/data/values/LatLon"

import { draw_earth_grid } from "./discrete_global_grid"
import { GUI } from "./gui/GUI"
import { run_model } from "./model"
import { ModelScenario, UserChoices } from "./model/interface"
import { animate } from "./scene/animate"
import { load_and_render_countries } from "./scene/countries/load_and_render_countries"
import { create_common_dependencies } from "./scene/create_common_dependencies"
import { create_sun } from "./scene/create_sun"
import { create_earth } from "./scene/earth"
import { get_model_data, load_and_render_model_data } from "./scene/spatial_data/load_and_render_model_data"
import { handle_window_resize } from "./utils/handle_window_resize"



export const EnergyExplorerSimV2 = () =>
{
    const canvas_ref = useRef<HTMLCanvasElement>(null)

    useEffect(() =>
    {
        if (!canvas_ref.current) return

        return setup_sim(canvas_ref.current)
    }, [])

    return <div>
        <canvas ref={canvas_ref} id="scene-3d"/>
        <GUI />
    </div>
}

function setup_sim(canvas: HTMLCanvasElement)
{
    const screen_sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
        pixel_ratio: Math.min(window.devicePixelRatio, 2)
    }

    const common_dependencies = create_common_dependencies(canvas, screen_sizes)
    const cleanup_handle_window_resize = handle_window_resize(common_dependencies, screen_sizes)
    const { controls, renderer } = common_dependencies

    const { subscribe_to_sun_direction } = create_sun(common_dependencies)
    const earth_mesh = create_earth(common_dependencies, subscribe_to_sun_direction)
    load_and_render_countries(common_dependencies, earth_mesh)
    load_and_render_model_data(common_dependencies, earth_mesh)

    animate(common_dependencies, earth_mesh)

    draw_earth_grid(common_dependencies, earth_mesh)

    get_run_display_model()

    // Cleanup
    return () => {
        controls.dispose()
        renderer.dispose()
        cleanup_handle_window_resize()
    }
}


const user_choices: UserChoices = {
    chosen_region: "UK",
    wind_mw_power_plants: new DataMap([
        [
            new LatLonWithIsOnshore({ lat: 60.8333, lon: -0.7697, is_onshore: true }),
            { name: "London Wind Farm", installed_mw_capacity: 10000 }
        ],
    ], LatLonWithIsOnshore.to_str, LatLonWithIsOnshore.from_str),
    solar_mw_power_plants: new DataMap([], LatLonWithIsOnshore.to_str, LatLonWithIsOnshore.from_str),
    storage_mw_power_plants: new DataMap([], LatLonWithIsOnshore.to_str, LatLonWithIsOnshore.from_str),
}

async function get_run_display_model()
{
    const model_data = await get_model_data()

    const scenario: ModelScenario = {
        datetime_range: new DatetimeRange({
            start: new Date("2018-01-01T00:00:00Z"),
            end: new Date("2019-01-01T00:00:00Z"),
            repeat_every: "hour",
        }),
    }

    const model_run_output = run_model(model_data, scenario, user_choices)

    console.log("Model Run Output:", model_run_output)
    const hours_lacking_power = model_run_output.hourly_net_supply_mw.filter(v => v < 0).length
    const total_hours = model_run_output.model_datetime_steps.length
    const time_without_sufficient_power_supply_percentage = (hours_lacking_power / total_hours) * 100
    console.log(`% time without sufficient power supply: ${time_without_sufficient_power_supply_percentage.toFixed(2)}% (${hours_lacking_power} hours out of ${total_hours} total hours)`)
    console.log(`Total generated TWh: ${(model_run_output.hourly_total_generation_mw.reduce((sum, v) => sum + v, 0)/1e6).toFixed(2)} TWh`)
    console.log(`Net supplied TWh: ${(model_run_output.hourly_net_supply_mw.reduce((sum, v) => sum + v, 0)/1e6).toFixed(2)} TWh`)
}


function add_power_plant()
{
    user_choices.solar_mw_power_plants.set(
        new LatLonWithIsOnshore({ lat: 50.9096, lon: 0.0000, is_onshore: true }),
        { name: "London Solar Farm", installed_mw_capacity: 5000 }
    )
}
;(window as any).add_power_plant = add_power_plant
;(window as any).get_run_display_model = get_run_display_model
