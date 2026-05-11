

export function format_value_to_string(n: number, detailed = 0): string
{
    if (n >= 1e9) return `${(n / 1e9).toFixed(1 + detailed)}B`
    if (n >= 1e7) return `${(n / 1e6).toFixed(0 + detailed)}M`
    if (n >= 1e6) return `${(n / 1e6).toFixed(1 + detailed)}M`
    if (n >= 1e4) return `${(n / 1e3).toFixed(0 + detailed)}K`
    if (n >= 1e3) return `${(n / 1e3).toFixed(1 + detailed)}K`
    return `${n}`
}
