attribute float aSize;

uniform float uTime;
uniform float uLength;

varying float vSize;

void main() {
  vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);
  gl_Position = projectionMatrix * viewPosition;
  vSize = aSize - uTime;
  if (vSize < 0.0) {
    vSize = vSize + uLength;
  }
  
  vSize = (vSize - 500.0) * 0.1;
  // viewPosition.z: 是否远离摄像机，远离摄像机就让它变小，远离是负数，所以前面加个负号
  gl_PointSize = -vSize / viewPosition.z;
}  