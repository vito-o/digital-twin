import camera from "./camera";
import renderer from './renderer'

// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight
// 更新摄像机的投影矩阵
camera.updateProjectionMatrix();

// 监听屏幕变动
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
})