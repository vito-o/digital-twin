import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import CameraModule from '../camera'

import eventHub from "@/utils/eventHub";
import gsap from 'gsap'

import vertexShader from '@/shader/fighter/vertexShader.glsl?raw'
import fragmentShader from '@/shader/fighter/fragmentShader.glsl?raw'

class Fighter {

  meshGroup = null;
  floor2 = null;

  constructor(scene) {
    this.scene = scene
    this.loader = new GLTFLoader()
    
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    this.loader.setDRACOLoader(dracoLoader)

    this.loader.load("/model/Fighter1.glb", (gltf) => {
      this.meshGroup = gltf.scene;
      this.meshGroup.position.set(3, 42, 68);
      this.meshGroup.visible = false;
      scene.add(this.meshGroup)

      gltf.scene.traverse(item => {
        if (item.isMesh) {
          // 放射光强度。调节发光颜色。默认为1。
          item.material.emissiveIntensity = 15;
          item.rawPosition = item.position.clone()
        }
      })

      this.mouse = new THREE.Vector2()
      this.raycaster = new THREE.Raycaster()

      window.addEventListener('click', e => {
        e.mesh = this;
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -((e.clientY / window.innerHeight) * 2 -1);

        this.raycaster.setFromCamera(this.mouse, CameraModule.activeCamera)

        let intersects = this.raycaster.intersectObject(this.meshGroup)
        if (intersects.length) {
          // 点击了战斗机
          eventHub.emit('clickFighter', this.floor2.meshGroup.visible)
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

  setFloor2(floor2) {
    this.floor2 = floor2
  }

  // 展开飞机
  flat() {
    const positions = []
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        positions.push(new THREE.Vector3(i * 2 - 2, j * 2 - 2, 0))
      }
    }

    let n = 0;
    this.meshGroup.traverse(item => {
      positions[n].multiplyScalar(10);

      gsap.to(item.position, {
        x: '+=' + positions[n].x,
        y: '+=' + positions[n].y,
        z: '+=' + positions[n].z,
        duration: 1
      })
      n++;
    })
  }

  // 恢复
  recover() {
    this.meshGroup.position.set(3, 42, 68);
    this.meshGroup.traverse(item => {
      if (item.isMesh) {
        gsap.to(item.position, {
          x: item.rawPosition.x,
          y: item.rawPosition.y,
          z: item.rawPosition.z,
          duration: 1
        })
      }
    })
  }

  // 变成点
  becomePoint() {
    const texture = new THREE.TextureLoader().load('/assets/particles/1.png')
    this.pointsGroup = new THREE.Group();
    this.pointsGroup.position.set(3, 42, 68);

    const createPoints = (mesh, group) => {
      if (mesh.children.length) {
        mesh.children.forEach(item => {
          if (item.isMesh) {
            const color = new THREE.Color(
              Math.random(),
              Math.random(),
              Math.random(),
            )

            /* const material = new THREE.PointsMaterial({
              size: 0.1,
              color,
              map: texture,
              blending: THREE.AdditiveBlending,
              transparent: true,
              depthTest: false
            }) */
            const material = new THREE.ShaderMaterial({
              uniforms: {
                uColor: { value: color },
                uTexture: { value: texture },
                uTime: { value: 0 }
              },
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
              blending: THREE.AdditiveBlending,
              transparent: true,
              depthTest: false
            })

            const points = new THREE.Points(item.geometry, material)
            points.position.copy(item.position)
            points.rotation.copy(item.rotation)
            points.scale.copy(item.scale)

            group.add(points)

            createPoints(item, points)
          }
        })
      }
    }

    createPoints(this.meshGroup, this.pointsGroup)

    this.scene.add(this.pointsGroup)
    this.hide()
  }

  // 点-爆炸
  pointsBlast() {
    this.pointsGroup.traverse(item => {
      if(item.isPoints) {
        let randomPositionArray = new Float32Array(
          item.geometry.attributes.position.count * 3
        )
        for (let i = 0; i < item.geometry.attributes.position.count; i++) {
          randomPositionArray[i * 3 + 0] = (Math.random() * 2 - 1) * 10 + this.pointsGroup.position.x
          randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10 + this.pointsGroup.position.y
          randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10 + this.pointsGroup.position.z
        }

        item.geometry.setAttribute('aPosition', new THREE.BufferAttribute(randomPositionArray, 3))

        gsap.to(item.material.uniforms.uTime, {
          value: 10,
          duration: 10
        })
      }
    })
  }

  //点-还原
  pointsRevert() {
    this.pointsGroup.traverse(item => {
      if (item.isPoints) {
        gsap.to(item.material.uniforms.uTime, {
          value: 0,
          duration: 10
        })
      }
    })
  }
}

export default Fighter;