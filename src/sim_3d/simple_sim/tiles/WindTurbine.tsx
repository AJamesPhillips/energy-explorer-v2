

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";


interface WindTurbineProps
{
    tiles: Array<{ x: number; y: number }>
    cell_size: number
}

export function WindTurbine({ tiles, cell_size }: WindTurbineProps)
{
    const rotor_refs = useRef<(THREE.Group | null)[]>([])

    const tower_height = cell_size * 0.9
    const blade_length = cell_size * 0.55

    const tower_geo = useMemo(
        () => new THREE.CylinderGeometry(cell_size * 0.02, cell_size * 0.04, tower_height, 6),
        [cell_size, tower_height],
    )
    const tower_mat = useMemo(
        () => new THREE.MeshStandardMaterial({ color: 0xdddddd }),
        [],
    )

    const nacelle_geo = useMemo(
        () => new THREE.BoxGeometry(cell_size * 0.14, cell_size * 0.07, cell_size * 0.07),
        [cell_size],
    )
    const nacelle_mat = useMemo(
        () => new THREE.MeshStandardMaterial({ color: 0xcccccc }),
        [],
    )

    // 4-sided pyramid blade
    const blade_geo = useMemo(
        () => new THREE.ConeGeometry(cell_size * 0.035, blade_length, 4),
        [cell_size, blade_length],
    )
    const blade_mat = useMemo(
        () => new THREE.MeshStandardMaterial({ color: 0xfafafa }),
        [],
    )

    useEffect(() => () =>
    {
        tower_geo.dispose()
        tower_mat.dispose()
        nacelle_geo.dispose()
        nacelle_mat.dispose()
        blade_geo.dispose()
        blade_mat.dispose()
    }, [tower_geo, tower_mat, nacelle_geo, nacelle_mat, blade_geo, blade_mat])

    useFrame((_state, delta) =>
    {
        rotor_refs.current.forEach(ref =>
        {
            if (ref) ref.rotation.x += delta * 2.0
        })
    })

    if (tiles.length === 0) return null

    return <>
        {tiles.map(({ x, y }, i) => (
            <group key={`${x}-${y}`} position={[x * cell_size, 0, y * cell_size]}>
                {/* Tower */}
                <mesh
                    geometry={tower_geo}
                    material={tower_mat}
                    position={[0, tower_height / 2, 0]}
                />
                {/* Nacelle + rotor at tower top */}
                <group position={[0, tower_height, 0]}>
                    {/* Nacelle body — offset slightly so rotor sits at its front face */}
                    <mesh
                        geometry={nacelle_geo}
                        material={nacelle_mat}
                        position={[cell_size * 0.05, 0, 0]}
                    />
                    {/* Rotor disc — blades rotate around X axis (turbine faces +X) */}
                    <group ref={el => { rotor_refs.current[i] = el }}>
                        {[0, 1, 2].map(bi => (
                            <group key={bi} rotation={[bi * Math.PI * 2 / 3, 0, 0]}>
                                <mesh
                                    geometry={blade_geo}
                                    material={blade_mat}
                                    position={[0, blade_length / 2, 0]}
                                />
                            </group>
                        ))}
                    </group>
                </group>
            </group>
        ))}
    </>
}
