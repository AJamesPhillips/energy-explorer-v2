import * as THREE from "three"

import { ILatLon, ILatLonWithIsOnshore } from "core/data/values/LatLon"

import { ModelData } from "../../model/interface"
import pub_sub from "../../state/pub_sub"
import { bakers_blue_material, solar_yellow_material } from "../../utils/colour"
import { convert_lat_lon_to_sphere as convert_lat_lon_to_sphere_orig } from "../../utils/geo/convert_lat_lon_to_sphere"
import { CONSTANTS } from "../CONSTANTS"
import { CommonDependencies } from "../interface"
import { find_hex_grid_mid_points } from "./find_hex_grid_mid_points"
import { find_nearest_neighbours } from "./find_nearest_neighbours"
import { order_in_circular } from "./order_in_circular"



const country_surface_radius = CONSTANTS.countries.surface_radius
function convert_lat_lon_to_sphere(lat_lon: ILatLon)
{
    return convert_lat_lon_to_sphere_orig(lat_lon.lat, lat_lon.lon, country_surface_radius)
}


const DEFAULT_CELL_MATERIAL = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
})

export function create_data_area_visuals(model_data: ModelData, deps: CommonDependencies, earth_mesh: THREE.Mesh)
{
    const {
        onshore_lat_lons,
        offshore_lat_lons,
    } = model_data

    const spatial_data_grid_group = new THREE.Group()

    const all_lat_lons = [...offshore_lat_lons, ...onshore_lat_lons]
    // TODO: explain why we use 43 as threshold here.  It works but why?
    const spatial_data_grid_with_nn = find_nearest_neighbours(all_lat_lons, 43)

    const lat_lon_and_cells: [ILatLonWithIsOnshore, THREE.Mesh][] = []

    spatial_data_grid_with_nn.forEach(lat_lon =>
    {
        const circular_ordered = order_in_circular(spatial_data_grid_with_nn, lat_lon.nearest)
        const mid_points = find_hex_grid_mid_points(lat_lon, spatial_data_grid_with_nn, circular_ordered, true)
        if (!mid_points) return
        const vertices = mid_points
            .map(convert_lat_lon_to_sphere)
            .flatMap(v => [v.x, v.y, v.z])

        const indices: number[] = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 5,
            3, 4, 5,
        ]

        const surface_geometry = new THREE.BufferGeometry()

        surface_geometry.setIndex(indices)
        surface_geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))

        const surface = new THREE.Mesh(surface_geometry, DEFAULT_CELL_MATERIAL)
        spatial_data_grid_group.add(surface)

        lat_lon_and_cells.push([lat_lon, surface])
    })
    earth_mesh.add(spatial_data_grid_group)


    const { datetime_range } = model_data
    const datetime_steps = datetime_range.size()
    let datetime_index = Math.round(datetime_steps/2)
    const summers_day_ms = datetime_range.get_time_stamps()[datetime_index]! // mid day during summer
    const config_of_display: ConfigOfDisplay = { datetime_ms: summers_day_ms, data_type: "wind" }

    update_cell_colours(model_data, lat_lon_and_cells, config_of_display)

    deps.gui.add(config_of_display, "data_type", ["wind", "solar"]).onChange(() =>
    {
        // config_of_display.data_type = data_type
        update_cell_colours(model_data, lat_lon_and_cells, config_of_display)
    })


    const control_animation = { animate: 10 }
    deps.gui.add(control_animation, "animate", [0, 1, 2, 5, 10, 20, 30, 60]).name("Animation speed (fps)")
    let last_animated_at_seconds = 0
    pub_sub.sub("animation_tick", ({ elapsed_seconds }) =>
    {
        if (!control_animation.animate) return
        if ((elapsed_seconds - last_animated_at_seconds) < (1 / control_animation.animate)) return

        last_animated_at_seconds = elapsed_seconds

        datetime_index = (datetime_index + 1) % datetime_steps
        const next_datetime_ms = datetime_range.get_time_stamps()[datetime_index]!
        // Update the datetime_ms to the next step in the range
        config_of_display.datetime_ms = next_datetime_ms
        update_cell_colours(model_data, lat_lon_and_cells, config_of_display)
    })
}

interface ConfigOfDisplay
{
    datetime_ms: number
    data_type: "wind" | "solar"
}

const WIND_SCALE = 1 / 0.991 // 991 is the max capacity factor for wind in the UK in 2018
const SOLAR_SCALE = 1 / 0.891 // 891 is the max capacity factor for solar in the UK in 2018

function update_cell_colours(model_data: ModelData, lat_lon_and_cells: [ILatLonWithIsOnshore, THREE.Mesh][], config_of_display: ConfigOfDisplay)
{
    // Update the cell colour based on the model data
    const {
        hourly_capacity_factor_wind_generation: { onshore: wind_onshore, offshore: wind_offshore },
        hourly_capacity_factor_solar_generation,
    } = model_data

    const { datetime_ms, data_type } = config_of_display
    const show_wind = data_type === "wind"

    lat_lon_and_cells.forEach(([lat_lon, cell_mesh]) =>
    {
        let material: THREE.Material
        if (show_wind)
        {
            const wind = lat_lon.is_onshore
                ? wind_onshore.get({ datetime_ms, lat_lon })!
                : wind_offshore.get({ datetime_ms, lat_lon })!
            material = bakers_blue_material(wind * WIND_SCALE)
        }
        else if (lat_lon.is_onshore)
        {
            const solar = hourly_capacity_factor_solar_generation.get({ datetime_ms, lat_lon })!
            material = solar_yellow_material(solar * SOLAR_SCALE)
        }
        else material = DEFAULT_CELL_MATERIAL

        cell_mesh.material = material
        cell_mesh.material.needsUpdate = true
    })
}
