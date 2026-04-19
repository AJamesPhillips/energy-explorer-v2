import { OnceOffInfoBox } from "../../components/InfoBox"


export function WelcomeMessage()
{
    return <OnceOffInfoBox
        id="digital_twin_welcome_message"
        message={
            <>
                <h1>🚧 Digital Twin 🚧</h1>

                <p>
                    This is a work in progress: expect most things to be broken at this stage! 🔥
                </p>
                <p>
                    If you'd like to get involved please send us <a href="mailto:hello@wikisim.org">an email</a> or add a suggestion <a href="https://github.com/AJamesPhillips/energy-explorer-v2/issues/new?title=%5BREQUEST%5D%20I'd%20like%20to%20be%20able%20to%20...">on GitHub</a>.
                </p>
                <p>
                    Otherwise you can check out the original <a href="https://wikisim.org/wiki/1080">Energy Explorer v1</a> instead.
                </p>
            </>
        }
    />
}
