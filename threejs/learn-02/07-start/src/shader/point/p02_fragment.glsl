// precision 美/prɪˈsɪʒn/  有三种精度可以选择
// · highp -2^16 ~ 2^16
// · mediump -2^10 ~ 2^10
// · lowp -2^8 ~ 2^8
precision lowp float;

uniform sampler2D uTexture;

void main() {
  // gl_PointCoord 点渲染模式对应点像素坐标

  // 渐变圆
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;
  // gl_FragColor = vec4(strength);

  // vec4 textureColor = texture2D(uTexture, gl_PointCoord);
  // gl_FragColor = vec4(textureColor.rgb, textureColor.r);

  vec4 textureColor = texture2D(uTexture, gl_PointCoord);
  gl_FragColor = vec4(gl_PointCoord, 1, textureColor.r);
}