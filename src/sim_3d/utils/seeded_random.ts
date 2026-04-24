
/**
 * Cheap deterministic pseudo-random in [0, 1) based on tile coordinates and
 * a seed index. Uses a sine hash so no external dependency is needed.
 */
export function seeded_rand(id: number, i: number): number
{
    const n = Math.sin(id * 127.1 + id * 311.7 + i * 74.3) * 43758.5453
    return n - Math.floor(n)
}
