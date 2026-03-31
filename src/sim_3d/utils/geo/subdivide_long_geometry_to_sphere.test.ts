import { expect } from "chai"

import { calculate_new_positions_and_indices } from "./subdivide_long_geometry_to_sphere"


describe("subdivide_long_geometry_to_sphere", () =>
{
    it("should subdivide triangles with long edges into 4 (to prevent disappearing beneath sphere surface)", () =>
    {
        const positions = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ])
        const indices = new Uint16Array([0, 1, 2])
        const { new_positions, new_indices } = calculate_new_positions_and_indices(
            positions, indices, 1, 0.3
        )
        expect_deep_approximation(new_positions, [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
            0.7071, 0.7071, 0,
            0,      0.7071, 0.7071,
            0.7071, 0,      0.7071,
        ])
        expect(new_indices).deep.equals([
            0, 3, 5,
            3, 1, 4,
            5, 4, 2,
            3, 4, 5
        ])
    })

    it("should reuse midpoints when subdividing triangles with long edges into 4", () =>
    {
        const sphere_radius = 2000
        const positions = new Float32Array([
            0, 0, sphere_radius,
            1, 0, sphere_radius,
            0, 1, sphere_radius,
            1, 1, sphere_radius,
        ])
        const indices = new Uint16Array([
            0, 1, 2,
            1, 3, 2,
        ])

        const { new_positions, new_indices } = calculate_new_positions_and_indices(
            positions, indices, sphere_radius, 1.1
        )

        expect_deep_approximation(new_positions, [
            0, 0, sphere_radius,
            1, 0, sphere_radius,
            0, 1, sphere_radius,
            1, 1, sphere_radius,
            0.5, 0,   sphere_radius,
            0.5, 0.5, sphere_radius,
            0,   0.5, sphere_radius,
            1,   0.5, sphere_radius,
            0.5, 1,   sphere_radius,
        ], 0.1, "new positions")
        expect(new_indices).deep.equals([
            0, 4, 6,
            4, 1, 5,
            6, 5, 2,
            4, 5, 6,
            1, 7, 5,
            7, 3, 8,
            5, 8, 2,
            7, 8, 5,
        ])
    })

    describe("should also subdivide any (not yet divided) triangle if that triangle is using an edge which now has a midpoint (to use the new midpoint and keep continuous single surface without breaks)", () =>
    {
        const sphere_radius = 2000
        const long_edge_threshold = 2

        describe("1 new midpoint", () =>
        {
            it("on edge 1-2", () =>
            {
                const positions = new Float32Array([
                    0, 0, sphere_radius,
                    1, 0, sphere_radius,
                    0, 1, sphere_radius,
                    0, -3, sphere_radius,
                ])
                const indices = new Uint16Array([
                    0, 1, 2,
                    0, 3, 1,
                ])

                const { new_positions, new_indices } = calculate_new_positions_and_indices(
                    positions, indices, sphere_radius, long_edge_threshold
                )

                expect_deep_approximation(new_positions, [
                    0,   0, sphere_radius,
                    1,   0, sphere_radius,
                    0,   1, sphere_radius,
                    0,     -3, sphere_radius,
                    0,   -1.5, sphere_radius,
                    0.5, -1.5, sphere_radius,
                    0.5,    0, sphere_radius,
                ], 0.1, "new positions")
                expect(new_indices).deep.equals([
                    0, 6, 2,
                    6, 1, 2,
                    0, 4, 6,
                    4, 3, 5,
                    6, 5, 1,
                    4, 5, 6,
                ], "new indices")
            })


            it("on edge 2-3", () =>
            {
                const positions = new Float32Array([
                    0, 0, sphere_radius,
                    1, 0, sphere_radius,
                    0, 1, sphere_radius,
                    3, 1, sphere_radius,
                ])
                const indices = new Uint16Array([
                    0, 1, 2,
                    1, 3, 2,
                ])

                const { new_positions, new_indices } = calculate_new_positions_and_indices(
                    positions, indices, sphere_radius, long_edge_threshold
                )

                expect_deep_approximation(new_positions, [
                    0,   0, sphere_radius,
                    1,   0, sphere_radius,
                    0,   1, sphere_radius,
                    3,   1, sphere_radius,
                    2,   0.5, sphere_radius,
                    1.5, 1,   sphere_radius,
                    0.5, 0.5, sphere_radius,
                ], 0.1, "new positions")
                expect(new_indices).deep.equals([
                    0, 1, 6,
                    6, 2, 0,
                    1, 4, 6,
                    4, 3, 5,
                    6, 5, 2,
                    4, 5, 6,
                ], "new indices")
            })


            it("on edge 3-1", () =>
            {
                const positions = new Float32Array([
                    0, 0, sphere_radius,
                    1, 0, sphere_radius,
                    0, 1, sphere_radius,
                    -3, 0, sphere_radius,
                ])
                const indices = new Uint16Array([
                    0, 1, 2,
                    0, 2, 3,
                ])

                const { new_positions, new_indices } = calculate_new_positions_and_indices(
                    positions, indices, sphere_radius, long_edge_threshold
                )

                expect_deep_approximation(new_positions, [
                    0,   0, sphere_radius,
                    1,   0, sphere_radius,
                    0,   1, sphere_radius,
                    -3,   0, sphere_radius,
                    0, 0.5, sphere_radius,
                    -1.5, 0.5, sphere_radius,
                    -1.5,   0, sphere_radius,
                ], 0.1, "new positions")
                expect(new_indices).deep.equals([
                    0, 1, 4,
                    1, 2, 4,
                    0, 4, 6,
                    4, 2, 5,
                    6, 5, 3,
                    4, 5, 6,
                ], "new indices")
            })
        })


        describe("2 new midpoints", () =>
        {
            it("on edges 1-2 and 2-3", () =>
            {
                const positions = new Float32Array([
                    0, 0, sphere_radius,
                    1, 0, sphere_radius,
                    0, 1, sphere_radius,
                    0, -3, sphere_radius,
                    3, 1, sphere_radius,
                ])
                const indices = new Uint16Array([
                    0, 1, 2,
                    0, 3, 1,
                    1, 4, 2,
                ])

                const { new_positions, new_indices } = calculate_new_positions_and_indices(
                    positions, indices, sphere_radius, long_edge_threshold
                )

                expect_deep_approximation(new_positions, [
                    0,   0, sphere_radius,
                    1,   0, sphere_radius,
                    0,   1, sphere_radius,
                    0,  -3, sphere_radius,
                    3,   1, sphere_radius,
                    0,   -1.5, sphere_radius,
                    0.5, -1.5, sphere_radius,
                    0.5,    0, sphere_radius,
                    2,    0.5, sphere_radius,
                    1.5,    1, sphere_radius,
                    0.5,  0.5, sphere_radius,
                ], 0.1, "new positions")
                expect(new_indices).deep.equals([
                    0,  7,  2,
                    7,  1, 10,
                    7, 10,  2,
                    0,  5,  7,
                    5,  3,  6,
                    7,  6,  1,
                    5,  6,  7,
                    1,  8, 10,
                    8,  4,  9,
                    10, 9,  2,
                    8,  9, 10,
                ], "new indices")
            })


            it("on edges 2-3 and 3-1", () =>
            {
                const positions = new Float32Array([
                    0, 0, sphere_radius,
                    1, 0, sphere_radius,
                    0, 1, sphere_radius,
                    3, 1, sphere_radius,
                    -3, 0, sphere_radius,
                ])
                const indices = new Uint16Array([
                    0, 1, 2,
                    1, 3, 2,
                    0, 2, 4,
                ])

                const { new_positions, new_indices } = calculate_new_positions_and_indices(
                    positions, indices, sphere_radius, long_edge_threshold
                )

                expect_deep_approximation(new_positions, [
                    0, 0, sphere_radius,
                    1, 0, sphere_radius,
                    0, 1, sphere_radius,
                    3, 1, sphere_radius,
                    -3,  0, sphere_radius,
                    2, 0.5, sphere_radius,
                    1.5, 1, sphere_radius,
                    0.5,  0.5, sphere_radius,
                    0,    0.5, sphere_radius,
                    -1.5, 0.5, sphere_radius,
                    -1.5,   0, sphere_radius,
                ], 0.1, "new positions")
                expect(new_indices).deep.equals([
                    0, 1, 7,
                    0, 7, 8,
                    7, 2, 8,
                    1, 5, 7,
                    5, 3, 6,
                    7, 6, 2,
                    5, 6, 7,
                    0, 8, 10,
                    8, 2, 9,
                    10, 9, 4,
                    8, 9, 10,
                ], "new indices")
            })


            it("on edges 3-1 and 1-2", () =>
            {
                const positions = new Float32Array([
                    0, 0, sphere_radius,
                    1, 0, sphere_radius,
                    0, 1, sphere_radius,
                    -3, 0, sphere_radius,
                    0, -3, sphere_radius,
                ])
                const indices = new Uint16Array([
                    0, 1, 2,
                    0, 2, 3,
                    0, 4, 1,
                ])

                const { new_positions, new_indices } = calculate_new_positions_and_indices(
                    positions, indices, sphere_radius, long_edge_threshold
                )

                // log_in_threes("new positions", new_positions)
                // log_in_threes("new indices", new_indices)

                expect_deep_approximation(new_positions, [
                    0, 0, sphere_radius,
                    1, 0, sphere_radius,
                    0, 1, sphere_radius,
                    -3,  0, sphere_radius,
                    0,  -3, sphere_radius,
                    0, 0.5, sphere_radius,
                    -1.5, 0.5, sphere_radius,
                    -1.5,   0, sphere_radius,
                    0,   -1.5, sphere_radius,
                    0.5, -1.5, sphere_radius,
                    0.5,    0, sphere_radius,
                ], 0.1, "new positions")
                expect(new_indices).deep.equals([
                    0, 10, 5,
                    10, 2, 5,
                    10, 1, 2,
                    0, 5, 7,
                    5, 2, 6,
                    7, 6, 3,
                    5, 6, 7,
                    0, 8, 10,
                    8, 4, 9,
                    10, 9, 1,
                    8, 9, 10,
                ], "new indices")
            })
        })

        it("handles 3 new midpoints", () =>
        {
            const positions = new Float32Array([
                0, 0, sphere_radius,
                1, 0, sphere_radius,
                0, 1, sphere_radius,
                0, -3, sphere_radius,
                3, 1, sphere_radius,
                -3, 0, sphere_radius,
            ])
            const indices = new Uint16Array([
                0, 1, 2,
                0, 3, 1,
                1, 4, 2,
                0, 2, 5,
            ])

            const { new_positions, new_indices } = calculate_new_positions_and_indices(
                positions, indices, sphere_radius, long_edge_threshold
            )

            expect_deep_approximation(new_positions, [
                0, 0, sphere_radius,
                1, 0, sphere_radius,
                0, 1, sphere_radius,
                0, -3, sphere_radius,
                3,  1, sphere_radius,
                -3, 0, sphere_radius,
                0, -1.5, sphere_radius,
                0.5, -1.5, sphere_radius,
                0.5,    0, sphere_radius,
                2,    0.5, sphere_radius,
                1.5,    1, sphere_radius,
                0.5,  0.5, sphere_radius,
                0,    0.5, sphere_radius,
                -1.5, 0.5, sphere_radius,
                -1.5,   0, sphere_radius,
            ], 0.1, "new positions")
            expect(new_indices).deep.equals([
                0, 8, 12,
                8, 1, 11,
                12, 11, 2,
                8, 11, 12,
                0, 6, 8,
                6, 3, 7,
                8, 7, 1,
                6, 7, 8,
                1, 9, 11,
                9, 4, 10,
                11, 10, 2,
                9, 10, 11,
                0, 12, 14,
                12, 2, 13,
                14, 13, 5,
                12, 13, 14,
            ], "new indices")
        })
    })
})


function expect_deep_approximation(actual: number[], expected: number[], tolerance: number = 1e-3, message: string = "")
{
    expect(actual.length).to.equal(expected.length, `Length mismatch: ${message}`)

    for (let i = 0; i < actual.length; ++i)
    {
        expect(actual[i]).to.be.closeTo(expected[i]!, tolerance, `Value mismatch at index ${i}: ${message}`)
    }
}


// function log_in_threes(label: string, array: number[])
// {
//     console.log(label)
//     for (let i = 0; i < array.length; i += 3)
//     {
//         console.log(`  ${array[i]!.toFixed(1)}, ${array[i + 1]!.toFixed(1)}, ${array[i + 2]!.toFixed(1)}`)
//     }
// }
