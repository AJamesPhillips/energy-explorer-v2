import * as THREE from "three"


export const CONSTANTS = {
    GRID_SIZE: { x: 20, y: 20 },
    CELL_SIZE: 12,

    BUILDINGS_PER_SUBURBAN_TILE: 3,
    BUILDINGS_PER_URBAN_TILE: 3,
    TREES_PER_TILE: 3,
}

export const DEFAULTS = {
    sun_args: {
        colour: new THREE.Color(255, 248, 200),
        ambient_intensity: 0.005,
        direct_intensity: 0.0075,
        direct_position: [ 15, 5, 7 ] as [number, number, number],
    }
}
