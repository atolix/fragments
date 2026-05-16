#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.141414))) * 43562.6543);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);

  u = u * u * (3.0 - 2.0 * u);
  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
    u.y
  );

  return res * res;
}

float fbm(vec2 p) {
  float f = 0.0;

  f += 1.0 * noise(p);
  p *= 2.0;

  f += .5 * noise(p);
  p *= 2.0;

  f += .125 * noise(p);
  p *= 2.0;

  f += .065 * noise(p);

  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  
  uv += vec2(
    sin(uv.y * 8.0 + u_time) + sin(u_time),
    sin(uv.x * 8.0 + u_time) + sin(u_time)
  ) * .05;

  float d = length(uv);

  vec2 warp = vec2(fbm(uv * 2.0 + 1.3), fbm(uv * 2.0 + 1.7));

  float t = sin(u_time * .7) + sin(u_time * 1.3) * .5 + sin(u_time * .7) * .25;

  float n = fbm(uv * 3.0 + warp + fbm(uv * 2.0 - t));

  vec3 deep = vec3(.9, .9, .9);
  vec3 shallow = vec3(.05, .2, .6);
  vec3 color = mix(deep, shallow, n);
  color *= 1.0 - d * .05;
  color.r += fbm(uv * 5.0) * 0.1;
  color.b += fbm(uv * 3.0) * 0.1;

  gl_FragColor = vec4(color, 1.0);
}

