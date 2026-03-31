import type GUI from "lil-gui"
import type * as THREE from "three"
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"


export interface ScreenSizes
{
    width: number
    height: number
    pixel_ratio: number
}

export interface Constants
{
    controls: {
        zoom: {
            min: number
            max: number
        }
    }

    earth_radius: number
    sun_distance: number

    countries: {
        surface_radius: number
        initial_colour: number
        initial_opacity: number
        country_responds_to_pointer: boolean
    }

    spatial_data: {
        surface_radius: number
        // opacity: number
    }
}

export interface CommonDependencies
{
    camera: THREE.PerspectiveCamera
    CONSTANTS: Constants
    controls: OrbitControls
    gui: GUI
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    texture_loader: THREE.TextureLoader
}
