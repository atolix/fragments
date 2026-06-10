#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= .5;
    float angle = atan(uv.y, uv.x);
    float t = sin(angle * 8.0);
    t = t * .5 + .5;
    vec3 col = vec3(t);

    gl_FragColor = vec4(col, 1.0);
}

