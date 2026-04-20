import * as Sentry from "@sentry/react"

import { error_to_string } from "core/errors"


export function setup_error_logging()
{
    Sentry.init({
        dsn: "https://aaa@bbb.ingest.de.sentry.io/123",
        // Setting this option to true will send default PII data to Sentry.
        // For example, automatic IP address collection on events
        sendDefaultPii: true,
        enabled: window.location.hostname !== "localhost",
        tracePropagationTargets: [
            "localhost", // For local development
        ],
    })


    const original_console_error = console.error
    const original_console_warn = console.warn
    const original_console_info = console.info

    console.error = function (...args)
    {
        if (args[0] instanceof Error) Sentry.captureException(args[0])
        else Sentry.captureMessage(args.map(error_to_string).join(" "), "error")

        // Log to the console
        original_console_error.apply(console, args)
    }

    console.warn = function (...args)
    {
        Sentry.captureMessage(args.map(error_to_string).join(" "), "warning")

        // Log to the console
        original_console_warn.apply(console, args)
    }

    console.info = function (...args)
    {
        Sentry.captureMessage(args.map(error_to_string).join(" "), "info")

        // Log to the console
        original_console_info.apply(console, args)
    }
}
