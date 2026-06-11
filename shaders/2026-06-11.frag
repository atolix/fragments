#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 xy) {
  return fract(sin(dot(xy, vec2(12.9808, 78.233))) * 43758.54326);
}

float noise(vec2 xy) {
  vec2 i = floor(xy);
  vec2 f = fract(xy);

  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  float x1 = mix(a, b, f.x);
  float x2 = mix(c, d, f.x);

  return mix(x1, x2, f.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float swirl = sin(a * 10.0 + r * 18.0 - u_time * .8);
    swirl += sin(a * 1.0 - r * 28.0 + u_time * .5);
    float n = noise(uv * 16.0 + u_time * .15);
    n = noise(uv * n + u_time * .15);
    swirl += sin((r * 19.0 + n * 6.0) + a * 4.0);
    swirl *= .5;

    float t = swirl * .5 + .5;
    t = smoothstep(.25, .85, t);
    
    vec3 c1 = vec3(.55, .92, .90);
    vec3 c2 = vec3(.22, .62, .78);
    vec3 c3 = vec3(.40, .40, .52);

    vec3 col = mix(c1, c2, t);
    col = mix(col, c3, smoothstep(.55, .95, sin(r * 22.0 + swirl * 3.0)));

    gl_FragColor = vec4(col, 1.0);
}

