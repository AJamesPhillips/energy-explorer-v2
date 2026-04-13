import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { Lensflare, LensflareElement } from "three/examples/jsm/Addons.js"

import { deg_to_rad } from "../../utils/angle"
import { CONSTANTS } from "../scene/CONSTANTS"


interface SunProps
{
    sun_direction: THREE.Vector3
    set_sun_direction: (direction: THREE.Vector3) => void
}
export function Sun(props: SunProps)
{
    const light_ref = useRef<THREE.PointLight>(null)
    const sun_spherical = useRef(new THREE.Spherical(1, Math.PI * 0.5, deg_to_rad(90)))

    useEffect(() =>
    {
        if (!sun_spherical.current) return
        // Sun direction
        const sun_direction = props.sun_direction.clone()
        sun_direction.setFromSpherical(sun_spherical.current)
        props.set_sun_direction(sun_direction)
    }, [sun_spherical])

    // Update
    useFrame(() =>
    {
        if (light_ref.current)
        {
            light_ref.current.position
                .copy(props.sun_direction)
                .multiplyScalar(CONSTANTS.sun_distance)
        }

    })


    // Lens flare
    const { texture_lens_flare0, texture_lens_flare1 } = useTexture({
        texture_lens_flare0: "./lenses/lens_flare0.png",
        texture_lens_flare1: "./lenses/lens_flare1.png",
    })

    useEffect(() =>
    {
        if (!light_ref.current) return

        const lensflare = new Lensflare()
        lensflare.addElement(new LensflareElement(texture_lens_flare0, 512, 0))
        const flare_size_scales = 0.6
        const flare_distance_scales = 0.3
        lensflare.addElement(new LensflareElement(texture_lens_flare1, 60 * flare_size_scales, 0.6 * flare_distance_scales))
        lensflare.addElement(new LensflareElement(texture_lens_flare1, 70 * flare_size_scales, 0.7 * flare_distance_scales))
        lensflare.addElement(new LensflareElement(texture_lens_flare1, 120 * flare_size_scales, 0.9 * flare_distance_scales))
        lensflare.addElement(new LensflareElement(texture_lens_flare1, 70 * flare_size_scales, 1 * flare_distance_scales))

        light_ref.current.add(lensflare)
    }, [])


    // // Tweaks
    // gui
    //     .add(sun_spherical, "phi")
    //     .min(0)
    //     .max(Math.PI)
    //     .onChange(updateSun)

    // gui
    //     .add(sun_spherical, "theta")
    //     .min(- Math.PI)
    //     .max(Math.PI)
    //     .onChange(updateSun)

    return <>
        <pointLight
            ref={light_ref}
            color={0xffffff}
            intensity={1.5}
        />
    </>
}
