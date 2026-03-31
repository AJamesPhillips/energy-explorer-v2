
// Handle wrap-around angles
export function angle_difference(angle1: number, angle2: number): number
{
    let diff = angle1 - angle2
    if (diff > Math.PI) diff -= 2 * Math.PI
    else if (diff < -Math.PI) diff += 2 * Math.PI
    return Math.abs(diff)
}

export function to_radians(deg: number): number
{
    return deg * Math.PI / 180
}
