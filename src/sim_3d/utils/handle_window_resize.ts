import { CommonDependencies, ScreenSizes } from "../scene/interface"


export function handle_window_resize({ camera, renderer }: CommonDependencies, screen_sizes: ScreenSizes)
{
    const window_resize_handler = () =>
    {
        // Update sizes
        screen_sizes.width = window.innerWidth
        screen_sizes.height = window.innerHeight
        screen_sizes.pixel_ratio = Math.min(window.devicePixelRatio, 2)

        // Update camera
        camera.aspect = screen_sizes.width / screen_sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(screen_sizes.width, screen_sizes.height)
        renderer.setPixelRatio(screen_sizes.pixel_ratio)
    }

    window.addEventListener("resize", window_resize_handler)

    return () => window.removeEventListener("resize", window_resize_handler)
}
