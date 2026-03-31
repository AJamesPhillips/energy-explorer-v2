

export function new_random_id()
{
    return new Date().toISOString() + " " + Math.random().toString(36).substring(2, 15)
}
