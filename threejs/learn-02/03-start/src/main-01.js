import '../style.css'
//灯光和阴影

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { LogLuvLoader } from "three/examples/jsm/loaders/LogLuvLoader.js";
import { RGBMLoader } from "three/examples/jsm/loaders/RGBMLoader";


// 创建GUI 
const gui = new GUI();

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
camera.position.z = 15
camera.position.y = 15
camera.position.x = 15
camera.lookAt(0, 0, 0)
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true


// .glb 模型是二进制的数据
// .gltf 模型是json格式的数据
/* const gltfLoader = new GLTFLoader()
gltfLoader.load('/model/cup.glb', gltf => {
  scene.add(gltf.scene)
})

const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader) */

const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
const material1 = new THREE.MeshPhysicalMaterial({color: 0xccccff})
const torusKnot = new THREE.Mesh(geometry, material1)
torusKnot.position.set(4, 0, 0)
scene.add(torusKnot)

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const material2 = new THREE.MeshPhysicalMaterial({color: 0xffffff})
const sphere = new THREE.Mesh(sphereGeometry, material2)
scene.add(sphere)

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const material3 = new THREE.MeshPhysicalMaterial({
  color: 0xffcccc,
  alphaMap: new THREE.TextureLoader().load('/texture/16.jpg'),
  transparent: true,
  side: THREE.DoubleSide,
  alphaTest: 0.5,
})
const box = new THREE.Mesh(boxGeometry, material3)
box.position.set(-4, 0, 0)
scene.add(box)

// create plane
let planeGeometry = new THREE.PlaneGeometry(24, 24, 1, 1)
let planeMaterial = new THREE.MeshPhysicalMaterial({color: 0x999999})
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
plane.position.set(0, -2, 0)
scene.add(plane)

// add ambient light
let ambientLight = new THREE.AmbientLight(0xffffff, 1  )
scene.add(ambientLight)
/* 
// 添加平行光
let directionalLight = new THREE.DirectionalLight(0xffffff, 1.6)
directionalLight.position.set(0, 10, 0)
// 默认平行光的目标是源点
directionalLight.target.position.set(0, 0, 0)
scene.add(directionalLight)
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.bottom = -10
// 设置阴影纹理大小
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.castShadow = true

// 点击平行光辅助器
let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper) */

renderer.shadowMap.enabled = true

torusKnot.castShadow = true
torusKnot.receiveShadow = true
sphere.castShadow = true
sphere.receiveShadow = true
box.castShadow = true
box.receiveShadow = true

// plane.castShadow = true
plane.receiveShadow = true

gui.add(sphere.position, 'z', -10, 10).name('z')



/* // 添加聚光灯
let spotLight = new THREE.SpotLight(0xffffff, 10.8)
spotLight.position.set(0, 10, 0)
spotLight.target.position.set(0, 0, 0)
spotLight.castShadow = true
spotLight.decay = 0.5
spotLight.angle = Math.PI / 8
spotLight.distance = 15
spotLight.penumbra = 0.5
spotLight.shadow.mapSize.width = 2048
spotLight.shadow.mapSize.height = 2048
scene.add(spotLight) 

const spotLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( spotLightHelper );
*/

// 添加点光源, 创建点光源等于相当于创建4个聚光灯 
let pointLight = new THREE.PointLight(0xFFFFFF, 10)
pointLight.position.set(0, 5, 0)
pointLight.decay = 1
pointLight.castShadow = true
pointLight.shadow.bias = -0.01
scene.add(pointLight)

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );


let rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // scene.background = envMap
  // scene.environment = envMap
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


