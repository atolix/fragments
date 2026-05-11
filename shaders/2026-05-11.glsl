#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;

    uv += sin(sin(uv.y *3.0 + u_time) * 1.2) * 2.08;

    float d1 = sin(sin(length(uv - vec2(-.2, .0)) * 10.0 + u_time) * 2.9) * 5.05;
    float d2 = sin(sin(length(uv - vec2(.2, .0)) * 10.0 + u_time) * 2.1) * 1.05;

    float wave1 = sin(d1 * 150.0 - u_time * .2);
    float wave2 = sin(d2 * 150.0 - u_time * .09);
    float wave = sin(wave1) * 2.0 + sin(wave2) * 4.0;

    float ring = abs(wave * (sin(u_time * 2.0 + sin(u_time)) + 2.0));

    vec3 color = mix(
        vec3(0.7216, 0.7255, 0.6078),
        vec3(0.1647, 0.1529, 0.2039),
        ring
    );

    gl_FragColor = vec4(color, 1.0);
}

