uniform sampler2D u_day_texture;
uniform sampler2D u_night_texture;
uniform sampler2D u_specular_clouds_texture;
uniform vec3 u_sun_direction;
uniform vec3 u_atmosphere_day_color;
uniform vec3 u_atmosphere_twilight_color;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun orientation
    float sunOrientation = dot(u_sun_direction, normal);

    // Daylight
    float daylight = smoothstep(-0.2, 1.0, sunOrientation);

    // Day / night color
    float dayMix = smoothstep(-0.18, 0.0, sunOrientation);
    vec3 dayColor = texture(u_day_texture, vUv).rgb;
    vec3 adjustedDayColor = mix(vec3(0.0), dayColor, daylight);
    vec3 nightColor = texture(u_night_texture, vUv).rgb;
    color = mix(nightColor, adjustedDayColor, dayMix);

    // Specular cloud color
    vec2 specularCloudsColor = texture(u_specular_clouds_texture, vUv).rg;

    // Clouds
    float cloudsMix = smoothstep(0.5, 1.0, specularCloudsColor.g);
    cloudsMix *= dayMix;
    color = mix(color, vec3(1.0), cloudsMix);

    // Fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    // Atmosphere
    // We want to make sure that the atmosphere is red only when view direction
    // is looking towards the sun through the atmosphere.
    float twilightScatteringMix = dot(u_sun_direction, viewDirection);
    vec3 atmosphereScatteringColor = mix(u_atmosphere_day_color, u_atmosphere_twilight_color, twilightScatteringMix);

    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(atmosphereScatteringColor, u_atmosphere_day_color, atmosphereDayMix);
    // We need to use this otherwise as camera rotates round the Earth to be
    // between the earth and the sun then the section of the Earth that is in
    // the dusk or dawn will become much brighter then when viewing with the
    // camera orthogonal to the sun-earth axis, and this looks strange.
    float lessExtremeAtmosphereDayMix = smoothstep(-0.2, 1.0, sunOrientation);
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

    // Specular
    vec3 reflection = reflect(- u_sun_direction, normal);
    float specular = - dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 32.0);
    specular *= specularCloudsColor.r;

    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
    color += specular * specularColor;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
