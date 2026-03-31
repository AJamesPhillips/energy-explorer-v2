

export interface BasicIcosahedralGridConfig
{
    type: "standard-icosahedron"
    radius: number
    subdivisions: number  // For icosahedron
    color?: number
    wireframe?: boolean
    align_with_dymaxion?: boolean // Optional, default true
}

export interface H3GridConfig
{
    type: "h3"
    radius: number
    h3_resolution: number
    color?: number
    wireframe?: boolean
}

export interface FibonacciGridConfig
{
    type: "fibonacci"
    radius: number
    num_points?: number  // For Fibonacci points
    color?: number
    wireframe?: boolean
}

export type GridConfig = (
    BasicIcosahedralGridConfig
    | H3GridConfig
    | FibonacciGridConfig
)
