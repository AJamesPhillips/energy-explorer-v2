


/**
 * This function returns the colour and intensity of the sun light at a given
 * datetime and position (latitude and longitude).
 *
 * @param Date datetime
 * @param { lat: number, lon: number } position
 * @returns { colour: string, intensity: number }
 */
export function sun_light_colour_and_intensity_from_datetime_and_latlon(datetime: Date, { lat, lon }: { lat: number, lon: number }, realistic: boolean): { colour: string, intensity: number }
{
    // Calculate the position of the sun in the sky based on the datetime and position parameters
    const sun_position = calculate_sun_position(datetime, { lat, lon })

    // Determine the colour of the sun light based on the angle of the sun in the sky
    const sun_colour = determine_sun_colour(sun_position, realistic)

    // Determine the intensity of the sun light based on the distance of the sun from being directly overhead
    const sun_intensity = determine_sun_intensity(sun_position, realistic)

    return { colour: sun_colour, intensity: sun_intensity }
}


function to_rad (deg: number) { return deg * Math.PI / 180 }
function to_deg (rad: number) { return rad * 180 / Math.PI }


// 365.25 is the mean calendar year length, accounting for leap years.
const DAYS_IN_YEAR = 365.25
const MINUTES_IN_DAY = 24 * 60  // 1440
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000
// Earth rotates 360° in 1440 min → 4 minutes per degree of longitude.
const MINUTES_PER_DEGREE = MINUTES_IN_DAY / 360  // = 4

// Function implemented by Claude Sonnet 4.6 on 2026-04-09
function calculate_sun_position(datetime: Date, { lat, lon }: { lat: number, lon: number }): { azimuth: number, elevation: number }
{
    const year = datetime.getUTCFullYear()
    const year_start = Date.UTC(year, 0, 1)
    const day_of_year = (datetime.getTime() - year_start) / MILLISECONDS_IN_DAY
    const hour_of_day = datetime.getUTCHours() + datetime.getUTCMinutes() / 60 + datetime.getUTCSeconds() / 3600

    const fractional_year = (day_of_year + (hour_of_day - 12) / 24) / DAYS_IN_YEAR
    // Fractional year angle (radians): where Earth currently sits in its annual orbit.
    const fractional_year_angle = 2 * Math.PI * fractional_year

    const declination = get_declination(fractional_year_angle)
    const equation_of_time = get_equation_of_time(fractional_year_angle)

    // True solar time (minutes): clock time corrected for longitude and equation of time.
    const true_solar_time = hour_of_day * 60 + equation_of_time + MINUTES_PER_DEGREE * lon

    // Hour angle (radians): how far the sun is east/west of the local meridian.
    // Solar noon → H = 0 (true_solar_time = 720 min → 720/4 − 180 = 0). ✓
    // Each hour of time corresponds to 15° (= 360° / 24 h).
    const H = to_rad(true_solar_time / MINUTES_PER_DEGREE - 180)

    const lat_rad = to_rad(lat)

    // Elevation above the horizon (degrees, −90 to +90)
    const elevation = to_deg(Math.asin(
        Math.sin(lat_rad) * Math.sin(declination) +
        Math.cos(lat_rad) * Math.cos(declination) * Math.cos(H)
    ))

    // Azimuth measured clockwise from North (degrees, 0–360)
    const azimuth = (to_deg(Math.atan2(
        -Math.cos(declination) * Math.sin(H),
        Math.sin(declination) * Math.cos(lat_rad) - Math.cos(declination) * Math.sin(lat_rad) * Math.cos(H)
    )) % 360 + 360) % 360

    return { azimuth, elevation }
}

function get_declination(fractional_year_angle: number)
{
    // Solar declination (radians): the sun's angle north/south of the celestial equator.
    // This is a Fourier series fit to Earth's orbital mechanics (Spencer 1971).
    // The coefficients are empirically derived; the result ranges ±23.45° at solstices.
    return 0.006918
        - 0.399912 * Math.cos(    fractional_year_angle) + 0.070257 * Math.sin(    fractional_year_angle)
        - 0.006758 * Math.cos(2 * fractional_year_angle) + 0.000907 * Math.sin(2 * fractional_year_angle)
        - 0.002697 * Math.cos(3 * fractional_year_angle) + 0.001480 * Math.sin(3 * fractional_year_angle)
}


function get_equation_of_time(fractional_year_angle: number)
{
    // Equation of time (minutes): offset between apparent and mean solar time,
    // caused by Earth's elliptical orbit and axial tilt.
    // Also a Fourier series fit (Spencer 1971). The leading factor converts the
    // dimensionless Fourier output to minutes: MINUTES_IN_DAY / (2π).
    return (MINUTES_IN_DAY / (2 * Math.PI)) * (
          0.000075
        + 0.001868 * Math.cos(    fractional_year_angle) - 0.032077 * Math.sin(    fractional_year_angle)
        - 0.014615 * Math.cos(2 * fractional_year_angle) - 0.040890 * Math.sin(2 * fractional_year_angle)
    )
}


// colour key-frames: [elevation_degrees, [r, g, b]] — based on observed
// apparent sun-disc colour at various altitudes above the horizon.
const SUN_COLOUR_KEY_FRAMES: [number, number[]][] = [
    [-6,  [  0,   0,   0]],   // below civil twilight — no illumination
    [ 0,  [255,  60,   0]],   // right at horizon — deep red-orange
    [ 4,  [255, 130,   0]],   // just above horizon — orange
    [10,  [255, 200,  50]],   // low sun — amber/gold
    [20,  [255, 235, 120]],   // moderate elevation — pale gold
    [45,  [255, 248, 200]],   // high sun — warm white
    [90,  [255, 255, 255]],   // zenith — white
]


const MIN_COLOUR_WHEN_NOT_REALISTIC = 0.8

// Function implemented by Claude Sonnet 4.6 on 2026-04-09
function determine_sun_colour(sun_position: { azimuth: number, elevation: number }, realistic: boolean)
{
    const { elevation } = sun_position

    // Clamp to the range covered by the key-frames
    const min_el = SUN_COLOUR_KEY_FRAMES[0]![0]!
    const max_el = SUN_COLOUR_KEY_FRAMES[SUN_COLOUR_KEY_FRAMES.length - 1]![0]!
    const el = Math.max(min_el, Math.min(max_el, elevation))

    // Find the surrounding pair and interpolate
    let lower = SUN_COLOUR_KEY_FRAMES[0]!
    let upper = SUN_COLOUR_KEY_FRAMES[SUN_COLOUR_KEY_FRAMES.length - 1]!
    for (let i = 0; i < SUN_COLOUR_KEY_FRAMES.length - 1; i++)
    {
        if (el >= SUN_COLOUR_KEY_FRAMES[i]![0] && el <= SUN_COLOUR_KEY_FRAMES[i + 1]![0])
        {
            lower = SUN_COLOUR_KEY_FRAMES[i]!
            upper = SUN_COLOUR_KEY_FRAMES[i + 1]!
            break
        }
    }

    const range = upper[0] - lower[0]
    const t = range === 0 ? 0 : (el - lower[0]) / range

    let r = Math.round(lower[1][0]! + t * (upper[1][0]! - lower[1][0]!))
    let g = Math.round(lower[1][1]! + t * (upper[1][1]! - lower[1][1]!))
    let b = Math.round(lower[1][2]! + t * (upper[1][2]! - lower[1][2]!))

    if (!realistic)
    {
        r = Math.round(MIN_COLOUR_WHEN_NOT_REALISTIC * 255 + (1 - MIN_COLOUR_WHEN_NOT_REALISTIC) * r)
        g = Math.round(MIN_COLOUR_WHEN_NOT_REALISTIC * 255 + (1 - MIN_COLOUR_WHEN_NOT_REALISTIC) * g)
        b = Math.round(MIN_COLOUR_WHEN_NOT_REALISTIC * 255 + (1 - MIN_COLOUR_WHEN_NOT_REALISTIC) * b)
    }

    return `rgb(${r}, ${g}, ${b})`
}


const MIN_INTENSITY_WHEN_NOT_REALISTIC = 0.8
const MIWNR = MIN_INTENSITY_WHEN_NOT_REALISTIC

// Function implemented by Claude Sonnet 4.6 on 2026-04-09
function determine_sun_intensity(sun_position: { azimuth: number, elevation: number }, realistic: boolean)
{
    const { elevation } = sun_position

    // Sun below the horizon — no direct illumination
    if (elevation <= 0) return realistic ? 0 : MIWNR

    // Air mass (Kasten & Young 1989) — how many atmospheres the light traverses.
    // At zenith AM ≈ 1; at the horizon AM ≈ 38.
    const elevation_rad = elevation * Math.PI / 180
    const air_mass = 1 / (
        Math.sin(elevation_rad) +
        0.50572 * Math.pow(elevation + 6.07995, -1.6364)
    )

    // Broadband transmittance through the atmosphere (Meeus, typical clear-sky).
    // Returns roughly 0.021 at the horizon rising to 0.7 at the zenith.
    const transmittance = Math.pow(0.7, Math.pow(air_mass, 0.678))

    // Normalise so that a zenith sun (transmittance ≈ 0.7) → intensity 1.0
    const ZENITH_TRANSMITTANCE = Math.pow(0.7, Math.pow(1, 0.678)) // ≈ 0.7
    const intensity = Math.min(1, transmittance / ZENITH_TRANSMITTANCE)

    return realistic ? intensity : MIWNR + (1 - MIWNR) * intensity
}
