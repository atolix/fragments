#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 hash2(vec2 p) {
  p = vec2(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3))
  );
  return fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, .0));
  float c = hash(i + vec2(.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = .0;
  float a = .5;

  for (int i = 0; i < 5; i++) {
      v += noise(p) * a;
      p *= 24.0;
      a *= .3;
  }

  return v;
}

float voronoi(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float d = 1.0;

  for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2(i + g);
          vec2 r = g + o - f;
          d = min(d, length(r));
      }
  }

  return d;
}

float snowCrystals(vec2 uv) {
  float c1 = pow(1.0 - voronoi(uv * 70.0), 5.0);
  float c2 = pow(1.0 - voronoi(uv * 140.0), 8.0);
  float c3 = pow(1.0 - voronoi(uv * 180.0), 12.0);

  return c1 * .45 + c2 * .35 + c3 * .20;
}

float snowPowder(vec2 uv) {
  float a = fbm(uv * 15.0);
  float b = fbm(uv * 60.0);
  float c = fbm(uv * 80.0);

  float soft = smoothstep(.35, .9, a);
  float sparkle = smoothstep(.78, .98, b);
  float darkPores = smoothstep(.72, .95, c);

  return soft * .55 + sparkle * .25 - darkPores * .18;
}

void main() {
  vec2 screen = gl_FragCoord.xy / u_resolution.xy;
  screen -= .5;
  screen.x *= u_resolution.x / u_resolution.y;

  float depth = screen.y + .85;
  depth = max(depth, .03);

  vec2 uv = vec2(
    screen.x / depth,
    1.0 / depth + u_time * .35
  );
  float large = fbm(uv * 5.0);
  float medium = fbm(uv * 18.0);
  float fine = fbm(uv * 95.0);

  float crystals = snowCrystals(uv);

  float pack = fbm(uv * 9.0);
  crystals *= mix(8.35, .55, pack);

  float powder = snowPowder(uv);
  float height =
      large * .55 +
      medium * .22 +
      powder * .15 +
      fine * .04;

  vec2 e = vec2(0.002, 0.0);

  float hx = (
      fbm((uv + e.xy) * 5.0) * .45 +
      fbm((uv + e.xy) * 18.0) * .25 +
      snowCrystals(uv + e.xy) * .45 +
      fbm((uv + e.xy) * 95.0) * .08
  );

  float hy = (
      fbm((uv + e.yx) * 5.0) * .45 +
      fbm((uv + e.yx) * 18.0) * .25 +
      snowCrystals(uv + e.yx) * .45 +
      fbm((uv + e.yx) * 95.0) * .08
  );

  vec3 n = normalize(vec3(height - hx, height - hy, .035));
  vec3 lightDir = normalize(vec3(-.4, .7, .5));

  float light = dot(n, lightDir) * .5 + .5;

  vec3 coldGray = vec3(.85, .83, .88);
  vec3 snowWhite = vec3(.88, .97, .90);
  vec3 darkIce = vec3(.20, .25, .25);

  vec3 col = mix(coldGray, snowWhite, height);
  col = mix(col, darkIce, smoothstep(.55, .95, fine) * .18);
  col += smoothstep(.75, 1.0, powder) * .08;
  col *= .55 + light * .65;
  col += crystals * .18;

  float vignette = smoothstep(.85, .25, length(uv));
  col *= .85 + vignette * .35;

  gl_FragColor = vec4(col, 1.0);
}
