import { expect } from "chai"
import { act } from "react"
import { createRoot, Root } from "react-dom/client"

import { FooterBuildOptions } from "./FooterBuildOptions"


describe("FooterBuildOptions", () =>
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

    it("shows options when toggled and tracks selected option", () =>
    {
        act(() =>
        {
            root.render(
                <FooterBuildOptions
                    options={["A", "B"]}
                    build_aria_label={option => `Build ${option}`}
                    toggle_aria_label="Toggle demo options"
                    toggle_collapsed_content="D"
                    remove_aria_label="Remove demo option"
                />
            )
        })

        const toggle_button = container.querySelector("button[aria-label='Toggle demo options']") as HTMLButtonElement
        expect(toggle_button).to.not.equal(null)
        expect(toggle_button.getAttribute("aria-expanded")).to.equal("false")
        expect(container.querySelector("button[aria-label='Build A']")).to.equal(null)

        act(() => toggle_button.click())

        expect(toggle_button.getAttribute("aria-expanded")).to.equal("true")
        const option_button = container.querySelector("button[aria-label='Build A']") as HTMLButtonElement
        expect(option_button).to.not.equal(null)

        act(() => option_button.click())
        expect(option_button.className).to.contain("footer_generation_option_selected")

        const remove_button = container.querySelector("button[aria-label='Remove demo option']") as HTMLButtonElement
        act(() => remove_button.click())
        expect(remove_button.className).to.contain("footer_generation_option_selected")
    })
})
