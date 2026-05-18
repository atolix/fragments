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

float scene(vec3 p) {
  vec3 q = p;

  q.x += sin(q.y * 7.0 + u_time) * .1;
  q.y += sin(q.z * 9.0 + u_time * .7) * .2;

  float d = length(q) - 1.5;

  d += (fbm(q.xy * 1.5 + u_time * .1 + q.z) - .5) * .15;
  return d;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
  vec3 ro = vec3(.0, .0, -3.0);
  vec3 rd = normalize(vec3(uv, 1.0));
 
  bool hit = false;
  vec3 p;
  float t = .0;
  for(int i = 0; i < 80; i++) {
    p = ro + rd * t;
    float d = scene(p);
    t += d;
    
    if(d < .001) {
      hit = true;
      break;
    }
  }

  vec3 color = vec3(.0);

  if(hit) {
    vec2 e = vec2(.001, 0.0);

    vec3 normal = normalize(vec3(
      scene(p + e.xyy) - scene(p - e.xyy),
      scene(p + e.yxy) - scene(p - e.yxy),
      scene(p + e.yyx) - scene(p - e.yyx)
    ));
    vec3 light = normalize(vec3(1.0, 1.0, -.5));
    vec3 viewDir = normalize(ro - p);
    vec3 reflectDir = reflect(-light, normal);
    float diffuse = max(dot(normal, light), 0.0);
    float specular = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

    vec3 base = mix(vec3(.1, .2, .8), vec3(.8, .8, 1.0), fbm(p.xy * 1.5));

    color = base * diffuse + vec3(specular) + vec3(.2, .3, .4) + fresnel * vec3(.4, .7, 1.0);
  } 

  gl_FragColor = vec4(color, 1.0);
}
