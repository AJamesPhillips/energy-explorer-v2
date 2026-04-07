
import { useEffect, useState } from "preact/hooks"

import pub_sub from "../state/pub_sub"
import { new_random_id } from "../utils/new_random_id"
import "./Messages.css"


interface Message
{
    id: string
    message: string
    show_for_seconds: number
    disappearing?: boolean
}
export function Messages()
{
    const [messages, set_messages] = useState<Message[]>([])

    useEffect(() =>
    {
        const unsub_show_message = pub_sub.sub("show_message", payload =>
        {
            const {
                id = new_random_id(),
                message,
                show_for_seconds = 3,
                clear_id,
            } = payload

            if (clear_id)
            {
                set_messages(messages => messages.filter(m => m.id !== clear_id))
            }

            const new_message: Message = {
                id,
                message,
                show_for_seconds
            }
            set_messages(messages => [...messages, new_message])

            setTimeout(() =>
            {
                set_messages(messages =>
                {
                    return messages.map(m => m.id !== id ? m : {
                        ...m, disappearing: true
                    })
                })
            }, show_for_seconds * 1000)

            setTimeout(() =>
            {
                set_messages(messages => messages.filter(m => m.id !== id))
            }, (show_for_seconds + 1) * 1000)
        })

        const unsub_clear_message = pub_sub.sub("clear_message", payload =>
        {
            const { id } = payload
            set_messages(messages => messages.filter(m => m.id !== id))
        })

        return () =>
        {
            unsub_show_message()
            unsub_clear_message()
        }
    }, [])

    return <div>
        {messages.map(({ id, message, disappearing }) => (
            <div key={id} className={"message " + (disappearing ? "disappearing" : "")}>
                {message}
            </div>
        ))}
    </div>
}
