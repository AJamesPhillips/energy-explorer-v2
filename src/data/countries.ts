import { countries_data, CountryISO2Code } from "./countries_data"


export interface CountryData
{
    name: string
    code: CountryISO2Code
    emoji: string
    implemented: boolean
}

const implemented_countries: Set<CountryISO2Code> = new Set([
    "GB",
])

export function get_country_by_code(code: CountryISO2Code): CountryData | undefined
{
    const raw_country = countries_data.find(c => c.code === code)
    if (!raw_country) return undefined

    const implemented = implemented_countries.has(code)

    return {
        ...raw_country,
        implemented,
    }
}
