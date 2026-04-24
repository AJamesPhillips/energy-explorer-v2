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
const existing_manual_votes: Partial<Record<CountryISO2Code, number>> = {
    "GB": 7,
    "IN": 2,
    "FR": 2,
}

export const extended_countries_data: CountryData[] = countries_data.map(c => ({
    ...c,
    implemented: implemented_countries.has(c.code2),
    votes: existing_manual_votes[c.code2] ?? 0,
}))
.sort((a, b) => a.name.localeCompare(b.name)) // sort alphabetically by name

export function get_country_by_code(code2: CountryISO2Code): CountryData | undefined
{
    return extended_countries_data.find(c => c.code2 === code2)
}
