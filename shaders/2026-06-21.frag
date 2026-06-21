#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.141414))) * 43562.6543);
}

float luminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

vec3 grayscale(vec3 color) {
  return vec3(luminance(color));
}

vec3 saturation(vec3 color, float amount) {
  return mix(grayscale(color), color, amount);
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

float ridgedNoise(vec2 p) {
  return 1.0 - abs(noise(p) * 2.0 - 1.0);
}

float ridgedFbm(vec2 p) {
  float f = 0.0;
  float amplitude = 0.5;
  float totalAmplitude = 0.0;

  for (int i = 0; i < 5; i++) {
    f += ridgedNoise(p) * amplitude;
    totalAmplitude += amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }

  return f / totalAmplitude;
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
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= .5;
  float d = length(uv);
  uv.x += u_time * .02;
  uv.y += u_time * .03;

  vec3 color = vec3(vec2(ridgedFbm(uv), fbm(uv)), .5 + .5 * sin(d));
  vec3 saturated = saturation(color, 3.0);

  gl_FragColor = vec4(saturated, 1.0);
}
