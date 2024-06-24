import '../style.css'
//morph
// 变形动画 - 花苗到开花的过程

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import gsap from 'gsap'

// 场景
const scene = new THREE.Scene()



// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 40, 40)


// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true
// ------------------------------------

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

const rgbeLoader = new RGBELoader()
rgbeLoader.load("/textures/038.hdr", texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})


let stem1, stem2, stem3, stem4;
let petal1, petal2, petal3, petal4;

let params = {
  value1: 0,
  value2: 0,
}

let gltfLoader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/model/f4.glb', gltf4 => {
  gltf4.scene.rotation.x = Math.PI
  gltf4.scene.position.y = -8
  scene.add(gltf4.scene)
  
  gltf4.scene.traverse(item4 => {
    if (item4.material && item4.material.name == 'Water') {
      item4.material = new THREE.MeshStandardMaterial({
        color: 'skyblue',
        depthWrite: false,
        depthTest: false,
        transparent: true,
        opacity: 0.7
      })
    }
    // 叶杆
    if (item4.material && item4.material.name == 'Stem') {
      stem4 = item4
    }
    // 花瓣
    if (item4.material && item4.material.name == 'Petal') {
      petal4 = item4
    }
  })

  gltfLoader.load('/model/f2.glb', gltf2 => {
    gltf2.scene.traverse(item2 => {
      // 叶杆
      if (item2.material && item2.material.name == 'Stem') {
        stem2 = item2

        if (!stem4.geometry.morphAttributes.position) {
          stem4.geometry.morphAttributes.position = []
        }
        stem4.geometry.morphAttributes.position[0] = item2.geometry.attributes.position
        // 需要调用updateMorphTargets()方法来确保Three.js能够正确地识别并处理这些形态目标。
        stem4.updateMorphTargets()
        stem4.morphTargetInfluences[0] = 1
      }

      // 花瓣
      if (item2.material && item2.material.name == 'Petal') {
        petal2 = item2
        if (!petal4.geometry.morphAttributes.position) {
          petal4.geometry.morphAttributes.position = []
        }

        petal4.geometry.morphAttributes.position[0] = item2.geometry.attributes.position
        // 需要调用updateMorphTargets()方法来确保Three.js能够正确地识别并处理这些形态目标。
        petal4.updateMorphTargets()
        petal4.morphTargetInfluences[0] = 1
      }
    })

    gsap.to(params, {
      value1: 1,
      duration: 10,
      delay: 0,
      onUpdate: () => {
        petal4.morphTargetInfluences[0] = params.value1
        stem4.morphTargetInfluences[0] = params.value1
      }
    })
  })


  gltfLoader.load('/model/f1.glb', gltf1 => {
    gltf1.scene.traverse(item1 => {
      // 叶杆
      if (item1.material && item1.material.name == 'Stem') {
        stem1 = item1

        if (!stem4.geometry.morphAttributes.position) {
          stem4.geometry.morphAttributes.position = []
        }
        stem4.geometry.morphAttributes.position[1] = item1.geometry.attributes.position
        // 需要调用updateMorphTargets()方法来确保Three.js能够正确地识别并处理这些形态目标。
        stem4.updateMorphTargets()
        stem4.morphTargetInfluences[1] = 0
      }

      // 花瓣
      if (item1.material && item1.material.name == 'Petal') {
        petal1 = item1
        if (!petal4.geometry.morphAttributes.position) {
          petal4.geometry.morphAttributes.position = []
        }

        petal4.geometry.morphAttributes.position[1] = item1.geometry.attributes.position
        // 需要调用updateMorphTargets()方法来确保Three.js能够正确地识别并处理这些形态目标。
        petal4.updateMorphTargets()
        petal4.morphTargetInfluences[1] = 0
      }
    })

    gsap.to(params, {
      value2: 1,
      duration: 10,
      delay: 10,
      onUpdate: () => {
        petal4.morphTargetInfluences[1] = params.value2
        stem4.morphTargetInfluences[1] = params.value2
      }
    })
  })

})


// 设置时钟
const clock = new THREE.Clock()

function animate() {
  let deltaTime = clock.getElapsedTime()

  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)

  controls.update()
}

animate()

// 监听窗口变化
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
})

// 创建GUI
// const gui = new GUI();

