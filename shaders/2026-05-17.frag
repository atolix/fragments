#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float scene(vec3 p) {
    p.x += sin(p.z * .9 + u_time) * .5;
    p.z = mod(p.z, 6.0) - 3.0;
    float outer = length(p.xy) - 1.4;
    float inner = length(p.xy) - 1.0;

    vec3 rp = p;
    rp.z = mod(rp.z, .5) - .15;
    vec3 b = abs(p) - vec3(.2);
    float hole = max(max(b.x, b.y), b.z);
    float tunnel = max(outer, -inner);

    return max(tunnel, -hole);
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(.01, 0.0);
    return normalize(vec3(
        scene(p + e.xyy) - scene(p - e.xyy),
        scene(p + e.yxy) - scene(p - e.yxy),
        scene(p + e.yyx) - scene(p - e.yyx)
    ));
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
    vec3 ro = vec3(
      sin(u_time * 2.5 * .9 + u_time) * .4,
      0.0,
      u_time * 3.0
    );
    vec3 rd = normalize(vec3(uv, 1.0));
    float t = 0.0;
    vec3 p;

    bool hit = false;
    for(int i = 0; i < 100; i++) {
      p = ro + rd * t;
      float d = scene(p);
      t += d;
      if(d < 0.001) {
          hit = true;
          break;
      }

      if(t > 50.0) {
          break;
      }
    }

    vec3 color = vec3(.0);
    if(hit) {
      vec3 normal = getNormal(p);
      vec3 light = normalize(vec3(1.0, 1.0, -1.0));
      float diffuse = max(dot(normal, light), 0.2);
      float fog = exp(-t * .005);

      color = vec3(.9, .9, 1.0) * diffuse * fog;
    }

    gl_FragColor = vec4(color, 1.0);
}
