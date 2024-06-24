import * as THREE from "three";
import CameraModule from "./camera";
import renderer from "./renderer";
import ControlsModule from "./controls";
import scene from "./scene";
import { updateMesh } from './createMesh'

const clock = new THREE.Clock()
function animate() {
  //获取自时钟启动后的秒数
  // const time = clock.getElapsedTime() 
  //获取自 .oldTime 设置后到当前的秒数
  const time = clock.getDelta()      
  ControlsModule.controls.update(time)
  updateMesh(time)

  renderer.render(scene, CameraModule.activeCamera)

  requestAnimationFrame(animate)
}

export default animate;