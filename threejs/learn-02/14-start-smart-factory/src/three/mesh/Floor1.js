import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import eventHub from "@/utils/eventHub";
import gsap from 'gsap'


class Floor1 {
  
  meshGroup = null;
  
  constructor(scene) {
    this.scene = scene
    this.loader = new GLTFLoader()
    
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    this.loader.setDRACOLoader(dracoLoader)

    this.loader.load("/model/floor1.glb", (gltf) => {
      this.meshGroup = gltf.scene
      this.meshGroup.visible = false;
      scene.add(this.meshGroup)

      gltf.scene.traverse(item => {
        if (item.isMesh) {
          // 放射光强度。调节发光颜色。默认为1。
          item.material.emissiveIntensity = 5;
        }
      })
    })
  }

  show() {
    this.meshGroup.visible = true
  }

  hide() {
    this.meshGroup.visible = false
  }

}

export default Floor1;