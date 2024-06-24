import CameraModule from "./camera";
import { renderer, css3dRenderer } from './renderer'

// 更新摄像头
CameraModule.activeCamera.aspect = window.innerWidth / window.innerHeight
// 更新摄像机的投影矩阵
CameraModule.activeCamera.updateProjectionMatrix();

// 监听屏幕变动
window.addEventListener('resize', () => {
  CameraModule.activeCamera.aspect = window.innerWidth / window.innerHeight
  CameraModule.activeCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
  css3dRenderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
})