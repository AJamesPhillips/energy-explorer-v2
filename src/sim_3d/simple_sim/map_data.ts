import { CellData, CellsData } from "./interface"
import { get_land_or_sea_for_letter, LetterType } from "./map_data_compact"


// Note this comes from running `generate_map_data_string({ x: 20, y: 40 })` and
// then dropping the last 20 rows of deep offshore sea
const map_data = `
rrrwwwwwwwwgggggwwww
wwwwwwwwwwwwfsffffff
fffsusffffffffffffff
ffffffffffggggggusgg
gggggggggggggggggggg
ggssggggffffgggggggg
ggwwwwwggggggsuasggg
ggsggggggggggggagggg
ggggouggeeeeeegaggss
ugggossggeeegggogoog
ooogooooooooooooooog
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooddooooooooo
oooooooodddooooooooo
ooooooodddddddoooooo
dddddddddddddooooodd
ddddoddddddddddddddd
dddoodddddddddoodddd
dddddddddddddddddddd
`.trim()


const infrastructure_map_data = `
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
____________________
________________x___
______x_____________
____________________
`.trim()

type InfraColumn = Record<number, { has_oil_rig: boolean}>
const xy_to_infra: Record<number, InfraColumn> = {}
infrastructure_map_data.split("\n")
    .forEach((line, y) =>
    {
        const cells = line.trim().split("")
        cells.forEach((cell, x) =>
        {
            if (!xy_to_infra[x]) xy_to_infra[x] = {}
            const has_oil_rig = cell === "x"
            if (has_oil_rig)
            {
                xy_to_infra[x][y] = { has_oil_rig }
            }
        })
    })


export const map_data_cells: CellsData = map_data
    .split("\n")
    .reduce((acc, line, y) =>
        {
            const cells = line.trim().split("")
            cells.forEach((cell, x) =>
            {
                if (!acc[x]) acc[x] = {}
                const cell_data: CellData = {
                    ...get_land_or_sea_for_letter(cell as LetterType),
                    x,
                    y,
                    has_wind_turbine: false,
                    has_solar_farm: false,
                    has_oil_rig: !!(xy_to_infra[x]![y]?.has_oil_rig),
                }
                acc[x][y] = cell_data
            })

            return acc
        }, {} as Record<number, Record<number, CellData>>)
