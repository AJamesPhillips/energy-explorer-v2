import { component_is_number } from "core/data/component_is"
import { truncate } from "core/utils/truncate"

import { PlacedNode } from "./interface"
import { NODE_H, NODE_W } from "./layout_constants"
import {
    compute_differences,
    format_diff_text,
    get_color_for_relative_difference,
    get_numeric_result_value,
    render_component,
} from "./utils"


const MAX_TITLE_CHARS = 40
const MIN_REL_DIFF = 0.01
const MAX_REL_DIFF = 0.25

export function GraphNode(props: { node: PlacedNode, key?: string })
{
    const { node } = props
    const x = node.cx - NODE_W / 2
    const y = node.y

    if (node.graph === null)
    {
        return <g>
            <rect
                x={x}
                y={y}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                fill="#f5f5f5"
                stroke="#ccc"
                strokeWidth={1}
                strokeDasharray="4 3"
            />
            <text
                x={node.cx}
                y={y + NODE_H / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fill="#666"
            >
                {`show ${node.overflow_count} more`}
            </text>
        </g>
    }

    const diff = compute_differences(
        node.graph.component,
        node.graph.alternative,
    )
    const background_colour = diff === false
        ? "#aaa"
        : get_color_for_relative_difference(diff?.relative || 0, MIN_REL_DIFF, MAX_REL_DIFF)
    const title = render_component(node.graph.component)
    // @ts-ignore
    const title_short = truncate(title, MAX_TITLE_CHARS)
    const diff_text = diff ? format_diff_text(diff.absolute, diff.relative) : false

    const numeric_value = component_is_number(node.graph.component) ? get_numeric_result_value(node.graph.component) : undefined

    let href = `https://wikisim.org/wiki/${node.graph.component.id.to_str()}`

    const multiple_versions = node.graph.component.multiple_versions
    const newer_version_available = multiple_versions && multiple_versions.latest_version > node.graph.component.id.version
    if (newer_version_available)
    {
        // href = `https://wikisim.org/wiki/${node.graph.component.id.id}`
    }

    return <g>
        <a
            href={href}
            rel="noopener noreferrer"
        >
            <rect
                x={x}
                y={y}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                fill={background_colour}
                stroke="#999"
                strokeWidth={1}
                cursor="pointer"
            >
                <title>{title}</title>
            </rect>

            {/* <text
                x={node.cx}
                y={y + 22}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight="bold"
                fill="#222"
                cursor="default"
                pointerEvents="none"
            >
                {title_short}
            </text> */}
            {diff_text && <>
                <text
                    x={node.cx}
                    y={y + 15}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fill="#444"
                    pointerEvents="none"
                >
                    {diff_text.line1}
                </text>
                <text
                    x={node.cx}
                    y={y + 28}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fill="#444"
                    pointerEvents="none"
                >
                    {diff_text.line2}
                </text>
            </>}
            {!diff_text && numeric_value !== undefined && <text
                x={node.cx}
                y={y + 21}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fill="#444"
                pointerEvents="none"
            >
                {/* {numeric_value.toFixed(0)} */}
            </text>}

            {newer_version_available && <UpdateVersionIcon
                x={x + NODE_W - 22}
                y={y + NODE_H - 22}
                version={multiple_versions!.latest_version}
            />}
        </a>
    </g>
}


function UpdateVersionIcon(props: { x: number, y: number, version: number })
{
    return <g transform={`translate(${props.x}, ${props.y})`}>
        <rect
            x={0}
            y={0}
            width={20}
            height={20}
            fill="rgba(0, 0, 0, 0)"
        ></rect>
        <path d="M10 6 L 10 10.5 L 12.3 12.8" stroke="#000" stroke-width="2" fill="none"/>
        <path
            d="M10 19a9 9 0 1 0-7.85 -4.6L.5 16H6v-5.5l-2.38 2.38A7 7 0 1 1 10 17v2"
            stroke-width="1"
            transform="scale(-1,1) translate(-20,0)"
        />
        <title>A newer version of this component is in this graph, please upgrade this one to match v{props.version}</title>
    </g>
}
