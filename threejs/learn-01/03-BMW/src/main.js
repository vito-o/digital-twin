import '../style.css'

import * as THREE from 'three'

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  75,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
camera.position.set(0, 2, 6)
camera.lookAt(0, 0, 0)

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)

let canvasDom = document.getElementById('canvasDom')
canvasDom.appendChild(renderer.domElement)

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 设置带阻尼惯性

// 初始化渲染背景
renderer.setClearColor('#000')
scene.background = new THREE.Color('#ccc')
scene.environment = new THREE.Color('#ccc')

// 添加网格地面
const gridHelper = new THREE.GridHelper(10, 10)
gridHelper.material.opacity = 0.15
gridHelper.material.transparent = true
scene.add(gridHelper)

const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)


let wheels = []
let carBody, frontCar, hoodCar, glassCar;

// 创建材质
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1, //金属
  roughness: 0.5, //粗糙度
  clearcoat: 1,   //清漆 -- 表面加一层薄薄的半透明材质
  clearcoatRoughness: 0 // 清漆 粗糙度
})
const frontMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1, //金属
  roughness: 0.5, //粗糙度
  clearcoat: 1,   //清漆 -- 表面加一层薄薄的半透明材质
  clearcoatRoughness: 0 // 清漆 粗糙度
})
const hoodMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1, //金属
  roughness: 0.5, //粗糙度
  clearcoat: 1,   //清漆 -- 表面加一层薄薄的半透明材质
  clearcoatRoughness: 0 // 清漆 粗糙度
})
const wheelsMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1, //金属
  roughness: 0.1, //粗糙度
})
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0, 
  roughness: 0.05,
  transmission: 1,
  transparent: true
})

let colors = ['red', 'blue', 'green', 'gray', 'orange', 'purple']

let colorSelectDom = document.getElementById('colorSelect')
let colorSelectHtml = ''
for (let i = 0; i < colors.length; i++) {
  colorSelectHtml += `
  <div class="select-item">
    <div class="select-item-color" style="background:${colors[i]};" onclick="selectColor(${i})"></div>
  </div>
  `
}
colorSelectDom.innerHTML = colorSelectHtml

// 车身材质
let materials = [
  {name: '磨砂', value: 1},
  {name: '冰晶', value: 0},
]

let materialSelectDom = document.getElementById('materialSelect')
let materialSelectHtml = ''
for (let i = 0; i < materials.length; i++) {
  materialSelectHtml += `
  <div class="select-item">
    <div class="select-item-color" onclick="selectMaterial(${materials[i].value})">${materials[i].name}</div>  
  </div>
  `
}
materialSelectDom.innerHTML = materialSelectHtml

window.selectColor = (i) => {
  bodyMaterial.color.set(colors[i])
  frontMaterial.color.set(colors[i])
  hoodMaterial.color.set(colors[i])
  wheelsMaterial.color.set(colors[i])
  // glassMaterial.color.set(colors[i])
}

window.selectMaterial = (value) => {
  bodyMaterial.clearcoatRoughness = value
  frontMaterial.clearcoatRoughness = value
  hoodMaterial.clearcoatRoughness = value
  wheelsMaterial.clearcoatRoughness = value
}

gltfLoader.load('/model/bmw01.glb', gltf => {
  gltf.scene.traverse(child => {
    if(child.isMesh) {
      if (child.name.indexOf('轮毂') >= 0) {
        child.material = wheelsMaterial
        wheels.push(child)
      }
      if (child.name == '前脸') {
        child.material = frontMaterial
        frontCar = child
      }
      if (child.name == 'Mesh002') {
        child.material = bodyMaterial
        carBody = child
      }
      if (child.name == '引擎盖_1') {
        child.material = hoodMaterial
        hoodCar = child
      }
      if (child.name == '挡风玻璃') {
        child.material = glassMaterial
        glassCar = child
      }
      
    }
  })
  scene.add(gltf.scene)
})

// 添加平行光
const light1 = new THREE.DirectionalLight(0xffffff, 1)
light1.position.set(0, 0, 10)
scene.add(light1)
const light2 = new THREE.DirectionalLight(0xffffff, 1)
light2.position.set(0, 0, -10)
scene.add(light2)
const light3 = new THREE.DirectionalLight(0xffffff, 1)
light3.position.set(10, 0, 0)
scene.add(light3)
const light4 = new THREE.DirectionalLight(0xffffff, 1)
light4.position.set(-10, 0, 0)
scene.add(light4)
const light5 = new THREE.DirectionalLight(0xffffff, 1)
light5.position.set(0, 10, 0)
scene.add(light5)
const light6 = new THREE.DirectionalLight(0xffffff, 0.3)
light6.position.set(5, 10, 0)
scene.add(light6)
const light7 = new THREE.DirectionalLight(0xffffff, 0.3)
light7.position.set(0, 10, 5)
scene.add(light7)
const light8 = new THREE.DirectionalLight(0xffffff, 0.3)
light8.position.set(0, 10, -5)
scene.add(light8)
const light9 = new THREE.DirectionalLight(0xffffff, 0.3)
light9.position.set(-5, 10, 0)
scene.add(light9)

// 渲染
function animate() {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
  controls.update()
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