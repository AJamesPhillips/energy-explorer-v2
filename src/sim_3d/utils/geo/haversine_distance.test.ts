import { expect } from "chai"
import { describe } from "mocha"

import { ILatLon } from "core/data/values/LatLon"

import { haversine_distance } from "./haversine_distance"


describe("haversine_distance", () =>
{
    it("should calculate the distance between two points", () => {
        const pointA: ILatLon = { lat: 0, lon: 0 }
        const pointB: ILatLon = { lat: 0, lon: 1 }  // 1 degree of longitude at the equator

        const distance = haversine_distance(pointA, pointB)

        // 111.2 km comes from (pi * 6371 * 2) / 360
        expect(distance).approximately(111.2, 1)
    })

    it("should return 0 for the same point", () => {
        const pointA: ILatLon = { lat: 52.1, lon: 20.1 }

        const distance = haversine_distance(pointA, pointA)

        expect(distance).equals(0)
    })

    it("should handle points on the equator", () => {
        const pointA: ILatLon = { lat: 0, lon: 0 }
        const pointB: ILatLon = { lat: 0, lon: 90 }
        const pointC: ILatLon = { lat: 0, lon: 180 }

        const distance = haversine_distance(pointA, pointB)

        // (pi * 6371 * 2) / 4
        expect(distance).approximately(10007.5, 1)
        expect(haversine_distance(pointB, pointC)).approximately(10007.5, 1)
        expect(haversine_distance(pointA, pointC)).approximately(10007.5 * 2, 1)
    })

    it("should handle points at the pole", () => {
        const pointA: ILatLon = { lat: 90, lon: 0 }
        const pointB: ILatLon = { lat: 90, lon: 90 }

        const distance = haversine_distance(pointA, pointB)

        expect(distance).approximately(0, 1)
    })
})
