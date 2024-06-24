import '../style.css'
//mipmap解决摩尔纹条纹

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


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
camera.position.z = 5
camera.position.y = 5
camera.position.x = 5
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

let textureLoader = new THREE.TextureLoader()

// let texture = textureLoader.load('/texture/filter/minecraft.png')
let texture = textureLoader.load('/texture/brick/brick_diffuse.jpg')
texture.colorSpace = THREE.SRGBColorSpace;

// 放大滤镜 （纹理比较小，要放大放到模型上）
// 当一个纹素覆盖大于一个像素时，贴图将如何采样。
// 默认值为THREE.LinearFilter， 它将获取四个最接近的纹素，并在他们之间进行双线性插值。 
// texture.magFilter = THREE.LinearFilter
// 另一个选项是THREE.NearestFilter，它将使用最接近的纹素的值。
// texture.magFilter = THREE.NearestFilter

// 缩小滤镜（纹理比较大，要放大放到模型上）
// texture.minFilter = THREE.NearestFilter
// texture.minFilter = THREE.LinearFilter 
// texture.minFilter = THREE.LinearMipMapLinearFilter //(默认)
// 阻止生成mipmap
// texture.generateMipmaps = false



const planeGeometry = new THREE.PlaneGeometry(2, 2)
const planeMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true, 
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
/* const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/model/客厅/scene.glb', gltf => {
  scene.add(gltf.scene)
})
 */

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


