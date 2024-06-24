import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

import eventHub from "@/utils/eventHub";
import gsap from 'gsap'


class Floor2 {

  meshGroup = null;
  tags = []

  constructor(scene) {
    this.scene = scene
    this.loader = new GLTFLoader()
    
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    this.loader.setDRACOLoader(dracoLoader)

    this.loader.load("/model/floor2.glb", (gltf) => {
      this.meshGroup = gltf.scene;
      this.meshGroup.visible = false;
      scene.add(this.meshGroup)

      gltf.scene.traverse(item => {
        if (item.isMesh) {
          // 放射光强度。调节发光颜色。默认为1。
          item.material.emissiveIntensity = 5;
        }

        if (item.type === 'Object3D' && item.children.length === 0) {
          this.createTag(item)
        }
      })
    })
  }

  createTag(mesh) {
    const divDom = document.createElement('div')
    divDom.className = 'elementTag'
    divDom.innerHTML = `
      <div class="elementContent">
        <h3>${mesh.name}</h3>
        <p>温度：26°</p>
        <p>湿度：50%</p>
      </div>
    `
    const css3dObject = new CSS3DObject(divDom);
    css3dObject.scale.set(0.2, 0.2, 0.2)
    css3dObject.position.copy(mesh.position)
    css3dObject.visible = false
    // this.scene.add(css3dObject)
    this.meshGroup.add(css3dObject)
    this.tags.push(css3dObject)
  }

  show() {
    this.meshGroup.visible = true
    this.tags.forEach(tag => {
      tag.visible = true
    })
  }

  hide() {
    this.meshGroup.visible = false
    this.tags.forEach(tag => {
      tag.visible = false
    })
  }

}


export default Floor2;