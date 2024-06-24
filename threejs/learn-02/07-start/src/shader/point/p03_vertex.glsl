// precision 美/prɪˈsɪʒn/  有三种精度可以选择
// · highp -2^16 ~ 2^16
// · mediump -2^10 ~ 2^10
// · lowp -2^8 ~ 2^8
precision lowp float;

// projectionMatrix：投影矩阵
// viewMatrix：视图矩阵
// modelMatrix：模型矩阵
// vec4(position, 1)：顶点坐标

attribute float imgIndex;
attribute float aScale;

uniform float uTime;

varying vec3 vColor;
varying float vImgIndex;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // 获取顶点的角度
  float angle = atan(modelPosition.x, modelPosition.z);
  // 获取顶点到中心的距离
  float distanceToCenter = length(modelPosition.xz);
  // 根据顶点到中心的距离，设置旋转偏移度系数
  float angleOffset = 1.0 / distanceToCenter * uTime;
  // 目前旋转的度数
  angle += angleOffset;

  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // 设置点的大小
  // 根据viewPosition的z坐标决定是否远离摄像机
  gl_PointSize = 400.0 / -viewPosition.z * aScale;

  vImgIndex = imgIndex;
  vColor = color;
}

