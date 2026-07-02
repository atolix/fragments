#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;

    mat2 rot = mat2(
      cos(u_time * 0.2), -sin(u_time * 0.2),
      sin(u_time * 0.2), cos(u_time * 0.2)
    );
    uv = rot * uv;

    float d = length(uv);
    d += sin(u_time + d * 30.0) * 0.1;
    float a = atan(uv.y, uv.x);
    a += u_time * .3;

    float pattern = sin(a * 10.0) + sin(d * 50.0);
    float grid = sin(uv.x * 20.0) * sin(uv.y * 20.0);
    pattern = pattern * .5 + .5;
    pattern = mix(pattern, pattern * grid, .3);
    vec3 color = vec3(pattern);

    gl_FragColor = vec4(color, 1.0);
}

