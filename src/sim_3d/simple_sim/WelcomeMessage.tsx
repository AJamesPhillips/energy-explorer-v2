import { OnceOffInfoBox } from "../../components/InfoBox"
import { WarningAppUnderConstruction } from "../../components/WarningAppUnderConstruction"


export function WelcomeMessage()
{
    return <OnceOffInfoBox
        id="simple_sim_welcome_message"
        message={() =>
            <>
                <h1>⚡️Power the UK⚡️</h1>

                {/* <p>
                    This is a simplification of the UK's national energy system.
                </p> */}
                <p style={{ backgroundColor: "#fffae6", padding: 8, borderRadius: 4, border: "1px solid #ffe58f" }}>
                    Use options ⚡️ from the right to add different energy sources.
                    {/* and set government policies <GovernmentPolicyIcon style={{ height: 20 }} /> */}
                {/* And click on ℹ️ symbols to get more information */}
                </p>
                <p style={{ textAlign: "center" }}>
                    Shape the UK's energy future with your choices!
                </p>

                <WarningAppUnderConstruction
                    custom_message="This simulation is a work in progress"
                />

                {/* <p>
                    Or <a
                        onClick={e =>
                        {
                            e.preventDefault()
                            close_info_box()
                            pub_sub.pub("show_select_country", undefined)
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        vote for your own country
                    </a>.
                </p> */}


                {/* <p>
                    Note: each grid square is about 35 km × 35 km (≈ 1250 km²) and only ⅓ of the
                    sea in the UK's exclusive economic zone is shown, the real area of the UK
                    land and sea is twice as large!
                </p> */}
            </>
        }
    />
}
