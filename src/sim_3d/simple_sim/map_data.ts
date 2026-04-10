import { CellData, CellsData } from "./interface"
import { get_land_or_sea_for_letter, LetterType } from "./map_data_compact"


// Note this comes from running `generate_map_data_string({ x: 20, y: 40 })` and
// then dropping the last 20 rows of deep offshore sea
const map_data = `
rrrwwwwwwwwgggggwwww
wwwwwwwwwwwwfsffffff
fffsusffffffffffffff
ffffffffffgggggggggg
gggggggggggggggggggg
ggssggggffffgggggggg
ggwwwwwggggggsuasggg
ggsggggggggggggagggg
gggggggeeeeeeggausss
uggussggeeeggggooogg
oooooooooooooooooooo
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
                    has_wind_turbine: false,
                    has_solar_farm: false,
                }
                acc[x]![y] = cell_data
            })

            return acc
        }, {} as Record<number, Record<number, CellData>>)
