// precision 美/prɪˈsɪʒn/  有三种精度可以选择
// · highp -2^16 ~ 2^16
// · mediump -2^10 ~ 2^10
// · lowp -2^8 ~ 2^8
precision lowp float;

// projectionMatrix：投影矩阵
// viewMatrix：视图矩阵
// modelMatrix：模型矩阵
// vec4(position, 1)：顶点坐标

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // 设置点的大小
  gl_PointSize = 80.0;
}

