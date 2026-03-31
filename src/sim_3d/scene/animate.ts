import * as THREE from "three"

import pub_sub from "../state/pub_sub"
import { CommonDependencies } from "./interface"


export function animate({ camera, controls, renderer, scene }: CommonDependencies, earth_mesh: THREE.Mesh)
{
    const clock = new THREE.Clock()
    let stop = false

    const tick = () =>
    {
        if (stop) return

        const delta_seconds = clock.getDelta() // Must be called before getElapsedTime()
        const elapsed_seconds = clock.getElapsedTime()

        // Dynamically change the pan (rotation) speed depending on camera's
        // distance from the Earth's surface
        const user_rotation_input_sensitivity = THREE.MathUtils.mapLinear(controls.getDistance(), controls.minDistance, 5, 0.01, 0.2)
        controls.rotateSpeed = user_rotation_input_sensitivity

        // Rotate Earth depending on level of zoom
        const earth_rotate_speed = 0.03 * THREE.MathUtils.smoothstep(controls.getDistance(), controls.minDistance, controls.maxDistance * 0.7)
        earth_mesh.rotation.y += (delta_seconds * earth_rotate_speed)

        // // Rotate Camera around the Earth
        // const camera_azimuthal_angle = Math.atan2(camera.position.z, camera.position.x)
        // const distance = (camera.position.z ** 2 + camera.position.x ** 2) ** 0.5
        // const new_camera_azimuthal_angle = camera_azimuthal_angle + time_delta * -0.1
        // camera.position.x = Math.cos(new_camera_azimuthal_angle) * distance
        // camera.position.z = Math.sin(new_camera_azimuthal_angle) * distance
        // camera.lookAt(earth.position)

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        pub_sub.pub("animation_tick", { delta_seconds, elapsed_seconds })

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()

    return () => stop = true
}
