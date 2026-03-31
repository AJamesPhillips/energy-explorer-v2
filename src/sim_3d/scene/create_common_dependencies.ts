import GUI from "lil-gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { CONSTANTS } from "./CONSTANTS"
import { CommonDependencies, ScreenSizes } from "./interface"


export function create_common_dependencies(canvas: HTMLCanvasElement, screen_sizes: ScreenSizes)
{
    const gui = new GUI()

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#000011")


    // Loaders
    const texture_loader = new THREE.TextureLoader()


    // Camera
    const camera = new THREE.PerspectiveCamera(25, screen_sizes.width / screen_sizes.height, 0.1, 100)
    // Show the whole Earth
    // camera.position.x = 12
    // camera.position.y = 5
    // camera.position.z = 4
    camera.position.x = 15
    camera.position.y = 0
    camera.position.z = 0
    // Focus on UK
    // camera.position.x = 1.8
    // camera.position.y = 2.65
    // camera.position.z = 0
    // camera.position.x = 1.340
    // camera.position.y = 1.617
    // camera.position.z = 0.192
    scene.add(camera)


    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true, // Required for lensflare to work
    })
    renderer.setSize(screen_sizes.width, screen_sizes.height)
    renderer.setPixelRatio(screen_sizes.pixel_ratio)


    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.rotateSpeed = 0.5
    // Update controls min/max distance based on sun distance and earth radius
    controls.minDistance = CONSTANTS.controls.zoom.min
    controls.maxDistance = CONSTANTS.controls.zoom.max

    const deps: CommonDependencies = {
        camera,
        controls,
        CONSTANTS,
        gui,
        renderer,
        scene,
        texture_loader,
    }
    ;(window as any).debug = deps

    return deps
}
