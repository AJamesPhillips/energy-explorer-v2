import { DataComponentExtended } from "../data/interface"


export interface GraphForRendering
{
    component: DataComponentExtended
    children: GraphForRendering[]
    alternative: DataComponentExtended | undefined
}


export interface VisibleNode
{
    graph: GraphForRendering
    children: VisibleNode[]
    /** Number of graph children not shown due to display_width limit. */
    overflow_count: number
}

export interface PlacedNode
{
    /** null when this is an overflow placeholder ("show N more"). */
    graph: GraphForRendering | null
    overflow_count: number
    /** Centre-x in SVG coordinate space. */
    cx: number
    /** Top-y in SVG coordinate space. */
    y: number
    parent_cx: number | null
    parent_bottom: number | null
}
