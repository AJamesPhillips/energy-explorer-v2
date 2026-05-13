import { Text } from "@react-three/drei"

import { SolarFarmsInit } from "./tiles/SolarFarm"
import { WindTurbineInit } from "./tiles/WindTurbine"


export function InitialiseGeometriesEtc({ cell_size }: { cell_size: number })
{
    return <>
        {/* Render an empty bit of Text otherwise when Drei Text is first rendered
            it causes the whole scene to unmount and remount for some reason. */}
        <Text>{""}</Text>
        <SolarFarmsInit cell_size={cell_size} />
        <WindTurbineInit cell_size={cell_size} />
    </>
}
