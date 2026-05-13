import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"


function get_dimensions(cell_size: number)
{
    const tower_height = cell_size * 0.9
    const blade_length = cell_size * 0.55
    return { tower_height, blade_length }
}


let tower_geo: THREE.CylinderGeometry
let tower_mat: THREE.MeshStandardMaterial
let tower_mat_transparent: THREE.MeshStandardMaterial
let nacelle_geo: THREE.BoxGeometry
let nacelle_mat: THREE.MeshStandardMaterial
let nacelle_mat_transparent: THREE.MeshStandardMaterial
let blade_geo: THREE.ConeGeometry
let blade_mat: THREE.MeshStandardMaterial
let blade_mat_transparent: THREE.MeshStandardMaterial

export function WindTurbineInit({ cell_size }: { cell_size: number })
{
    const { tower_height, blade_length } = get_dimensions(cell_size)

    const result = useMemo(() =>
    {
        return {
            tower_geo: new THREE.CylinderGeometry(cell_size * 0.02, cell_size * 0.04, tower_height, 6),
            tower_mat: new THREE.MeshStandardMaterial({ color: 0xdddddd }),
            tower_mat_transparent: new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true }),
            nacelle_geo: new THREE.BoxGeometry(cell_size * 0.14, cell_size * 0.07, cell_size * 0.07),
            nacelle_mat: new THREE.MeshStandardMaterial({ color: 0xcccccc }),
            nacelle_mat_transparent: new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true }),
            blade_geo: new THREE.ConeGeometry(cell_size * 0.035, blade_length, 4),
            blade_mat: new THREE.MeshStandardMaterial({ color: 0xfafafa }),
            blade_mat_transparent: new THREE.MeshStandardMaterial({ color: 0xfafafa, transparent: true }),
        }
    }, [cell_size, tower_height, blade_length])


    tower_geo = result.tower_geo
    tower_mat = result.tower_mat
    tower_mat_transparent = result.tower_mat_transparent
    nacelle_geo = result.nacelle_geo
    nacelle_mat = result.nacelle_mat
    nacelle_mat_transparent = result.nacelle_mat_transparent
    blade_geo = result.blade_geo
    blade_mat = result.blade_mat
    blade_mat_transparent = result.blade_mat_transparent


    useEffect(() => () =>
    {
        tower_geo.dispose()
        tower_mat.dispose()
        tower_mat_transparent.dispose()
        nacelle_geo.dispose()
        nacelle_mat.dispose()
        nacelle_mat_transparent.dispose()
        blade_geo.dispose()
        blade_mat.dispose()
        blade_mat_transparent.dispose()
    }, [tower_geo, tower_mat, tower_mat_transparent,
        nacelle_geo, nacelle_mat, nacelle_mat_transparent,
        blade_geo, blade_mat, blade_mat_transparent])

    return null
}


interface WindTurbineProps
{
    tiles: Array<{ x: number, y: number }>
    cell_size: number
}
export function WindTurbineFarms({ tiles, cell_size }: WindTurbineProps)
{
    if (tiles.length === 0) return null

    return <>
        {tiles.map(({ x, y }, i) => (
            <group
                key={`${x}-${y}`}
                position={[x * cell_size, 0, y * cell_size]}
            >
                <WindTurbine cell_size={cell_size} index={i} />
            </group>
        ))}
    </>
}


export function WindTurbine({ cell_size, index, transparent }: { cell_size: number, index?: number, transparent?: boolean })
{
    const { tower_height, blade_length } = get_dimensions(cell_size)

    const rotor_refs = useRef<(THREE.Group | null)[]>([])

    useFrame((_state, delta) =>
    {
        const d = delta * 2.0
        rotor_refs.current.forEach(ref =>
        {
            if (ref) ref.rotation.x += d
        })
    })

    return <>
        {/* Tower */}
        <mesh
            geometry={tower_geo}
            material={transparent ? tower_mat_transparent : tower_mat}
            position={[0, tower_height / 2, 0]}
        />
        {/* Nacelle + rotor at tower top */}
        <group position={[0, tower_height, 0]}>
            {/* Nacelle body — offset slightly so rotor sits at its front face */}
            <mesh
                geometry={nacelle_geo}
                material={transparent ? nacelle_mat_transparent : nacelle_mat}
                position={[cell_size * 0.05, 0, 0]}
            />
            {/* Rotor disc — blades rotate around X axis (turbine faces +X) */}
            <group ref={el => {
                rotor_refs.current[index ?? 0] = el
            }}>
                {[0, 1, 2].map(bi => (
                    <group
                        key={bi}
                        rotation={[bi * Math.PI * 2 / 3, 0, 0]}
                    >
                        <mesh
                            geometry={blade_geo}
                            material={transparent ? blade_mat_transparent : blade_mat}
                            position={[0, blade_length / 2, 0]}
                        />
                    </group>
                ))}
            </group>
        </group>
    </>
}
