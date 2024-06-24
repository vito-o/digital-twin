import '../style.css'
//1.变换控制器对物体位移_旋转_缩放技巧
//2.变换控制器按照本地与世界坐标控制

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

// 创建变换控制器
let tControls = new TransformControls(camera, renderer.domElement)
tControls.addEventListener('change', animate)
// 监听拖动事件，当拖动物体时候，禁用轨道控制器
tControls.addEventListener('dragging-changed', event => {
  controls.enabled = !event.value
})
scene.add(tControls)


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
  setTranslate: () => {
    tControls.setMode('translate')
  },
  setRotate: () => {
    tControls.setMode('rotate')
  },
  setScale: () => {
    tControls.setMode('scale')
  },
  toggleSpace: () => {
    tControls.setSpace(tControls.space === 'local' ? 'world' : 'local')
  },
  cancelMesh: () => {
    tControls.detach()
  }
}

// 通过键盘按键控制 旋转，大小 位移控制切换
window.addEventListener('keydown', e => {
  if (e.key === 't') {
    params.setTranslate()
  }
  if (e.key === 'r') {
    params.setRotate()
  }
  if (e.key === 's') {
    params.setScale()
  }
})

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
gui.add(params, 'setTranslate').name('切换为位移模式')
gui.add(params, 'setRotate').name('切换为旋转模式')
gui.add(params, 'setScale').name('切换为放大缩小模式')
gui.add(params, 'toggleSpace').name('切换空间模式')
gui.add(params, 'cancelMesh').name('取消物体选中')

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
      object3d.scale.set(mesh.scale, mesh.scale, mesh.scale)
      scene.add(object3d)

      // 控制物体
      tControlSelect(object3d)

      // 添加重新选择物体
      let meshOpt = {
          toggleMesh: () => {
            tControlSelect(object3d)
          }
      }
      meshesNum[mesh.name] = meshesNum[mesh.name] ? meshesNum[mesh.name] + 1 : 1
      meshesFolder.add(meshOpt, 'toggleMesh').name(mesh.name + meshesNum[mesh.name])
    })

  }

  folder.add(mesh, 'addMesh').name(`添加${mesh.name}模型`)
}

function tControlSelect(mesh) {
  tControls.attach(mesh)
}

let meshesFolder = gui.addFolder('家具列表')
let meshesNum = {}