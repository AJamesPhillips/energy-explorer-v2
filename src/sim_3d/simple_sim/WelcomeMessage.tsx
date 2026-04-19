import { InfoBox } from "../../components/InfoBox"


export function WelcomeMessage()
{
    return <InfoBox
        id="simple_sim_welcome_message"
        message={
            <>
                <h1>⚡️Simple Sim⚡️</h1>

                <p>
                    This is a simplification of the UK showing ⅓ of the
                    sea in the UK's exclusive economic zone, and our demand and supply of energy.
                </p>
                <p>
                    Each grid square is about 35 km × 35 km (≈ 1250 km²).  Click on the grid
                    to toggle between different energy generation, and see how they contribute
                    to the overall power supply.
                </p>
                <p>
                    If you'd like to get involved please send us <a href="mailto:hello@wikisim.org">an email</a> or add a suggestion <a href="https://github.com/AJamesPhillips/energy-explorer-v2/issues">on GitHub</a>.
                </p>
            </>
        }
    />
}
