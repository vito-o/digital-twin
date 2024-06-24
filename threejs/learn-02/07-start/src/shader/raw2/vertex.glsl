// precision 美/prɪˈsɪʒn/  有三种精度可以选择
// · highp -2^16 ~ 2^16
// · mediump -2^10 ~ 2^10
// · lowp -2^8 ~ 2^8
precision lowp float;

// projectionMatrix：投影矩阵
// viewMatrix：视图矩阵
// modelMatrix：模型矩阵
// vec4(position, 1)：顶点坐标
attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;
// 将高度值（z轴）传递给片元着色器用于通过高度修改颜色深浅
varying float vElevation;

// 获取时间
uniform float uTime;

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1);
  // 位移
  // modelPosition.x += 1.0;
  // modelPosition.z += 1.0;

  // 倾斜
  // modelPosition.z += modelPosition.x;

  // 波浪线 - 水平方向
  modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.1;
  // 波浪线 - 竖直方向
  modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vElevation = modelPosition.z;
}