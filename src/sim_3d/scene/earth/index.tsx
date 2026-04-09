import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { CONSTANTS } from "../CONSTANTS"
import atmosphere_fragment_shader from "./shaders/atmosphere/fragment.glsl"
import atmosphere_vertex_shader from "./shaders/atmosphere/vertex.glsl"
import earth_fragment_shader from "./shaders/earth/fragment.glsl"
import earth_vertex_shader from "./shaders/earth/vertex.glsl"


const ATMOSPHERE_DAY_COLOR = "#00aaff"
const ATMOSPHERE_TWILIGHT_COLOR = "#f17143"
const ATMOSPHERE_SCALE = 1.03 // 1.015 is actual scale, but 1.03 looks better

interface EarthProps
{
    sun_direction: THREE.Vector3
}

export function Earth({ sun_direction }: EarthProps)
{
    const earth_mesh = useRef<THREE.Mesh>(null!)
    const { day: day_texture, night: night_texture, specular: specular_clouds_texture } = useTexture({
        day: "./earth/day.jpg",
        night: "./earth/night.jpg",
        specular: "./earth/specularClouds.jpg",
    })

    useMemo(() =>
    {
        day_texture.colorSpace = THREE.SRGBColorSpace
        day_texture.anisotropy = 8
        night_texture.colorSpace = THREE.SRGBColorSpace
        night_texture.anisotropy = 8
        specular_clouds_texture.anisotropy = 8
    }, [day_texture, night_texture, specular_clouds_texture])

    const earth_uniforms = useMemo(() => ({
        u_day_texture: new THREE.Uniform(day_texture),
        u_night_texture: new THREE.Uniform(night_texture),
        u_specular_clouds_texture: new THREE.Uniform(specular_clouds_texture),
        u_sun_direction: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        u_atmosphere_day_color: new THREE.Uniform(new THREE.Color(ATMOSPHERE_DAY_COLOR)),
        u_atmosphere_twilight_color: new THREE.Uniform(new THREE.Color(ATMOSPHERE_TWILIGHT_COLOR)),
    }), [day_texture, night_texture, specular_clouds_texture])

    const atmosphere_uniforms = useMemo(() => ({
        u_sun_direction: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        u_atmosphere_day_color: new THREE.Uniform(new THREE.Color(ATMOSPHERE_DAY_COLOR)),
        u_atmosphere_twilight_color: new THREE.Uniform(new THREE.Color(ATMOSPHERE_TWILIGHT_COLOR)),
    }), [])


    useFrame((state, delta) =>
    {
        earth_uniforms.u_sun_direction.value.copy(sun_direction)
        atmosphere_uniforms.u_sun_direction.value.copy(sun_direction)


        const controls = state.controls as OrbitControls | null
        if (controls)
        {
            // Dynamically change the pan (rotation) speed depending on camera's
            // distance from the Earth's surface
            const user_rotation_input_sensitivity = THREE.MathUtils.mapLinear(controls.getDistance(), controls.minDistance, 5, 0.01, 0.2)
            controls.rotateSpeed = user_rotation_input_sensitivity

            // Rotate Earth depending on level of zoom
            const earth_rotate_speed = 0.03 * THREE.MathUtils.smoothstep(controls.getDistance(), controls.minDistance, controls.maxDistance * 0.7)
            earth_mesh.current.rotation.y += (delta * earth_rotate_speed)
        }
    })

    return <>
        <mesh ref={earth_mesh}>
            <sphereGeometry args={[CONSTANTS.earth_radius, 64, 64]} />
            <shaderMaterial
                vertexShader={earth_vertex_shader}
                fragmentShader={earth_fragment_shader}
                uniforms={earth_uniforms}
            />
        </mesh>
        <mesh scale={[ATMOSPHERE_SCALE, ATMOSPHERE_SCALE, ATMOSPHERE_SCALE]}>
            <sphereGeometry args={[CONSTANTS.earth_radius, 64, 64]} />
            <shaderMaterial
                side={THREE.BackSide}
                transparent={true}
                vertexShader={atmosphere_vertex_shader}
                fragmentShader={atmosphere_fragment_shader}
                uniforms={atmosphere_uniforms}
            />
        </mesh>
    </>
}
