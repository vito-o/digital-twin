precision lowp float;

// projectionMatrix：投影矩阵
// viewMatrix：视图矩阵
// modelMatrix：模型矩阵
// vec4(position, 1)：顶点坐标

varying vec4 vPosition;
varying vec4 gPosition;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vPosition = modelPosition;
  gPosition = vec4(position, 1.0);

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}