import { expect } from "chai"
import { describe } from "mocha"

import { order_in_circular } from "./order_in_circular"


describe("order_in_circular", () =>
{
    // it("should order indices in a circular manner", () =>
    // {

    //     const result = order_in_circular(
    //         [
    //             //   2  1
    //             // 7      3
    //             //   5  6
    //             { lat: 10, lon: 10 }, // 0: some other unrelated entry
    //             { lat: 1, lon: 1 },   // 1
    //             { lat: 1, lon: -1 },  // 2
    //             { lat: 0, lon: 2 },   // 3
    //             { lat: -10, lon: 10 }, // 4: some other unrelated entry
    //             { lat: -1, lon: -1 }, // 5
    //             { lat: -1, lon: 1 },  // 6
    //             { lat: 0, lon: -2 },  // 7
    //             { lat: 10, lon: -10 }, // 8: some other unrelated entry
    //         ],
    //         [1, 2, 3, 5, 6, 7]
    //     )

    //     expect(result).to.deep.equal([5, 7, 2, 1, 3, 6])
    // })

    it("should handle this other data set", () =>
    {
        // Central point is at lat: 60.8333, lon: -0.7697
        const result = order_in_circular(
            [
                { lat: 60.8267, lon: -1.5392 }, // 0
                { lat: 60.5138, lon: -0.3808 }, // 1
                { lat: 60.5094, lon: -1.1421 }, // 2
                { lat: 60.8355, lon: 0 },       // 3
                { lat: 61.1523, lon: -1.1672 }, // 4
                { lat: 61.1567, lon: -0.3891 }, // 5
            ],
            [0, 1, 2, 3, 4, 5]
        )

        expect(result).to.deep.equal([2, 0, 4, 5, 3, 1])
    })
})
