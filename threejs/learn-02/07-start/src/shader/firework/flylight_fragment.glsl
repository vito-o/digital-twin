precision lowp float;

varying vec4 vPosition;
varying vec4 gPosition;

void main() {
  vec4 redColor = vec4(1, 0, 0, 1);
  vec4 yellowColor = vec4(1, 1, 0.5, 1);
  vec4 mixColor = mix(redColor, yellowColor, gPosition.y / 3.0);

  // 判断是正面还是里面 （让里面亮一点）
  if (gl_FrontFacing) {
    gl_FragColor = vec4(mixColor.xyz - (vPosition.y) / 120.0, 1.0);

  } else {
    gl_FragColor = vec4(mixColor.xyz, 1.0);
  }

}