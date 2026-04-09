import { ThreeEvent } from "@react-three/fiber"
import { useCallback, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

import { CellsData, LandOrSea } from "./interface"
import { tile_colour } from "./tile"


interface TileInfo
{
    x: number
    y: number
    cell: LandOrSea
}

export interface TileEvent
{
    x: number
    y: number
    cell: LandOrSea
}

interface IsoMetricGridProps
{
    size: { x: number, y: number }
    cell_size: number
    data: CellsData
    on_click_tile?: (tile: TileEvent) => void
    /** Fired with null when the pointer leaves the grid entirely. */
    on_hover_tile?: (tile: TileEvent | null) => void
}
const TREES_PER_TILE = 3
const BUILDINGS_PER_URBAN = 3
const BUILDINGS_PER_SUBURBAN = 3

export function IsoMetricGrid(props: IsoMetricGridProps)
{
    const { size, cell_size, data, on_click_tile, on_hover_tile } = props

    const mesh_ref = useRef<THREE.InstancedMesh>(null)
    const tree_mesh_ref = useRef<THREE.InstancedMesh>(null)
    const urban_mesh_ref = useRef<THREE.InstancedMesh>(null)
    const suburban_mesh_ref = useRef<THREE.InstancedMesh>(null)
    const hover_ref = useRef<THREE.Group>(null)


    const tiles = useMemo<TileInfo[]>(() =>
    {
        const result: TileInfo[] = []
        for (let y = 0; y < size.y; y++)
        {
            for (let x = 0; x < size.x; x++)
            {
                const cell = data[x]?.[y]
                if (cell) result.push({ x, y, cell })
            }
        }
        return result
    }, [data, size.x, size.y])


    const { geometry, material } = useMemo(() => {
        return {
            geometry: make_tile_geometry(cell_size),
            material: new THREE.MeshStandardMaterial({ vertexColors: true }),
        }
    }, [cell_size])

    const { tree_geo, tree_mat } = useMemo(() =>
    {
        const h = cell_size * 0.3
        const r = cell_size * 0.12
        return {
            tree_geo: new THREE.ConeGeometry(r, h, 6),
            tree_mat: new THREE.MeshStandardMaterial({ color: 0x1a4a1a }),
        }
    }, [cell_size])

    const { urban_geo, urban_mat } = useMemo(() =>
    {
        return {
            urban_geo: new THREE.BoxGeometry(cell_size * 0.22, cell_size * 0.45, cell_size * 0.22),
            urban_mat: new THREE.MeshStandardMaterial({ color: 0x8899aa }),
        }
    }, [cell_size])

    const { suburban_geo, suburban_mat } = useMemo(() =>
    {
        return {
            suburban_geo: new THREE.BoxGeometry(cell_size * 0.32, cell_size * 0.18, cell_size * 0.32),
            suburban_mat: new THREE.MeshStandardMaterial({ color: 0xAB5154 }),
        }
    }, [cell_size])

    const { hover_outline_geo, hover_glow_geo, hover_outline_mat, hover_glow_mat } = useMemo(() =>
    {
        const s = cell_size * 0.97
        const h = cell_size * 0.065
        const box_for_edges = new THREE.BoxGeometry(s, h, s)
        const edges = new THREE.EdgesGeometry(box_for_edges)
        box_for_edges.dispose()
        return {
            hover_outline_geo: edges,
            hover_glow_geo: new THREE.BoxGeometry(s + cell_size * 0.04, h, s + cell_size * 0.04),
            hover_outline_mat: new THREE.LineBasicMaterial({ color: 0xffff44 }),
            hover_glow_mat: new THREE.MeshBasicMaterial({ color: 0xffff44, transparent: true, opacity: 0.12 }),
        }
    }, [cell_size])

    const woodland_tiles = useMemo(
        () => tiles.filter(t => t.cell.type === "land" && t.cell.subtype === "woodland"),
        [tiles],
    )

    const urban_tiles = useMemo(
        () => tiles.filter(t => t.cell.type === "land" && t.cell.subtype === "urban"),
        [tiles],
    )

    const suburban_tiles = useMemo(
        () => tiles.filter(t => t.cell.type === "land" && t.cell.subtype === "suburban"),
        [tiles],
    )

    useEffect(() => () =>
    {
        geometry.dispose()
        material.dispose()
        tree_geo.dispose()
        tree_mat.dispose()
        urban_geo.dispose()
        urban_mat.dispose()
        suburban_geo.dispose()
        suburban_mat.dispose()
        hover_outline_geo.dispose()
        hover_glow_geo.dispose()
        hover_outline_mat.dispose()
        hover_glow_mat.dispose()
    }, [geometry, material, tree_geo, tree_mat, urban_geo, urban_mat, suburban_geo, suburban_mat, hover_outline_geo, hover_glow_geo, hover_outline_mat, hover_glow_mat])


    // Push instance matrices and colours to the GPU whenever the tile set changes.
    useEffect(() =>
    {
        const mesh = mesh_ref.current
        if (!mesh) return

        const dummy = new THREE.Object3D()
        const color  = new THREE.Color()

        tiles.forEach(({ x, y, cell }, i) =>
        {
            dummy.position.set(x * cell_size, 0, y * cell_size)
            dummy.updateMatrix()
            mesh.setMatrixAt(i, dummy.matrix)
            color.set(tile_colour(cell))
            mesh.setColorAt(i, color)
        })

        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }, [tiles, cell_size])

    // Place tree instances on woodland tiles.
    useEffect(() =>
    {
        const mesh = tree_mesh_ref.current
        if (!mesh) return

        const dummy = new THREE.Object3D()
        const tile_top_y = cell_size * 0.03  // half the tile height (0.06 * cell_size / 2)
        const cone_half_h = cell_size * 0.15 // half of cone height (0.3 * cell_size / 2)

        woodland_tiles.forEach(({ x, y }, ti) =>
        {
            for (let i = 0; i < TREES_PER_TILE; i++)
            {
                const idx = ti * TREES_PER_TILE + i
                const ox    = (seeded_rand(x, y, i * 3)     - 0.5) * cell_size * 0.55
                const oz    = (seeded_rand(x, y, i * 3 + 1) - 0.5) * cell_size * 0.55
                const scale = 0.7 + seeded_rand(x, y, i * 3 + 2) * 0.6

                dummy.position.set(
                    x * cell_size + ox,
                    tile_top_y + cone_half_h * scale,
                    y * cell_size + oz,
                )
                dummy.scale.setScalar(scale)
                dummy.updateMatrix()
                mesh.setMatrixAt(idx, dummy.matrix)
            }
        })

        mesh.instanceMatrix.needsUpdate = true
    }, [woodland_tiles, cell_size])

    // Place office-block instances on urban tiles.
    useEffect(() =>
    {
        const mesh = urban_mesh_ref.current
        if (!mesh) return

        const dummy = new THREE.Object3D()
        const tile_top_y = cell_size * 0.03
        const half_h = cell_size * 0.225  // half of 0.45 * cell_size

        urban_tiles.forEach(({ x, y }, ti) =>
        {
            for (let i = 0; i < BUILDINGS_PER_URBAN; i++)
            {
                const idx = ti * BUILDINGS_PER_URBAN + i
                const ox    = (seeded_rand(x, y, i * 3 + 100)     - 0.5) * cell_size * 0.6
                const oz    = (seeded_rand(x, y, i * 3 + 101) - 0.5) * cell_size * 0.6
                const scale = 0.5 + seeded_rand(x, y, i * 3 + 102) * 1.0  // 0.5 – 1.5

                dummy.position.set(
                    x * cell_size + ox,
                    tile_top_y + half_h * scale,
                    y * cell_size + oz,
                )
                dummy.scale.setScalar(scale)
                dummy.updateMatrix()
                mesh.setMatrixAt(idx, dummy.matrix)
            }
        })

        mesh.instanceMatrix.needsUpdate = true
    }, [urban_tiles, cell_size])

    // Place house instances on suburban tiles.
    useEffect(() =>
    {
        const mesh = suburban_mesh_ref.current
        if (!mesh) return

        const dummy = new THREE.Object3D()
        const tile_top_y = cell_size * 0.03
        const half_h = cell_size * 0.09  // half of 0.18 * cell_size

        suburban_tiles.forEach(({ x, y }, ti) =>
        {
            for (let i = 0; i < BUILDINGS_PER_SUBURBAN; i++)
            {
                const idx = ti * BUILDINGS_PER_SUBURBAN + i
                const ox    = (seeded_rand(x, y, i * 3 + 200)     - 0.5) * cell_size * 0.55
                const oz    = (seeded_rand(x, y, i * 3 + 201) - 0.5) * cell_size * 0.55
                const scale = 0.75 + seeded_rand(x, y, i * 3 + 202) * 0.5  // 0.75 – 1.25

                dummy.position.set(
                    x * cell_size + ox,
                    tile_top_y + half_h * scale,
                    y * cell_size + oz,
                )
                dummy.scale.setScalar(scale)
                dummy.updateMatrix()
                mesh.setMatrixAt(idx, dummy.matrix)
            }
        })

        mesh.instanceMatrix.needsUpdate = true
    }, [suburban_tiles, cell_size])

    const on_click = useCallback((e: ThreeEvent<MouseEvent>) =>
    {
        e.stopPropagation()
        if (e.instanceId === undefined) return
        const tile = tiles[e.instanceId]
        if (tile) on_click_tile?.({ x: tile.x, y: tile.y, cell: tile.cell })
    }, [tiles, on_click_tile])

    const on_pointer_move = useCallback((e: ThreeEvent<PointerEvent>) =>
    {
        if (e.instanceId === undefined) return
        const tile = tiles[e.instanceId]
        if (!tile) return
        if (hover_ref.current)
        {
            hover_ref.current.position.set(tile.x * cell_size, 0, tile.y * cell_size)
            hover_ref.current.visible = true
        }
        on_hover_tile?.({ x: tile.x, y: tile.y, cell: tile.cell })
    }, [tiles, on_hover_tile, cell_size])

    const on_pointer_leave = useCallback(() =>
    {
        if (hover_ref.current) hover_ref.current.visible = false
        on_hover_tile?.(null)
    }, [on_hover_tile])

    return <>
        <instancedMesh
            ref={mesh_ref}
            args={[geometry, material, tiles.length]}
            onClick={on_click_tile ? on_click : undefined}
            onPointerMove={on_pointer_move}
            onPointerLeave={on_pointer_leave}
        />
        {woodland_tiles.length > 0 && (
            <instancedMesh
                ref={tree_mesh_ref}
                args={[tree_geo, tree_mat, woodland_tiles.length * TREES_PER_TILE]}
            />
        )}
        {urban_tiles.length > 0 && (
            <instancedMesh
                ref={urban_mesh_ref}
                args={[urban_geo, urban_mat, urban_tiles.length * BUILDINGS_PER_URBAN]}
            />
        )}
        {suburban_tiles.length > 0 && (
            <instancedMesh
                ref={suburban_mesh_ref}
                args={[suburban_geo, suburban_mat, suburban_tiles.length * BUILDINGS_PER_SUBURBAN]}
            />
        )}
        <group ref={hover_ref} visible={false}>
            <lineSegments args={[hover_outline_geo, hover_outline_mat]} />
            <mesh args={[hover_glow_geo, hover_glow_mat]} />
        </group>
    </>
}


/**
 * Build a thin box geometry whose face brightness is baked into vertex colours.
 * When MeshBasicMaterial.vertexColors is true, the GPU multiplies instanceColor
 * by the vertex colour, so the top face shows the full tile colour while the
 * side faces appear slightly darker — creating a soft bevel without lighting.
 * Generated by Claude Sonnet 4.6 - 2026-04-09
 *
 * BoxGeometry vertex layout (4 verts per face, never shared):
 *   face 0 = +x   face 1 = -x   face 2 = +y (top)
 *   face 3 = -y   face 4 = +z   face 5 = -z
 */
function make_tile_geometry(cell_size: number): THREE.BoxGeometry
{
    const s = cell_size * 0.95    // slight gap visually separates tiles
    const h = cell_size * 0.06    // height exposes side faces for the bevel shading

    const geo = new THREE.BoxGeometry(s, h, s)

    const face_brightness = [0.62, 0.62, 1.00, 0.20, 0.72, 0.55]
    const count = geo.attributes.position!.count   // 24 for a 1-segment box
    const bevel_colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++)
    {
        const b = face_brightness[Math.floor(i / 4)] ?? 0.65
        bevel_colors[i * 3    ] = b
        bevel_colors[i * 3 + 1] = b
        bevel_colors[i * 3 + 2] = b
    }

    geo.setAttribute("color", new THREE.BufferAttribute(bevel_colors, 3))
    return geo
}

/**
 * Cheap deterministic pseudo-random in [0, 1) based on tile coordinates and
 * a seed index. Uses a sine hash so no external dependency is needed.
 */
function seeded_rand(x: number, y: number, i: number): number
{
    const n = Math.sin(x * 127.1 + y * 311.7 + i * 74.3) * 43758.5453
    return n - Math.floor(n)
}
