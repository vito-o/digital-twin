import '../style.css'
//deformation
// 变形动画

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
camera.position.set(0, 0, 18)


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

let params = {
  value: 0
}

let gltfLoader = new GLTFLoader()
gltfLoader.load('/model/sphere1.glb', gltf1 => {
  scene.add(gltf1.scene)
  let mesh1 = gltf1.scene.children[0]

  gltfLoader.load('/model/sphere2.glb', gltf2 => {
    let mesh2 = gltf2.scene.children[0]

    mesh1.geometry.morphAttributes.position = [mesh2.geometry.attributes.position]
    mesh1.updateMorphTargets()
    mesh1.morphTargetInfluences[0] = 1

    gsap.to(params, {
      value: 1,
      duration: 10,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        mesh1.morphTargetInfluences[0] = params.value
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

