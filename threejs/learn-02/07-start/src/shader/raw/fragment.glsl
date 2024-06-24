// precision 美/prɪˈsɪʒn/  有三种精度可以选择
// · highp -2^16 ~ 2^16
// · mediump -2^10 ~ 2^10
// · lowp -2^8 ~ 2^8
precision lowp float;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv, 1.0, 1.0);
}