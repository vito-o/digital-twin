import * as THREE from "three";
import camera from "./camera";
import renderer from "./renderer";
import controls from "./controls";
import scene from "./scene";

const clock = new THREE.Clock()
function animate() {
  const time = clock.getElapsedTime()

  controls.update()

  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

export default animate;