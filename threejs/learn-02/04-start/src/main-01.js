import '../style.css'
//基础设置与物体添加列表

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// 场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 设置相机位置
camera.position.z = 5
camera.position.y = 1.8
camera.position.x = 0
camera.lookAt(0, 2, 0)
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

// 添加网格辅助器
const gridHelper = new THREE.GridHelper(50, 50)
gridHelper.material.opacity = 0.3
gridHelper.material.transparent = true
scene.add(gridHelper)

const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

/* // 直接使用时候报错，THREE.GLTFLoader: No DRACOLoader instance provided
// 原因是模型是压缩的，需要使用解压缩工具DRACOLoader
gltfLoader.load('/model/客厅/scene.glb', gltf => {
  scene.add(gltf.scene)
}) */

// 加载环境贴图
let rgbLoader = new RGBELoader()
rgbLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = envMap
  scene.background = new THREE.Color(0xcccccc)
})

function animate() {
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

let basicScene;

gltfLoader.load('/model/liveroom-scene.glb', gltf => {
  gltf.scene.rotation.y = - Math.PI / 2
  basicScene = gltf.scene
  // scene.add(gltf.scene)
})

let params = {
  addScene: () => {
    scene.add(basicScene)
  },
  addMesh: () => {

  },
}

let meshList= [
  {
    name: '盆栽',
    path: '/model/house/tree.gltf',
    scale: 0.1,
  },
  {
    name: '单人沙发',
    path: '/model/house/sofa.glb',
    scale: 0.25,
  },
]

gui.add(params, 'addScene').name('添加户型基础模型')

let sceneMeshes = []
let folder = gui.addFolder('添加物体')
for(let mesh of meshList) {
  mesh.addMesh = () => {
    gltfLoader.load(mesh.path, gltf => {
      sceneMeshes.push({
        ...mesh,
        object3d: gltf.scene
      })
      let object3d = gltf.scene
      console.log(object3d)
      object3d.scale.set(mesh.scale, mesh.scale, mesh.scale)
      scene.add(object3d)
    })
  }

  folder.add(mesh, 'addMesh').name(`添加${mesh.name}模型`)
}
