import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import eventHub from "@/utils/eventHub";
import gsap from 'gsap'
import CameraModule from '../camera'
import ControlsModule from '../controls'

class Person {
  constructor(scene) {
    this.scene = scene
    this.loader = new GLTFLoader()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    this.loader.setDRACOLoader(dracoLoader)

    this.loader.load("/model/jianshen-min1.glb", (gltf) => {
      gltf.scene.position.set(-815, 145, 65)
      this.scene.add(gltf.scene)

      gltf.scene.traverse(item => {
        if (item.isMesh) {
          item.material.depthWrite = true;
          item.material.normalScale = new THREE.Vector2(1, 1);
          item.material.side = THREE.FrontSide;
          item.material.transparent = false;
          item.material.vertexColors = false;
        }
      })

      this.mixer = new THREE.AnimationMixer(gltf.scene)
      this.clip = gltf.animations[0]
      this.action = this.mixer.clipAction(this.clip)
      this.action.play()


      eventHub.on('wudaoClick', () => {
        let mesh = gltf.scene.clone()

        ControlsModule.controls.target = new THREE.Vector3(
          mesh.position.x,
          mesh.position.y,
          mesh.position.z,
        )

        CameraModule.activeCamera.position.set(
          mesh.position.x,
          mesh.position.y + 3,
          mesh.position.z + 7
        )
      })

      eventHub.on('wudaoEndClick', () => {
        ControlsModule.controls.target = new THREE.Vector3(0, 0, 0)
        CameraModule.activeCamera.position.set(1000, 1000, 1000)
      })
    })
  }

  update(time) {
    if (this.mixer) {
      this.mixer.update(time)
    }
  }
}

export default Person;