import shp from "shpjs"
import * as THREE from "three"

import { CommonDependencies } from "../interface"
import { create_country_area_visuals } from "./create_country_area_visuals"
import { respond_to_pointer_events } from "./respond_to_pointer_events"


export function load_and_render_countries (deps: CommonDependencies, earth_mesh: THREE.Mesh)
{
    shp("http://localhost:5174/data/countries/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp")
    .then(geojson =>
    {
        if (Array.isArray(geojson)) throw new Error("Expected geojson to be single object but got array")
        const { country_lines_group, country_surfaces_group } = create_country_area_visuals(geojson)
        earth_mesh.add(country_lines_group)
        earth_mesh.add(country_surfaces_group)

        // console .log(`Loaded ${geojson.features.length} countries`)

        respond_to_pointer_events(deps, earth_mesh, country_surfaces_group)
    })
}
