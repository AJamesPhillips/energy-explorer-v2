
let last_log_time = performance.now()
const disabled = true

export function log_time(label: string)
{
    if (disabled) return
    const now = performance.now()
    console.log(`+${(now - last_log_time).toFixed(2)} ms [${label}]`)
    last_log_time = now
}
