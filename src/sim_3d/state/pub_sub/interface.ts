import { CellData } from "../../simple_sim/interface"


export type InfoSectionId = "map" | "population" | "power_demand" | "power_supply" | "motivation"

export interface PublishableEvents
{
    animation_tick: {
        delta_seconds: number
        elapsed_seconds: number
    }
    show_message: {
        id?: string
        message: string
        show_for_seconds?: number
        clear_id?: string
    }
    clear_message: {
        id: string
    }
    on_hover_tile: CellData | null
    will_update_tile: CellData | null
    show_info_and_data_sources: InfoSectionId
}
