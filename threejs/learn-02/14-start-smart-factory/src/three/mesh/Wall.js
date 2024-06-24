import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import eventHub from "@/utils/eventHub";
import gsap from 'gsap'

class Wall {

  meshGroup = null;

  constructor(scene) {
    this.scene = scene
    this.loader = new GLTFLoader()
    
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    this.loader.setDRACOLoader(dracoLoader)

    this.loader.load("/model/wall.glb", (gltf) => {
      this.meshGroup = gltf.scene;
      scene.add(this.meshGroup)
    })
  }

  show() {
    this.meshGroup.visible = true
  }

  hide() {
    this.meshGroup.visible = false
  }

}

export default Wall;