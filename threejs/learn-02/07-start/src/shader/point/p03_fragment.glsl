// precision 美/prɪˈsɪʒn/  有三种精度可以选择
// · highp -2^16 ~ 2^16
// · mediump -2^10 ~ 2^10
// · lowp -2^8 ~ 2^8
precision lowp float;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;

varying float vImgIndex;

varying vec3 vColor;

void main() {
  // gl_PointCoord 点渲染模式对应点像素坐标
  vec4 textureColor;
  if (vImgIndex == 0.0) {
    textureColor = texture2D(uTexture1, gl_PointCoord);
  } else if (vImgIndex == 1.0) {
    textureColor = texture2D(uTexture2, gl_PointCoord);
  } else {
    textureColor = texture2D(uTexture3, gl_PointCoord);
  }

  gl_FragColor = vec4(vColor, textureColor.r);
}