import { CellsData, LandOrSea } from "./interface"
import { get_land_or_sea_for_letter, LetterType } from "./map_data_compact"


// Note this comes from running `generate_map_data_string({ x: 20, y: 40 })` and
// then dropping the last 20 rows of deep offshore sea
const map_data = `
rrrwwwwwwwwwwwwwwwww
wwwwwwwwwwwwffffffff
ffffffffffffffffffff
ffffffffffgggggggggg
gggggggggggggggggggg
gggggggggggggggggggg
gggggggggggggggggggg
gggggggggggggggggggg
gggggggeeeeeeeeeaaau
uuuusssssssssssssooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooooo
oooooooooooooooooodd
dddddddddddddddddddd
dddddddddddddddddddd
dddddddddddddddddddd
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
                acc[x]![y] = get_land_or_sea_for_letter(cell as LetterType)
            })

            return acc
        }, {} as Record<number, Record<number, LandOrSea>>)
