import { useMemo } from "react";
import * as THREE from "three";


interface SolarFarmProps
{
    tiles: Array<{ x: number; y: number }>
    cell_size: number
}
export function SolarFarm({ tiles, cell_size }: SolarFarmProps)
{
    const { panel_geo, panel_mat, frame_geo, frame_mat } = useMemo(() =>
    {
        const pw = cell_size * 0.38
        const ph = cell_size * 0.28
        return {
            panel_geo: new THREE.PlaneGeometry(pw, ph),
            panel_mat: new THREE.MeshStandardMaterial({ color: 0x1a2e6e, side: THREE.FrontSide }),
            frame_geo: new THREE.BoxGeometry(pw + cell_size * 0.03, cell_size * 0.015, cell_size * 0.015),
            frame_mat: new THREE.MeshStandardMaterial({ color: 0x888888 }),
        }
    }, [cell_size])

    if (tiles.length === 0) return null

    // Tilt angle: panels face ~south at 30° from horizontal
    const tilt = Math.PI / 6  // 30°
    const tile_top_y = cell_size * 0.06
    const panel_h  = cell_size * 0.28
    const leg_h    = cell_size * 0.08

    // Layout offsets for a 2×2 grid of panels within a tile
    const offsets: Array<[number, number]> = [
        [-cell_size * 0.22, -cell_size * 0.18],
        [ cell_size * 0.22, -cell_size * 0.18],
        [-cell_size * 0.22,  cell_size * 0.18],
        [ cell_size * 0.22,  cell_size * 0.18],
    ]

    return <>
        {tiles.map(({ x, y }) => (
            <group key={`${x}-${y}`} position={[x * cell_size, tile_top_y, y * cell_size]}>
                {offsets.map(([ox, oz], i) =>
                {
                    const bottom_y = leg_h
                    const panel_center_y = bottom_y + (panel_h / 2) * Math.cos(tilt)
                    const panel_center_z = oz + (panel_h / 2) * Math.sin(tilt)
                    return (
                        <group key={i} position={[ox, 0, oz]}>
                            {/* Tilted panel */}
                            <mesh
                                geometry={panel_geo}
                                material={panel_mat}
                                position={[0, panel_center_y, panel_center_z - oz]}
                                rotation={[-tilt, 0, 0]}
                            />
                            {/* Horizontal support rail */}
                            <mesh
                                geometry={frame_geo}
                                material={frame_mat}
                                position={[0, bottom_y, 0]}
                            />
                        </group>
                    )
                })}
            </group>
        ))}
    </>
}
