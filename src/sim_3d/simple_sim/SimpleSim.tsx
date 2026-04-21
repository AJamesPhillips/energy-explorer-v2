import { OrthographicCamera } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"

import { uk_coverage } from "../data/coverage/uk/data"
// import uk_daily_power_demand_profiles from "../data/power_demand/uk/daily_profiles.json"
// import { uk_month_hourly_and_location_average_capacity_factor_solar_generation_2018 } from "../data/power_generation/solar_pv"
// import { uk_month_hourly_and_location_average_capacity_factor_wind_generation_2018 } from "../data/power_generation/wind_turbine"
import { PowerStats } from "../model/interface"
import { CellData, CellsData } from "./interface"
import { IsoMetricGrid } from "./IsoMetricGrid"
import { map_data_cells } from "./map_data"
import { PowerStatus } from "./PowerStatus"
import { WelcomeMessage } from "./WelcomeMessage"


// const start_datetime = new Date("2018-06-01T00:00:00.000Z")
// const speed = 1000 * 60 * 60

const GRID_SIZE = { x: 20, y: 20 }
// The visual grid was made from dropping half of the cells (all deep sea cells)
const DROPPED_AREA = 2
const KM2_PER_CELL = uk_coverage.total_uk.total_area_km2 / (GRID_SIZE.x * GRID_SIZE.y * DROPPED_AREA)
const M2_PER_CELL = KM2_PER_CELL * 1e6
function w_per_m2_to_gw_per_cell(w_per_m2: number): number
{
    return w_per_m2 * M2_PER_CELL / 1e9
}
// claimed power density
const land_wind_turbines_w_per_m2 = 2 // https://wikisim.org/wiki/1275v1
const offshore_wind_turbines_w_per_m2 = 3 // https://wikisim.org/wiki/1276
const solar_farm_w_per_m2 = 5  // https://www.withouthotair.com/c6/page_41.shtml#:~:text=5%20W/m2
const solar_built_area_w_per_m2 = 0.633 // W m-2 -- https://wikisim.org/wiki/1274

const CELL_SIZE = 12


export function SimpleSim()
{
    // const power_demand_series = useMemo(() => uk_daily_power_demand_profiles["2010"].average_demand.data, [])
    const [power, set_power] = useState<PowerStats>({
        demand_gw: 0, //Math.round(power_demand_series[3]![2]! as number / 1e3),
        supply_gw: 0,
    })

    const [data, set_data] = useState<CellsData>(() => map_data_cells)

    return <>
        <Canvas id="scene-3d">
            <SimpleSim3d
                data={data}
                set_data={set_data}
                // power={power}
                set_power={set_power}
            />
            <PowerStatus view="simulation" power={power} />
        </Canvas>

        <WelcomeMessage />
    </>
}


interface SimpleSim3dProps
{
    data: CellsData
    set_data: React.Dispatch<React.SetStateAction<CellsData>>
    // power: PowerStats
    set_power: React.Dispatch<React.SetStateAction<PowerStats>>
}
function SimpleSim3d(props: SimpleSim3dProps)
{
    // const [datetime, set_datetime] = useState(start_datetime)
    const sun_ambient_ref = useRef<THREE.AmbientLight>(null)
    const sun_directional_ref = useRef<THREE.DirectionalLight>(null)

    useThree(({ scene }) =>
    {
        scene.background = new THREE.Color(0xeeeeff)
    })

    useFrame((_state, _delta) =>
    {
        // const new_datetime = new Date(datetime.getTime() + (delta * speed))
        // set_datetime(new_datetime)

        // const sun_args = sun_light_colour_and_intensity_from_datetime_and_latlon(new_datetime, lat_lon, false)
        const sun_args = {
            colour: new THREE.Color(255, 248, 200),
            intensity: 0.0075,
        }
        if (sun_ambient_ref.current)
        {
            sun_ambient_ref.current.color = new THREE.Color(sun_args.colour)
            sun_ambient_ref.current.intensity = sun_args.intensity * 0.5
        }
        if (sun_directional_ref.current)
        {
            sun_directional_ref.current.color = new THREE.Color(sun_args.colour)
            sun_directional_ref.current.intensity = sun_args.intensity
        }
    })

    const on_click_tile = useCallback(({ x, y }: { x: number; y: number }) =>
    {
        props.set_data(prev =>
        {
            const cell = prev[x]?.[y]
            if (!cell) return prev

            const new_cell = cycle_cell_contents(cell)

            return {
                ...prev,
                [x]: {
                    ...prev[x],
                    [y]: new_cell
                },
            }
        })
    }, [])

    useEffect(() =>
    {
        const new_power_supply = calculate_power_supply_from_data(props.data)
        props.set_power(existing => ({
            supply_gw: new_power_supply,
            demand_gw: existing.demand_gw,
        }))
    }, [props.data])

    return <>
        <IsoCamera grid_size={GRID_SIZE} cell_size={CELL_SIZE} />
        <ambientLight ref={sun_ambient_ref} />
        <directionalLight ref={sun_directional_ref} position={[ 15, 5, 7 ]} />

        <IsoMetricGrid size={GRID_SIZE} cell_size={CELL_SIZE} data={props.data} on_click_tile={on_click_tile} />
        <Data />
    </>
}



function Data ()
{

    // const wind = useMemo(() => uk_month_hourly_and_location_average_capacity_factor_wind_generation_2018(), [])
    // const solar = useMemo(() => uk_month_hourly_and_location_average_capacity_factor_solar_generation_2018(), [])

    // console.log("coverage", coverage)

    return <></>
}


/**
 * Orthographic camera positioned at the classic isometric angle (45° yaw, ~35° pitch)
 * so the tile grid fills the view. Adjust `zoom` to scale the view, or replace with
 * OrbitControls + target for interactive panning/zooming.
 * Generated by Claude Sonnet 4.6 - 2026-04-09
 */
function IsoCamera({ grid_size, cell_size }: { grid_size: { x: number, y: number }, cell_size: number })
{
    // Centre of the tile grid in world space (tiles start at origin).
    const cx = (grid_size.x - 1) * cell_size / 2
    const cz = (grid_size.y - 1) * cell_size / 2

    // Distance sized so the whole grid fits in view; (1,1,1) direction = iso angle.
    const dist = Math.max(grid_size.x, grid_size.y) * cell_size * 1.5

    const cam_ref = useRef<THREE.OrthographicCamera>(null)

    useEffect(() =>
    {
        cam_ref.current?.lookAt(cx, 0, cz)
    }, [cx, cz])

    return (
        <OrthographicCamera
            ref={cam_ref}
            makeDefault
            position={[cx + dist, dist, cz + dist]}
            zoom={3}
            near={-dist * 4}
            far={dist * 4}
        />
    )
}


function cycle_cell_contents(cell: CellData): CellData
{
    if (cell.type === "sea" && cell.subtype === "shallow")
    {
        if (!cell.has_wind_turbine)
        {
            return { ...cell, has_wind_turbine: true }
        }
        else
        {
            return { ...cell, has_wind_turbine: false }
        }
    }
    else if (cell.type === "land" && (cell.subtype !== "wetland" && cell.subtype !== "inland_water"))
    {
        if (!cell.has_solar_farm && !cell.has_wind_turbine)
        {
            return { ...cell, has_solar_farm: true }
        }
        else if (!cell.has_wind_turbine)
        {
            return { ...cell, has_solar_farm: true, has_wind_turbine: true }
        }
        else if (cell.has_solar_farm && cell.has_wind_turbine)
        {
            return { ...cell, has_solar_farm: false, has_wind_turbine: true }
        }
        else
        {
            return { ...cell, has_solar_farm: false, has_wind_turbine: false }
        }
    }
    return cell
}


function calculate_power_supply_from_data(data: CellsData): number
{
    let supply_gw = 0

    Object.values(data).forEach(column =>
    {
        Object.values(column).forEach(cell_ =>
        {
            const cell = cell_ as CellData

            if (cell.type === "sea" && cell.has_wind_turbine)
            {
                supply_gw += w_per_m2_to_gw_per_cell(offshore_wind_turbines_w_per_m2)
            }
            else if (cell.type === "land")
            {
                if (cell.has_wind_turbine)
                {
                    supply_gw += w_per_m2_to_gw_per_cell(land_wind_turbines_w_per_m2)
                }
                if (cell.has_solar_farm)
                {
                    if (cell.subtype === "suburban" || cell.subtype === "urban")
                    {
                        supply_gw += w_per_m2_to_gw_per_cell(solar_built_area_w_per_m2)
                    }
                    else
                    {
                        supply_gw += w_per_m2_to_gw_per_cell(solar_farm_w_per_m2)
                    }
                }
            }
        })
    })

    return supply_gw
}
