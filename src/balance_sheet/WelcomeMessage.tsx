import { InfoBox } from "../components/InfoBox"


export function WelcomeMessage()
{
    return <InfoBox
        id="balance_sheet_welcome_message"
        message={
            <>
                <h1>
                    Welcome to the UK's<br />
                    Energy Balance Sheet
                </h1>

                <p>
                    This interactive visualization breaks down the average daily energy
                    consumption and production of a person in the UK, based on data
                    from David MacKay's 2009
                    book <a href="https://www.withouthotair.com/">Sustainable Energy - without the hot air</a>.
                </p>

                <p style={{ textAlign: "center" }}>
                    <a href="https://www.withouthotair.com/">
                        <img src="/imgs/SEWTHA_book_cover.png" style={{ margin: "auto" }} />
                    </a>
                </p>

                {/* <p>
                    The red columns shows the demands of energy (like
                    heating, transportation, etc.) and the green columns are different
                    sources of sustainable energy (like wind, solar, etc.).
                    The size of each box corresponds to the amount of energy in kWh per day per person.
                </p>

                <p>
                    This is designed to ensure our national conversations about
                    energy are grounded in a shared understanding of what can
                    be achieved.
                </p> */}
            </>
        }
    />
}
