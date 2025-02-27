import * as THREE from "three";
import eventHub from "@/utils/eventHub";

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  1,
  50000
);
// 设置相机位置
camera.position.set(1000, 1000, 1000);

class CameraModule {
  constructor() {
    this.activeCamera = camera
    this.collection = {
      default: camera
    }

    eventHub.on('toggleCamera', name => {
      this.setActive(name)
    })
  }

  add(name, camera) {
    this.collection[name] = camera
  }

  setActive(name) {
    this.activeCamera = this.collection[name]
    // this.collection.default.position.set(1000, 1000, 1000)
  }
}

export default new CameraModule()