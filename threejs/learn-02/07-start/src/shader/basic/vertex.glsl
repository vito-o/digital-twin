// projectionMatrix：投影矩阵
// viewMatrix：视图矩阵
// modelMatrix：模型矩阵
// vec4(position, 1)：顶点坐标

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}