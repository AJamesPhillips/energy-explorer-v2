import { expect } from "chai"
import { describe } from "mocha"

import { ILatLon } from "core/data/values/LatLon"

import { find_hex_grid_mid_points } from "./find_hex_grid_mid_points"


describe("find_hex_grid_mid_points", () =>
{
    const central = { lat: 0, lon: 0 }

    // Hexagon data
    const hexagon_spatial_data = [
        //    5
        // 1     6
        // 2     7
        //    3
        { lat: -10, lon: 10 },  // unrelated point
        { lat: 0.5, lon: -Math.sqrt(3) / 2 },
        { lat: -0.5, lon: -Math.sqrt(3) / 2 },
        { lat: -1, lon: 0 },
        { lat: -10, lon: 10 },  // unrelated point
        { lat: 1, lon: 0 },
        { lat: 0.5, lon: Math.sqrt(3) / 2 },
        { lat: -0.5, lon: Math.sqrt(3) / 2 },
        { lat: -10, lon: 10 },  // unrelated point
    ]
    const hexagon_ordered_indices = [1, 5, 6, 7, 3, 2]

    function expected_hexagon_mid_points()
    {
        const sd = hexagon_spatial_data
        return [
            { lat: (central.lat + sd[1]!.lat + sd[5]!.lat) / 3,
            lon: (central.lon + sd[1]!.lon + sd[5]!.lon) / 3 },
            { lat: (central.lat + sd[5]!.lat + sd[6]!.lat) / 3,
            lon: (central.lon + sd[5]!.lon + sd[6]!.lon) / 3 },
            { lat: (central.lat + sd[6]!.lat + sd[7]!.lat) / 3,
            lon: (central.lon + sd[6]!.lon + sd[7]!.lon) / 3 },
            { lat: (central.lat + sd[7]!.lat + sd[3]!.lat) / 3,
            lon: (central.lon + sd[7]!.lon + sd[3]!.lon) / 3 },
            { lat: (central.lat + sd[3]!.lat + sd[2]!.lat) / 3,
            lon: (central.lon + sd[3]!.lon + sd[2]!.lon) / 3 },
            { lat: (central.lat + sd[2]!.lat + sd[1]!.lat) / 3,
            lon: (central.lon + sd[2]!.lon + sd[1]!.lon) / 3 },
        ]
    }

    // Pentagon data
    let angle = 0
    const angle_increment = (2 * Math.PI) / 5 // 72 degrees in radians
    function next_lat_lon()
    {
        const lat = Math.cos(angle)
        const lon = Math.sin(angle)
        angle += angle_increment
        return { lat, lon }
    }

    const a = next_lat_lon()
    const b = next_lat_lon()
    const c = next_lat_lon()
    const d = next_lat_lon()
    const e = next_lat_lon()

    const pentagon_spatial_data = [
        // Pentagon:
        //     5a
        // 1e     6b
        //  2d  3c
        { lat: -10, lon: 10 },  // unrelated point
        e,
        d,
        c,
        { lat: -10, lon: 10 },  // unrelated point
        a,
        b,
        { lat: -10, lon: 10 },  // unrelated point
    ]
    const pentagon_ordered_indices = [5, 6, 3, 2, 1]

    function expected_pentagon_mid_points()
    {
        const sd = pentagon_spatial_data
        return [
            { lat: (central.lat + sd[5]!.lat + sd[6]!.lat) / 3,
            lon: (central.lon + sd[5]!.lon + sd[6]!.lon) / 3 },
            { lat: (central.lat + sd[6]!.lat + sd[3]!.lat) / 3,
            lon: (central.lon + sd[6]!.lon + sd[3]!.lon) / 3 },
            { lat: (central.lat + sd[3]!.lat + sd[2]!.lat) / 3,
            lon: (central.lon + sd[3]!.lon + sd[2]!.lon) / 3 },
            { lat: (central.lat + sd[2]!.lat + sd[1]!.lat) / 3,
            lon: (central.lon + sd[2]!.lon + sd[1]!.lon) / 3 },
            { lat: (central.lat + sd[1]!.lat + sd[5]!.lat) / 3,
            lon: (central.lon + sd[1]!.lon + sd[5]!.lon) / 3 },
        ]
    }


    describe("surrounded by neighbours", () =>
    {
        it("should return mid points for a hexagonal grid", () =>
        {
            const sd = hexagon_spatial_data
            const mid_points = find_hex_grid_mid_points(central, sd, hexagon_ordered_indices)
            expect(mid_points).deep.equals(expected_hexagon_mid_points())
        })


        it("should return mid points for a pentagonal grid", () =>
        {
            const sd = pentagon_spatial_data
            const mid_points = find_hex_grid_mid_points(central, sd, pentagon_ordered_indices)
            expect(mid_points).deep.equals(expected_pentagon_mid_points())
        })

        it("should also work with this test case", () =>
        {
            const central = { lat: 60.8333, lon: -0.7697 }
            const sd = [
                { lat: 60.5094, lon: -1.1421 },
                { lat: 60.8267, lon: -1.5392 },
                { lat: 61.1523, lon: -1.1672 },
                { lat: 61.1567, lon: -0.3891 },
                { lat: 60.8355, lon: 0 },
                { lat: 60.5138, lon: -0.3808 },
            ]
            const ordered_indices = [0, 1, 2, 3, 4, 5]
            const mid_points = find_hex_grid_mid_points(central, sd, ordered_indices)
            approx_deep_equals(mid_points!, [
                {
                    "lat": 60.72,
                    "lon": -1.15,
                },
                {
                    "lat": 60.94,
                    "lon": -1.158,
                },
                {
                    "lat": 61.05,
                    "lon": -0.775,
                },
                {
                    "lat": 60.94,
                    "lon": -0.386,
                },
                {
                    "lat": 60.72,
                    "lon": -0.3835,
                },
                {
                    "lat": 60.61,
                    "lon": -0.764,
                },
            ], 0.01)
        })
    })

    describe("Missing neighbours", () =>
    {
        it("should return mid points for a hexagonal grid", () =>
        {
            const central = { lat: 0, lon: 0 }
            //    5
            // 1     6
            // X     7
            //    X  <-- missing neighbours 2 & 3
            const sd = [...hexagon_spatial_data]
            sd[2] = { lat: -10, lon: 10 } // unrelated point
            sd[3] = { lat: -10, lon: 10 } // unrelated point
            const ordered_indices = [1, 5, 6, 7]

            const mid_points = find_hex_grid_mid_points(central, sd, ordered_indices, true)

            approx_deep_equals(mid_points!, expected_hexagon_mid_points())
        })

        it("should return mid points for a hexagonal grid when there are non-continous neighbours", () =>
        {
            const central = { lat: 0, lon: 0 }
            //    5
            // 1     X <-- also missing neighbour
            // X     7 <-- followed by a present neighbour
            //    X
            const sd = [...hexagon_spatial_data]
            sd[2] = { lat: -10, lon: 10 } // unrelated point
            sd[3] = { lat: -10, lon: 10 } // unrelated point
            sd[6] = { lat: -10, lon: 10 } // unrelated point
            const ordered_indices = [1, 5, 7]

            const mid_points = find_hex_grid_mid_points(central, sd, ordered_indices, true)

            approx_deep_equals(mid_points!, expected_hexagon_mid_points())
        })

        it("should handle only 2 neighbours", () =>
        {
            const central = { lat: 0, lon: 0 }
            //    5
            // 1     X
            // X     X
            //    X
            const sd = [...hexagon_spatial_data]
            sd[2] = { lat: -10, lon: 10 } // unrelated point
            sd[3] = { lat: -10, lon: 10 } // unrelated point
            sd[6] = { lat: -10, lon: 10 } // unrelated point
            sd[7] = { lat: -10, lon: 10 } // unrelated point
            const ordered_indices = [1, 5]

            const mid_points = find_hex_grid_mid_points(central, sd, ordered_indices, true)

            approx_deep_equals(mid_points!, expected_hexagon_mid_points())
        })

        it("should return mid points for a pentagonal grid", () =>
        {
            const central = { lat: 0, lon: 0 }
            // Pentagon:
            //     5a
            // x      6b
            //  2d  x
            const sd = [...pentagon_spatial_data]
            sd[1] = { lat: -10, lon: 10 } // unrelated point
            sd[3] = { lat: -10, lon: 10 } // unrelated point
            const ordered_indices = [5, 6, 2]

            const mid_points = find_hex_grid_mid_points(central, sd, ordered_indices, true)

            approx_deep_equals(mid_points!, expected_pentagon_mid_points())
        })
    })
})


function approx_deep_equals(actual: ILatLon[], expected: ILatLon[], delta = 0.01)
{
    expect(actual.length).to.equal(expected.length)
    for (let i = 0; i < actual.length; ++i)
    {
        const a = actual[i]!
        const e = expected[i]!
        expect(a.lat).approximately(e.lat, delta)
        expect(a.lon).approximately(e.lon, delta)
    }
}
