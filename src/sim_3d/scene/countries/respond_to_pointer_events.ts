import * as THREE from "three"

import pub_sub from "../../state/pub_sub"
import { new_random_id } from "../../utils/new_random_id"
import { CommonDependencies } from "../interface"


export const respond_to_pointer_events = ({ camera, CONSTANTS }: CommonDependencies, earth_mesh: THREE.Mesh, country_surfaces_group: THREE.Group) =>
{
    // Mouse interaction setup
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hovered_country: THREE.Object3D | null = null
    let previous_message_id: string | null = null

    const on_pointer_move = (event: PointerEvent) =>
    {
        if (!CONSTANTS.countries.country_responds_to_pointer) return

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(pointer, camera)

        // For now we have added all countries to the Earth mesh to ensure their
        // position is correct relative to the Earth when it is rotated.
        const intersection_with_earth = raycaster.intersectObject(earth_mesh, false)[0]
        const intersections = raycaster.intersectObjects(country_surfaces_group.children)

        // Reset previous hover
        const previous_hovered_country = hovered_country
        hovered_country = null

        if (intersections.length > 0)
        {
            const first_intersection = intersections[0]!
            if (intersection_with_earth && intersection_with_earth.distance < first_intersection.distance)
            {
                // If the intersection with the Earth is closer than the country
                // surface, ignore the country and reset hovered country
                hovered_country = null
            }
            else if (first_intersection.object.userData.is_country_outline)
            {
                const country = first_intersection.object
                hovered_country = country

                // Highlight the country
                country.userData.target_opacity = 0.8

                // Show country name
                if (hovered_country !== previous_hovered_country)
                {
                    // console .log("Hovering over:", hovered_country.userData.full_country_name) //, country.userData.points)
                    const new_message_id = new_random_id()
                    pub_sub.pub("show_message", {
                        id: new_message_id,
                        message: hovered_country.userData.country_name,
                        // message: hovered_country.userData.full_country_name,
                        show_for_seconds: 2,
                        clear_id: previous_message_id || undefined,
                    })
                    previous_message_id = new_message_id
                }
            }
        }

        if (previous_hovered_country && hovered_country !== previous_hovered_country)
        {
            // Reset surface material
            // @ts-expect-error
            previous_hovered_country.material.opacity = CONSTANTS.countries.initial_opacity
            delete previous_hovered_country.userData.target_opacity
        }

        if (previous_message_id && !hovered_country)
        {
            // If we are not hovering over a country, clear the previous message
            pub_sub.pub("clear_message", { id: previous_message_id })
            previous_message_id = null
        }
    }

    pub_sub.sub("animation_tick", () =>
    {
        if (hovered_country)
        {
            // @ts-expect-error
            hovered_country.material.opacity += (hovered_country.userData.target_opacity - hovered_country.material.opacity) * 0.1
        }
    })

    window.addEventListener("pointermove", on_pointer_move)
}
