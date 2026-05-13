import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

import pub_sub from "../state/pub_sub"
import { CellData } from "./interface"


interface SinkingEntry
{
    id: number
    tile: CellData
    item_type: "wind_turbine" | "solar_farm"
}

let next_id = 0
const SINK_DURATION_S = 2.0

export function InvalidPlacementAnimations({ cell_size }: { cell_size: number })
{
    const [entries, set_entries] = useState<SinkingEntry[]>([])

    useEffect(() => pub_sub.sub("invalid_placement", ({ tile, item_type }) =>
    {
        set_entries(prev => [...prev, { id: next_id++, tile, item_type }])
        play_bubbling_sound()
    }), [])

    return <>
        {entries.map(entry => (
            <SinkingItem
                key={entry.id}
                entry={entry}
                cell_size={cell_size}
                on_done={() => set_entries(prev => prev.filter(e => e.id !== entry.id))}
            />
        ))}
    </>
}


function SinkingItem({ entry, cell_size, on_done }: {
    entry: SinkingEntry
    cell_size: number
    on_done: () => void
})
{
    const group_ref = useRef<THREE.Group>(null)
    const start_ref = useRef<number | null>(null)

    const base_x = entry.tile.x * cell_size
    const base_z = entry.tile.y * cell_size
    const base_y = entry.item_type === "solar_farm" ? cell_size * 0.06 : 0

    useEffect(() =>
    {
        const timer = setTimeout(on_done, SINK_DURATION_S * 1000)
        return () => clearTimeout(timer)
    }, [on_done])

    useFrame(({ clock }) =>
    {
        if (!group_ref.current) return
        if (start_ref.current === null) start_ref.current = clock.getElapsedTime()
        const t = Math.min((clock.getElapsedTime() - start_ref.current) / SINK_DURATION_S, 1)

        group_ref.current.position.y = base_y - t * cell_size * 1.2

        const opacity = Math.max(0, 1 - t * 1.5)
        group_ref.current.traverse(obj =>
        {
            if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial)
            {
                obj.material.opacity = opacity
            }
        })
    })

    return (
        <group ref={group_ref} position={[base_x, base_y, base_z]}>
            {entry.item_type === "wind_turbine"
                ? <SinkingWindTurbine cell_size={cell_size} />
                : <SinkingSolarFarm cell_size={cell_size} />
            }
        </group>
    )
}


function SinkingWindTurbine({ cell_size }: { cell_size: number })
{
    const { tower_geo, tower_mat, nacelle_geo, nacelle_mat, blade_geo, blade_mat, tower_height, blade_length } = useMemo(() =>
    {
        const tower_height = cell_size * 0.9
        const blade_length = cell_size * 0.55
        return {
            tower_height,
            blade_length,
            tower_geo: new THREE.CylinderGeometry(cell_size * 0.02, cell_size * 0.04, tower_height, 6),
            tower_mat: new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true }),
            nacelle_geo: new THREE.BoxGeometry(cell_size * 0.14, cell_size * 0.07, cell_size * 0.07),
            nacelle_mat: new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true }),
            blade_geo: new THREE.ConeGeometry(cell_size * 0.035, blade_length, 4),
            blade_mat: new THREE.MeshStandardMaterial({ color: 0xfafafa, transparent: true }),
        }
    }, [cell_size])

    useEffect(() => () =>
    {
        tower_geo.dispose()
        tower_mat.dispose()
        nacelle_geo.dispose()
        nacelle_mat.dispose()
        blade_geo.dispose()
        blade_mat.dispose()
    }, [tower_geo, tower_mat, nacelle_geo, nacelle_mat, blade_geo, blade_mat])

    return <>
        <mesh geometry={tower_geo} material={tower_mat} position={[0, tower_height / 2, 0]} />
        <group position={[0, tower_height, 0]}>
            <mesh geometry={nacelle_geo} material={nacelle_mat} position={[cell_size * 0.05, 0, 0]} />
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
    </>
}


function SinkingSolarFarm({ cell_size }: { cell_size: number })
{
    const { panel_geo, panel_mat, frame_geo, frame_mat } = useMemo(() =>
    {
        const pw = cell_size * 0.38
        const ph = cell_size * 0.28
        return {
            panel_geo: new THREE.PlaneGeometry(pw, ph),
            panel_mat: new THREE.MeshStandardMaterial({ color: 0x1a2e6e, side: THREE.FrontSide, transparent: true }),
            frame_geo: new THREE.BoxGeometry(pw + cell_size * 0.03, cell_size * 0.015, cell_size * 0.015),
            frame_mat: new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true }),
        }
    }, [cell_size])

    useEffect(() => () =>
    {
        panel_geo.dispose()
        panel_mat.dispose()
        frame_geo.dispose()
        frame_mat.dispose()
    }, [panel_geo, panel_mat, frame_geo, frame_mat])

    const tilt = Math.PI / 6
    const panel_h = cell_size * 0.28
    const leg_h = cell_size * 0.08

    const offsets: Array<[number, number]> = [
        [-cell_size * 0.22, -cell_size * 0.18],
        [ cell_size * 0.22, -cell_size * 0.18],
        [-cell_size * 0.22,  cell_size * 0.18],
        [ cell_size * 0.22,  cell_size * 0.18],
    ]

    return <>
        {offsets.map(([ox, oz], i) =>
        {
            const bottom_y = leg_h
            const panel_center_y = bottom_y + (panel_h / 2) * Math.cos(tilt)
            const panel_center_z = oz + (panel_h / 2) * Math.sin(tilt)
            return (
                <group key={i} position={[ox, 0, oz]}>
                    <mesh
                        geometry={panel_geo}
                        material={panel_mat}
                        position={[0, panel_center_y, panel_center_z - oz]}
                        rotation={[-tilt, 0, 0]}
                    />
                    <mesh
                        geometry={frame_geo}
                        material={frame_mat}
                        position={[0, bottom_y, 0]}
                    />
                </group>
            )
        })}
    </>
}


/** Shared AudioContext — created once and reused to avoid resource exhaustion. */
let shared_audio_ctx: AudioContext | null = null
function get_audio_context(): AudioContext | null
{
    try
    {
        if (!shared_audio_ctx || shared_audio_ctx.state === "closed")
        {
            shared_audio_ctx = new AudioContext()
        }
        return shared_audio_ctx
    }
    catch (_e)
    {
        return null
    }
}

/**
 * Plays a placeholder bubbling sound using the Web Audio API.
 * This is a temporary stand-in; the volume (BUBBLE_GAIN) can be adjusted
 * or made user-configurable when a proper sound asset is added.
 * TODO: replace with a licensed audio file and add a user-facing mute toggle.
 */
const BUBBLE_GAIN = 0.25

function play_bubbling_sound(): void
{
    const ctx = get_audio_context()
    if (!ctx) return

    try
    {
        // Resume the context if it was suspended (browser autoplay policy)
        if (ctx.state === "suspended") ctx.resume()

        for (let i = 0; i < 8; i++)
        {
            const start_time = i * 0.22 + Math.random() * 0.08
            const freq = 200 + Math.random() * 400

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.type = "sine"
            osc.frequency.value = freq
            gain.gain.setValueAtTime(0, ctx.currentTime + start_time)
            gain.gain.linearRampToValueAtTime(BUBBLE_GAIN, ctx.currentTime + start_time + 0.04)
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start_time + 0.18)

            osc.start(ctx.currentTime + start_time)
            osc.stop(ctx.currentTime + start_time + 0.2)
        }
    }
    catch (_e)
    {
        // Web Audio API not available in this environment
    }
}
