import { ARROW_SIZE } from "./layout_constants"


export function Connector(props: {
    parent_cx: number
    parent_bottom: number
    child_cx: number
    child_top: number
})
{
    const { parent_cx, parent_bottom, child_cx, child_top } = props
    const mid_y = Math.round((parent_bottom + child_top) / 2)

    const d = [
        `M ${parent_cx} ${parent_bottom}`,
        `V ${mid_y}`,
        `H ${child_cx}`,
        // `V ${child_top - ARROW_SIZE}`,
        `V ${child_top - 0}`,
    ].join(" ")

    const arrow_points_start = [
        `${parent_cx - ARROW_SIZE / 2},${parent_bottom + ARROW_SIZE}`,
        `${parent_cx + ARROW_SIZE / 2},${parent_bottom + ARROW_SIZE}`,
        `${parent_cx},${parent_bottom}`,
    ].join(" ")

    // const arrow_points_end = [
    //     `${child_cx - ARROW_SIZE / 2},${child_top - ARROW_SIZE}`,
    //     `${child_cx + ARROW_SIZE / 2},${child_top - ARROW_SIZE}`,
    //     `${child_cx},${child_top}`,
    // ].join(" ")

    return <>
        <path d={d} fill="none" stroke="#888" strokeWidth={1.5} />
        <polygon points={arrow_points_start} fill="#888" />
        {/* <polygon points={arrow_points_end} fill="#888" /> */}
    </>
}
