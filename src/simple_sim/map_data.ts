import { CellData, CellsData } from "./interface"


const map_data = `
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
wwwwwwwwww
`.trim()


export const map_data_cells: CellsData = map_data
    .split("\n")
    .reduce((acc, line, y) =>
        {
            const cells = line.trim().split("")
            cells.forEach((_, x) =>
            {
                if (!acc[x]) acc[x] = {}
                const cell_data: CellData = {
                    type: "land",
                    subtype: "woodland",
                }
                acc[x]![y] = cell_data
            })

            return acc
        }, {} as Record<number, Record<number, CellData>>)
