

export type BuildingStorageAction = {
    type: "hydro_pumped_storage" | "battery"
}
export type BuildingOilGasAction = {
    type: "gas"
}
export type BuildingElectricityAction = {
    type: "wind" | "solar" | "nuclear" | "hydro"
}
export type BuildingActionType = BuildingElectricityAction | BuildingOilGasAction | BuildingStorageAction
export type ActiveBuildingAction = false | BuildingActionType

export interface BuildingActionState
{
    active: ActiveBuildingAction
    set_building_action: (build_action: ActiveBuildingAction) => void
}
