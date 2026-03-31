import * as THREE from "three"


// Convert lat/lon to 3D sphere coordinates
export const convert_lat_lon_to_array_sphere = (lat: number, lon: number, radius: number): [number, number, number] =>
{
    const phi = (90 - lat) * Math.PI / 180
    const theta = -lon * Math.PI / 180

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    return [x, y, z]
}


export const convert_lat_lon_to_sphere = (lat: number, lon: number, radius: number) =>
{
    return new THREE.Vector3(...convert_lat_lon_to_array_sphere(lat, lon, radius))
}
