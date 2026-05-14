import type { Mutate, StoreApi } from "zustand/vanilla"

import { BuildingActionState } from "./building_action/interface"


export interface AppState
{
    building_action: BuildingActionState
}

type ImmerStore = Mutate<StoreApi<AppState>, [["zustand/immer", never]]>
export type SetAppState = ImmerStore["setState"]
export type GetAppState = ImmerStore["getState"]
