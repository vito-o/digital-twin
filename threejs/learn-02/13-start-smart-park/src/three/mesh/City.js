import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import eventHub from "@/utils/eventHub";
import gsap from 'gsap'
import CameraModule from '../camera'

class City {
  constructor(scene) {
    this.scene = scene
    this.loader = new GLTFLoader()
    
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    this.loader.setDRACOLoader(dracoLoader)

    this.loader.load("/model/city4.glb", (gltf) => {
      scene.add(gltf.scene)
      this.gltf = gltf;

      gltf.scene.traverse(item => {
        if (item.name == '热气球') {
          this.mixer = new THREE.AnimationMixer(item)
          this.clip = gltf.animations[1]
          this.action = this.mixer.clipAction(this.clip)
          this.action.play()
          this.action.timeScale = 2
        }

        if (item.name === "汽车园区轨迹") {
          let line = item
          line.visible = false
          
          // 根据点创建曲线
          const points = []
          for(let i = line.geometry.attributes.position.count - 1; i >= 0; i--) {
            points.push(
              new THREE.Vector3(
                line.geometry.attributes.position.getX(i),
                line.geometry.attributes.position.getY(i),
                line.geometry.attributes.position.getZ(i),
              )
            )
          }

          this.curve = new THREE.CatmullRomCurve3(points)
          this.curveProgress = 0
          this.carAnimate()
        }

        if (item.name === "redcar") {
          this.redCar = item;
        }

      })

      gltf.cameras.forEach(camera => {
        CameraModule.add(camera.name, camera)
      })

    })
    
    eventHub.on('actionClick', i => {
      this.action.reset()
      this.clip = this.gltf.animations[i]
      this.action = this.mixer.clipAction(this.clip)
      this.action.play()
      // this.action.s
    })
  }

  update(time) {
    if (this.mixer) {
      this.mixer.update(time)
    }
  }

  carAnimate() {
    gsap.to(this, {
      curveProgress: 0.999,
      duration: 10,
      repeat: -1,
      onUpdate: () => {
        const point = this.curve.getPoint(this.curveProgress);
        this.redCar.position.set(point.x, point.y, point.z)
        if (this.curveProgress + 0.001 < 1) {
          const point = this.curve.getPoint(this.curveProgress + 0.001)
          this.redCar.lookAt(point)
        }
      }
    })
  }
}


export default City;