import { expect } from "chai"
import { act } from "react"
import { createRoot, Root } from "react-dom/client"

import { GovernmentPolicyIcon } from "./svgs"


describe("svgs", () =>
{
    let container: HTMLDivElement
    let root: Root

    beforeEach(() =>
    {
        ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
        container = document.createElement("div")
        document.body.appendChild(container)
        root = createRoot(container)
    })

    afterEach(() =>
    {
        act(() => root.unmount())
        container.remove()
    })

    it("renders the GovernmentPolicyIcon using the government policy svg asset", () =>
    {
        act(() => root.render(<GovernmentPolicyIcon style={{ height: 24 }} />))

        const icon = container.querySelector("img")
        expect(icon).to.not.equal(null)
        expect(icon?.getAttribute("src")).to.contain("svgs/government_policy.svg")
    })
})
