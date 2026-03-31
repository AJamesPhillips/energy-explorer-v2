import type { Position } from "geojson"
import type { FeatureCollectionWithFilename } from "shpjs"
import * as THREE from "three"

import { convert_lat_lon_to_sphere as convert_lat_lon_to_sphere_orig } from "../../utils/geo/convert_lat_lon_to_sphere"
import { CONSTANTS } from "../CONSTANTS"
import { create_country_surface } from "./create_country_surface"


const country_surface_radius = CONSTANTS.countries.surface_radius
function convert_lat_lon_to_sphere(lat: number, lon: number)
{
    return convert_lat_lon_to_sphere_orig(lat, lon, country_surface_radius)
}


export const create_country_area_visuals = (geojson: FeatureCollectionWithFilename) =>
{
    const country_lines_group = new THREE.Group()
    const country_surfaces_group = new THREE.Group()

    geojson.features.forEach(feature => {
        const country_name = feature.properties!.ADMIN
        // Make full country name
        let full_country_name = feature.properties!.ADMIN
        const formal_name = feature.properties!.FORMAL_EN || feature.properties!.FORMAL_FR
        const extra_full_name_parts: string[] = []
        if (feature.properties!.ADMIN !== formal_name) extra_full_name_parts.push(formal_name)
        if (feature.properties!.ADMIN !== feature.properties!.SOVEREIGNT) extra_full_name_parts.push(feature.properties!.SOVEREIGNT)
        if (extra_full_name_parts.length) full_country_name += ` (${extra_full_name_parts.join(", ")})`

        const geometry = feature.geometry

        if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon")
        {
            console.warn(`Unsupported geometry type: ${geometry.type} for country: ${country_name}`)
            return
        }
        // Handle both Polygon and MultiPolygon
        const coordinates: Position[][][] = geometry.type === "Polygon"
            ? [geometry.coordinates]
            : geometry.coordinates

        coordinates.forEach(polygon =>
        {
            polygon.forEach((ring, ringIndex) =>
            {
                // Only process the outer ring (index 0), skip holes for simplicity
                if (ringIndex > 0) return

                const points = ring.reduce((acc, coord) =>
                {
                    acc.push(convert_lat_lon_to_sphere(coord[1]!, coord[0]!))
                    return acc
                }, [] as THREE.Vector3[])

                // Create outline (visible lines)
                const line_geometry = new THREE.BufferGeometry().setFromPoints(points)
                const line_material = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.3
                })
                const line = new THREE.Line(line_geometry, line_material)
                // line.userData = { country_name, full_country_name, is_country_outline: true, type: "outline" }
                country_lines_group.add(line)

                // Create solid surface for raycasting
                if (points.length >= 3)
                {
                    const surface = create_country_surface(points, country_surface_radius, country_name)
                    surface.userData = { country_name, full_country_name, is_country_outline: true, type: "surface", points }
                    country_surfaces_group.add(surface)
                }
            })
        })
    })

    return {
        country_lines_group,
        country_surfaces_group,
    }
}
