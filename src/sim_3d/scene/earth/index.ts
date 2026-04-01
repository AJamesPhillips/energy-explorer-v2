import * as THREE from "three"

import { CommonDependencies } from "../interface"
import atmosphere_fragment_shader from "./shaders/atmosphere/fragment.glsl"
import atmosphere_vertex_shader from "./shaders/atmosphere/vertex.glsl"
import earth_fragment_shader from "./shaders/earth/fragment.glsl"
import earth_vertex_shader from "./shaders/earth/vertex.glsl"


export function create_earth(deps: CommonDependencies, subscribe_to_sun_direction: (subscriber: (sun_direction: THREE.Vector3) => void) => () => void)
{
    const { scene, texture_loader, gui } = deps

    /**
     * Earth
     */
    const earth_parameters = {
        atmosphere_day_color: "#00aaff",
        atmosphere_twilight_color: "#f17143",
    }

    gui.addColor(earth_parameters, "atmosphere_day_color")
        .onChange(() =>
        {
            earth_material.uniforms.u_atmosphere_day_color!.value.set(earth_parameters.atmosphere_day_color)
            atmosphere_material.uniforms.u_atmosphere_day_color!.value.set(earth_parameters.atmosphere_day_color)
        })

    gui.addColor(earth_parameters, "atmosphere_twilight_color")
        .onChange(() =>
        {
            earth_material.uniforms.u_atmosphere_twilight_color!.value.set(earth_parameters.atmosphere_twilight_color)
            atmosphere_material.uniforms.u_atmosphere_twilight_color!.value.set(earth_parameters.atmosphere_twilight_color)
        })


    // Textures
    const earth_day_texture = texture_loader.load("./earth/day.jpg")
    earth_day_texture.colorSpace = THREE.SRGBColorSpace
    earth_day_texture.anisotropy = 8

    const earth_night_texture = texture_loader.load("./earth/night.jpg")
    earth_night_texture.colorSpace = THREE.SRGBColorSpace
    earth_night_texture.anisotropy = 8

    const earth_specular_clouds_texture = texture_loader.load("./earth/specularClouds.jpg")
    earth_specular_clouds_texture.anisotropy = 8

    // Mesh
    const earthGeometry = new THREE.SphereGeometry(deps.CONSTANTS.earth_radius, 64, 64)
    const earth_material = new THREE.ShaderMaterial({
        vertexShader: earth_vertex_shader,
        fragmentShader: earth_fragment_shader,
        uniforms:
        {
            u_day_texture: new THREE.Uniform(earth_day_texture),
            u_night_texture: new THREE.Uniform(earth_night_texture),
            u_specular_clouds_texture: new THREE.Uniform(earth_specular_clouds_texture),
            u_sun_direction: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
            u_atmosphere_day_color: new THREE.Uniform(new THREE.Color(earth_parameters.atmosphere_day_color)),
            u_atmosphere_twilight_color: new THREE.Uniform(new THREE.Color(earth_parameters.atmosphere_twilight_color)),
        }
    })
    const earth_mesh = new THREE.Mesh(earthGeometry, earth_material)
    scene.add(earth_mesh)

    // Atmosphere
    const atmosphere_material = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        vertexShader: atmosphere_vertex_shader,
        fragmentShader: atmosphere_fragment_shader,
        uniforms:
        {
            u_sun_direction: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
            u_atmosphere_day_color: new THREE.Uniform(new THREE.Color(earth_parameters.atmosphere_day_color)),
            u_atmosphere_twilight_color: new THREE.Uniform(new THREE.Color(earth_parameters.atmosphere_twilight_color))
        },
    })

    const atmosphere = new THREE.Mesh(earthGeometry, atmosphere_material)
    const atmosphereScale = 1.03 // 1.015 is actual scale, but 1.03 looks better
    atmosphere.scale.set(atmosphereScale, atmosphereScale, atmosphereScale)
    scene.add(atmosphere)

    // Subscribe to sun direction updates
    subscribe_to_sun_direction((sun_direction: THREE.Vector3) =>
    {
        // Update sun direction in material uniforms
        earth_material.uniforms.u_sun_direction!.value.copy(sun_direction)
        atmosphere_material.uniforms.u_sun_direction!.value.copy(sun_direction)
    })

    return earth_mesh
}
