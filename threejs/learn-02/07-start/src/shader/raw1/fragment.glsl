// precision 美/prɪˈsɪʒn/  有三种精度可以选择
// · highp -2^16 ~ 2^16
// · mediump -2^10 ~ 2^10
// · lowp -2^8 ~ 2^8
precision lowp float;

varying vec2 vUv;

// 将顶点着色器中获取的各顶点的高度值（z轴）修改颜色深浅
varying float vElevation;

void main() {
  float deep = vElevation + 0.05 * 10.0;

  // gl_FragColor = vec4(vUv.x*deep, vUv.y*deep, 1.0, 1.0);
  gl_FragColor = vec4(1.0*deep, 0.0*deep, 0.0, 1.0);
}