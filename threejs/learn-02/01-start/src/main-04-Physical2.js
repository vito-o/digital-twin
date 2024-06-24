import '../style.css'
// MeshPhongMaterial - 清漆效果与清漆粗糙度_清漆法向_清漆相关贴图 

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
camera.position.x = 5
camera.position.y = 5
camera.lookAt(0, 0, 0)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

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

// .glb 模型是二进制的数据
// .gltf 模型是json格式的数据
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

let params = {
  aoMap: true,
};

let rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // envMap.mapping = THREE.EquirectangularReflectionMapping
  envMap.mapping = THREE.EquirectangularRefractionMapping
  scene.background = envMap
  scene.environment = envMap

  /* 
  //sword.gltf   模型-资料中 未找到
  gltfLoader.load('model/sword/sword.gltf', gltf => {
    scene.add(gltf.scene)

    let mesh = gltf.scene.getObjectByName('Pommeau_Plane001')
    let aoMap = mesh.material.aoMap;
    gui.add(params, "aoMap").onChange((value) => {
      mesh.material.aoMap = value ? aoMap : null;
      mesh.material.needsUpdate = true;
    });
  }) 
  */
})

let clearcoatMap = new THREE.TextureLoader().load('/textures/diamond/diamond_emissive.png')

// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhysicalMaterial({
  transparent: true,
  color: 0xffff00,
  // 粗糙度, 0表示不粗糙，但是只有薄薄的一层纸，--立方体需要厚度
  roughness: 0.5,
  // 清漆 - 表示clear coat层的强度，范围从0.0到1.0m，
  clearcoat: 1,
  // clear coat层的粗糙度，由0.0到1.0。 默认为0.0
  // clearcoatRoughness: 0,

  // 这个贴图的红色通道值会与.clearcoat相乘作为整个clear coat的强度值层 
  // 白色为 clearcoat为1， 黑色为clearcoat为0
  // clearcoatMap: clearcoatMap,
  // clearcoatRoughnessMap: clearcoatMap,
  // clearcoatNormalMap: new THREE.TextureLoader().load('/textures/diamond/diamond_normal.png'),
  clearcoatNormalMap: new THREE.TextureLoader().load('/textures/carbon/Scratched_gold_01_1K_Normal.png'),
  
  normalMap: new THREE.TextureLoader().load('/textures/carbon/Carbon_Normal.png'),
  clearcoatNormalScale: new THREE.Vector2(1, 1)
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// gui.add(cube.material, "attenuationDistance", 0, 10).name('衰减距离')
