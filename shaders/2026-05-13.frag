#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;

    uv += vec2(
      sin(uv.y * 8.0 + u_time * .2),
      sin(uv.x * 8.0 + u_time * .2)
    ) * .08;

    float d = length(uv);

    vec2 center1 = vec2(sin(u_time * .4) * .2, .0);
    vec2 center2 = vec2(sin(u_time * .3) * .2, .1);

    float d1 = length(uv - center1);
    float d2 = length(uv - center2);

    d1 += sin(d2 * 22.0 - u_time * 2.0) * .03;
    d2 += sin(d1 * 20.0 - u_time * 1.5) * .03;

    float wave1 = sin(sin(d1 * 40.0 - sin(u_time * 2.0))) * .2;
    float wave2 = sin(sin(d2 * 30.0 - sin(u_time * 6.0))) * .3;
    float wave3 = sin(uv.x * 15.0 + u_time);
    float wave = sin(wave1 * 3.2 + wave2 * .3 + wave3 * .2);
 
    float big = sin(wave * 8.0 - u_time);
    float small = sin(wave * 80.0 - u_time);

    wave = big + small * .001;

    float ring = smoothstep(.02, 1.0, wave);

    vec3 deep = vec3(.04, .06, .07);
    vec3 shallow = vec3(.1, .35, .5);
    vec3 highlight = vec3(.8, .95, 1.0);

    vec3 color = mix(
      deep,
      shallow,
      ring
    );

    color += highlight * pow(ring, 8.0) * .5;
    color *= 1.0 - d * .6;

    gl_FragColor = vec4(color, 1.0);
}

