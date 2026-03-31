import * as THREE from "three"
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js"

import { CommonDependencies } from "./interface"


export function create_sun(deps: CommonDependencies)
{
    const { scene, texture_loader, gui } = deps


    // Coordinates
    const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0)
    const sun_direction = new THREE.Vector3()


    // Light for sun
    const light = new THREE.PointLight(0xffffff, 1.5)
    scene.add(light)


    const subscribers: ((sun_direction: THREE.Vector3) => void)[] = []

    // Update
    const updateSun = () =>
    {
        // Sun direction
        sun_direction.setFromSpherical(sunSpherical)

        light.position
            .copy(sun_direction)
            .multiplyScalar(deps.CONSTANTS.sun_distance)

        subscribers.forEach(subscriber => subscriber(sun_direction))
    }
    updateSun()


    // Lens flare
    const textureLensFlare0 = texture_loader.load("./lenses/lens_flare0.png")
    const textureLensFlare1 = texture_loader.load("./lenses/lens_flare1.png")

    const lensflare = new Lensflare()
    lensflare.addElement(new LensflareElement(textureLensFlare0, 512, 0))
    const flare_size_scales = 0.6
    const flare_distance_scales = 0.3
    lensflare.addElement(new LensflareElement(textureLensFlare1, 60 * flare_size_scales, 0.6 * flare_distance_scales))
    lensflare.addElement(new LensflareElement(textureLensFlare1, 70 * flare_size_scales, 0.7 * flare_distance_scales))
    lensflare.addElement(new LensflareElement(textureLensFlare1, 120 * flare_size_scales, 0.9 * flare_distance_scales))
    lensflare.addElement(new LensflareElement(textureLensFlare1, 70 * flare_size_scales, 1 * flare_distance_scales))
    light.add(lensflare)


    // Tweaks
    gui
        .add(sunSpherical, "phi")
        .min(0)
        .max(Math.PI)
        .onChange(updateSun)

    gui
        .add(sunSpherical, "theta")
        .min(- Math.PI)
        .max(Math.PI)
        .onChange(updateSun)

    return {
        subscribe_to_sun_direction: (subscriber: (sun_direction: THREE.Vector3) => void) =>
        {
            subscribers.push(subscriber)
            subscriber(sun_direction) // Call immediately with current value

            const unsubscribe = () =>
            {
                const index = subscribers.indexOf(subscriber)
                if (index !== -1) subscribers.splice(index, 1)
            }
            return unsubscribe
        }
    }
}
