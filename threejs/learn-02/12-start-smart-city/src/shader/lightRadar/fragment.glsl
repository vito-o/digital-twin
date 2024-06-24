varying vec3 vPosition;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;

// mat2 rotate2d(float _angle){
//   return mat2(
//     cos(_angle), 
//     -sin(_angle),
//     sin(_angle), 
//     cos(_angle)
//   );
// }

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

void main() {
  vec2 newUv = rotate(vUv, -uTime * 6.28, vec2(0.5, 0.5));

  float alpha =  1.0 - step(0.5,distance(newUv, vec2(0.5)));
  
  float angle = atan(newUv.x - 0.5, newUv.y - 0.5); // atan 的值域 [-π, π]
  float strength = (angle + 3.14) / 6.28;           // 的结果[0, 1]

  gl_FragColor = vec4(uColor, alpha * strength);
}