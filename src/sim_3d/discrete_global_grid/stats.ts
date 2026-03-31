

export function log_dgg_stats(name: string, pentagon_areas: number[], hexagon_areas: number[], areas_known_to_be_incorrect: boolean)
{
    console.log("=== " + name + " ===")

    if (pentagon_areas.length === 0) return
    if (areas_known_to_be_incorrect) console.log(`Areas are known to be incorrect, please see "area_of_polygon_in_km2" function`)

    const pentagon_area = pentagon_areas[0]!
    console.log(`  Pentagon area: ${pentagon_area.toFixed(3)} km²`)

    if (hexagon_areas.length === 0) return
    const min_hexagon_area = Math.min(...hexagon_areas)
    const max_hexagon_area = Math.max(...hexagon_areas)
    console.log(`  Min area: ${min_hexagon_area.toFixed(3)} km²`)
    console.log(`  Max area: ${max_hexagon_area.toFixed(3)} km²`)
    console.log(`  Pentagon/Hexagon Area ratio (max/min): ${(max_hexagon_area / pentagon_area).toFixed(3)} to ${(min_hexagon_area / pentagon_area).toFixed(3)}`)
    console.log(`  Hexagon Area ratio (max/min): ${(max_hexagon_area / min_hexagon_area).toFixed(3)}`)
    console.log(`  Average hexagon area: ${(hexagon_areas.reduce((a, b) => a + b, 0) / hexagon_areas.length).toFixed(6)} km²`)
}
