

const earth_radius = 2 // Radius of the Earth in arbitrary units
// For spatial data surfaces, slightly above the Earth surface but below the country surface
const spatial_data_surface_radius = earth_radius + 0.009
// Slightly above the surface for visibility
const country_surface_radius = earth_radius + 0.010
const sun_distance = 20 // Distance of Sun from the Earth in arbitrary units
export const CONSTANTS =
{
    controls: {
        zoom: {
            // + 0.1 works to avoid moving beneath earth surface but
            // + 0.2 required to avoid moving beneath the country surface and
            // spatial data surface
            min: earth_radius + 0.11,
            max: sun_distance - 0.1,
            min_speed: 0.01,
            max_speed: 0.7,
        },
    },

    earth:
    {
        radius: earth_radius,
        rotation_speed:
        {
            base: 0.3,
            max: 0.1,
        },
    },
    sun_distance,

    countries: {
        surface_radius: country_surface_radius,
        initial_colour: 0x00ff00,
        initial_opacity: 0,
        country_responds_to_pointer: true,
    },
    spatial_data: {
        surface_radius: spatial_data_surface_radius,
        // opacity: 0.5,
    },
}
