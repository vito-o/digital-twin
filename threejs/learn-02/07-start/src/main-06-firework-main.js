import '../style.css'
//烟花
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

import Fireworks from './main-06-firework-firework'

import { Water } from 'three/examples/jsm/objects/Water2'

import flylight_vertexShader from './shader/firework/flylight_vertex.glsl?raw'
import flylight_fragmentShader from './shader/firework/flylight_fragment.glsl?raw'

import gsap from 'gsap'

// 场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  90,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(10, 7, 30)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.1
document.body.appendChild(renderer.domElement)

// ------------------------------------
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// ------------------------------------

// 坐标辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

let textureLoader = new THREE.TextureLoader()


const rgbeLoader = new RGBELoader();
rgbeLoader.load('/assets/2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap
})

const gltfLoader = new GLTFLoader()
gltfLoader.load('/assets/model/newyears_min.glb', gltf => {
  console.log(gltf.scene)
  scene.add(gltf.scene)

  const waterGeometry = new THREE.PlaneGeometry(70, 70)
  let water = new Water(waterGeometry, {
    scale: 4,
    textureWidth: 1024,
    textureHeight: 1024,
  })
  water.position.y = 1
  water.rotation.x = -Math.PI / 2
  scene.add(water)
})


let LightBox = null;
gltfLoader.load('/assets/model/flyLight.glb', gltf => {
  LightBox = gltf.scene.children[0]
  LightBox.material = new THREE.ShaderMaterial({
    vertexShader: flylight_vertexShader,
    fragmentShader: flylight_fragmentShader,
    side: THREE.DoubleSide
  })

  for(let i = 0; i < 50; i++) {
    let flyLight = gltf.scene.clone();
    let x = (Math.random() - 0.5) * 300;
    let z = (Math.random() - 0.5) * 300;
    let y = Math.random() * 60 + 5;
    flyLight.position.set(x, y, z)

    gsap.to(flyLight.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 30,
      repeat: -1
    })
    gsap.to(flyLight.position, {
      x: '+=' + Math.random() * 5,
      y: '+=' + Math.random() * 20,
      yoyo: true,
      duration: 5 + Math.random() * 10,
      repeat: -1
    })
    scene.add(flyLight)
  }
})


// 管理烟花
let fireworks = [];
let createFireworks = () => {
  let color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`

  let position = {
    x: (Math.random() - 0.5) * 40,
    z: (Math.random() - 0.5) * 40,
    y: Math.max(3 + Math.random() * 15, 10)
  }

  let firework = new Fireworks(color, position)
  firework.addScene(scene, camera)
  fireworks.push(firework)
}

window.addEventListener('click', createFireworks)


// 设置时钟 
const clock = new THREE.Clock()

function animate() {
  const elapsedTime = clock.getElapsedTime()
  // console.log(Math.floor(elapsedTime) % (Math.floor(Math.random() * 5)+1))
  if (Math.floor(elapsedTime) % (Math.floor(Math.random() * 15)+1) == 7) {
    createFireworks()
  }


  fireworks.forEach((item,i) => {
    let type = item.update()

    if (type === 'remove') {
      fireworks.splice(i, 1)
    }
  })

  controls.update()

  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)
}

animate()

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix()
})

// 创建GUI
const gui = new GUI();


