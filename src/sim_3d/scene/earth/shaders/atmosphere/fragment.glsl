uniform vec3 u_sun_direction;
uniform vec3 u_atmosphere_day_color;
uniform vec3 u_atmosphere_twilight_color;

varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun orientation
    float sunOrientation = dot(u_sun_direction, normal);

    // Atmosphere
    // We want to make sure that the atmosphere is red only when view direction
    // is looking towards the sun through the atmosphere.
    float twilightScatteringMix = dot(u_sun_direction, viewDirection);
    vec3 atmosphereScatteringColor = mix(u_atmosphere_day_color, u_atmosphere_twilight_color, twilightScatteringMix);

    float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(atmosphereScatteringColor, u_atmosphere_day_color, atmosphereDayMix);
    color = mix(color, atmosphereColor, atmosphereDayMix);
    color += atmosphereColor;

    // Alpha
    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);

    float dayAlpha = smoothstep(- 0.5, 0.0, sunOrientation);

    float alpha = edgeAlpha * dayAlpha;

    // Final color
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
