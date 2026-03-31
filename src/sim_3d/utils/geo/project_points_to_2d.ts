import * as THREE from "three"


export function project_points_to_2d(points: THREE.Vector3[]): [number, number][]
{
    // Convert THREE.Vector3 points to a flat array for earcut
    // Project to 2D (e.g., equirectangular or local tangent plane)
    // Here, we use a simple tangent plane projection for small polygons

    // Compute centroid for local tangent plane
    const centroid = points.reduce((acc, p) => acc.add(p), new THREE.Vector3()).divideScalar(points.length)
    const normal = centroid.clone().normalize()
    // Create local axes
    const up = new THREE.Vector3(0, 1, 0)
    const tangent = new THREE.Vector3().crossVectors(up, normal).normalize()
    const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize()

    // Project points to 2D plane
    const projected = points.map(p => project_point_to_2d(p, tangent, bitangent, centroid))

    return projected
}


function project_point_to_2d(point: THREE.Vector3, tangent: THREE.Vector3, bitangent: THREE.Vector3, centroid: THREE.Vector3): [number, number]
{
    const v = point.clone().sub(centroid)
    return [
        v.dot(tangent),
        v.dot(bitangent)
    ]
}
