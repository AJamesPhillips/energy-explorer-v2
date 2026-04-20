import { countries_data, CountryISO2Code, CountryISO3Code } from "./countries_data"


export interface CountryData
{
    name: string
    code2: CountryISO2Code
    code3: CountryISO3Code
    emoji: string
    implemented: boolean
    votes: number
}

const implemented_countries: Set<CountryISO2Code> = new Set([
    "GB",
])

export const extended_countries_data: CountryData[] = countries_data.map(c => ({
    ...c,
    implemented: implemented_countries.has(c.code2),
    votes: 0,
}))

export function get_country_by_code(code2: CountryISO2Code): CountryData | undefined
{
    return extended_countries_data.find(c => c.code2 === code2)
}
