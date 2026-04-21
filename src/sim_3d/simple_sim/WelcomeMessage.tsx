import { OnceOffInfoBox } from "../../components/InfoBox"


export function WelcomeMessage()
{
    return <OnceOffInfoBox
        id="simple_sim_welcome_message"
        message={
            <>
                <h1>⚡️Simple Sim⚡️</h1>

                <p>
                    This is a simplification of the UK's national energy system.
                </p>
                <p style={{ backgroundColor: "#fffae6", padding: 8, borderRadius: 4, border: "1px solid #ffe58f" }}>
                    Click on the grid
                    to add different energy sources.
                {/* And click on ℹ️ symbols to get more information */}
                </p>

                <p>
                    Why?  To get a better intuitive understanding of the scale of
                    energy demand and of the area, and resources required for different sources of energy.
                </p>


                {/* <p>
                    Note: each grid square is about 35 km × 35 km (≈ 1250 km²) and only ⅓ of the
                    sea in the UK's exclusive economic zone is shown, the real area of the UK
                    land and sea is twice as large!
                </p> */}

                <p>
                    If you enjoy this please share it.<br />
                    If you want to get involved you can <a href="mailto:hello@wikisim.org">email us, </a>
                    <a href="https://wikisim.org/wiki/1272">check the data, </a>
                    <a href="https://github.com/AJamesPhillips/energy-explorer-v2/issues">add code, </a>
                    or <a href="https://www.patreon.com/WikiSim">donate ❤️</a>
                </p>
            </>
        }
    />
}
