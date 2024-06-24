// projectionMatrix：投影矩阵
// viewMatrix：视图矩阵
// modelMatrix：模型矩阵
// vec4(position, 1)：顶点坐标
precision lowp float;

attribute vec3 aRandom;
attribute float aScale;

uniform float uTime;
uniform float uSize;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.xyz += (aRandom * uTime) * 10.0;

  vec4 viewPosition = viewMatrix * modelPosition;

  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = uSize * aScale - (uTime * 20.0);

}