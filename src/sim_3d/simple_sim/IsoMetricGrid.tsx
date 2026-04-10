import { ThreeEvent } from "@react-three/fiber"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

import { CellsData, LandOrSea } from "./interface"
import { tile_colour } from "./tile"
import { SolarFarm } from "./tiles/SolarFarm"
import { SuburbanTiles } from "./tiles/Suburban"
import { UrbanTiles } from "./tiles/Urban"
import { WindTurbine } from "./tiles/WindTurbine"
import { Woodland } from "./tiles/Woodland"



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
export function IsoMetricGrid(props: IsoMetricGridProps)
{
    const { size, cell_size, data, on_click_tile, on_hover_tile } = props

    const mesh_ref = useRef<THREE.InstancedMesh>(null)
    const hover_ref = useRef<THREE.Group>(null)
    const [hover_visible, set_hover_visible] = useState(false)


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

    const wind_turbine_tiles = useMemo(
        () => tiles.filter(t => data[t.x]?.[t.y]?.has_wind_turbine),
        [tiles, data],
    )

    const solar_farm_tiles = useMemo(
        () => tiles.filter(t => data[t.x]?.[t.y]?.has_solar_farm),
        [tiles, data],
    )

    useEffect(() => () =>
    {
        geometry.dispose()
        material.dispose()
        hover_outline_geo.dispose()
        hover_glow_geo.dispose()
        hover_outline_mat.dispose()
        hover_glow_mat.dispose()
    }, [geometry, material, hover_outline_geo, hover_glow_geo, hover_outline_mat, hover_glow_mat])


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
        }
        set_hover_visible(true)
        on_hover_tile?.({ x: tile.x, y: tile.y, cell: tile.cell })
    }, [tiles, on_hover_tile, cell_size])

    const on_pointer_leave = useCallback(() =>
    {
        set_hover_visible(false)
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
        <Woodland tiles={woodland_tiles} cell_size={cell_size} />
        <SuburbanTiles tiles={suburban_tiles} cell_size={cell_size} />
        <UrbanTiles tiles={urban_tiles} cell_size={cell_size} />

        <WindTurbine tiles={wind_turbine_tiles} cell_size={cell_size} />
        <SolarFarm tiles={solar_farm_tiles} cell_size={cell_size} />

        <group ref={hover_ref} visible={hover_visible}>
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
