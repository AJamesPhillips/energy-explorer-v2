import { expect } from "chai"
import { describe } from "mocha"

import { OilGasByYear } from "../../data/fossil_fuels/process_data_component"
import { get_oil_gas_production_by_year } from "./GraphOilGas.helpers"


describe("get_oil_gas_production_by_year", () =>
{
    it("calculates annual production from cumulative values and sets projected years correctly", () =>
    {
        const oil_gas_by_year: OilGasByYear = {
            2023: {
                oil_reserves: { value: 1000, is_projected: false },
                gas_reserves: { value: 2000, is_projected: false },
                cumulative_oil_production: { value: 100, is_projected: false },
                cumulative_gas_production: { value: 250, is_projected: false },
            },
            2024: {
                oil_reserves: { value: 900, is_projected: false },
                gas_reserves: { value: 1800, is_projected: false },
                cumulative_oil_production: { value: 130, is_projected: false },
                cumulative_gas_production: { value: 290, is_projected: false },
            },
            2025: {
                oil_reserves: { value: 800, is_projected: true },
                gas_reserves: { value: 1700, is_projected: true },
                cumulative_oil_production: { value: 165, is_projected: true },
                cumulative_gas_production: { value: 340, is_projected: true },
            },
            2026: {
                oil_reserves: { value: 750, is_projected: true },
                gas_reserves: { value: 1600, is_projected: true },
                cumulative_oil_production: { value: 205, is_projected: true },
                cumulative_gas_production: { value: 390, is_projected: true },
            },
        }

        const production = get_oil_gas_production_by_year(oil_gas_by_year)

        expect(production[2023]!.oil_production.value).to.equal(undefined)
        expect(production[2023]!.gas_production.value).to.equal(undefined)
        expect(production[2024]!.oil_production.value).to.equal(30)
        expect(production[2024]!.gas_production.value).to.equal(40)
        expect(production[2025]!.oil_production.value).to.equal(35)
        expect(production[2025]!.gas_production.value).to.equal(50)
        expect(production[2026]!.oil_production.value).to.equal(40)
        expect(production[2026]!.gas_production.value).to.equal(50)

        expect(production[2024]!.oil_production.is_projected).to.equal(false)
        expect(production[2025]!.oil_production.is_projected).to.equal(false)
        expect(production[2026]!.oil_production.is_projected).to.equal(true)
        expect(production[2024]!.gas_production.is_projected).to.equal(false)
        expect(production[2025]!.gas_production.is_projected).to.equal(false)
        expect(production[2026]!.gas_production.is_projected).to.equal(true)
    })
})
