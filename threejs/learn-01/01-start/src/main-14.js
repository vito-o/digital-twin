import '../style.css'
// 对顶点进行移动

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入tween
import * as TWEEN from 'three/examples/jsm/libs/tween.module'


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
camera.position.z = 15
camera.position.x = 0
camera.position.y = 0
camera.lookAt(0, 0, 0)

// 场景渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true

let texture = new THREE.TextureLoader().load('/textures/uv_grid_opengl.jpg')


// 使用索引绘制
const geometry = new THREE.BufferGeometry()
// 设置顶点
const vectices = new Float32Array([
  -1.0, -1.0, 0.0, 
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0,
  -1.0,  1.0, 0.0,
])
geometry.setAttribute('position', new THREE.BufferAttribute(vectices, 3))
// 设置索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
geometry.setIndex(new THREE.BufferAttribute(indices, 1))
// 设置uv坐标 (逆时针走，从左下角开始， uv坐标是贴图的坐标)
const uv = new Float32Array([
  0, 0, 1, 0, 1, 1, 0, 1
])
geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
// 设置法向量（normal）
geometry.computeVertexNormals()


const geoMaterial = new THREE.MeshBasicMaterial({
  // color: 0xff0000, 
  side: THREE.DoubleSide,
  // wireframe: true
  map: texture
})
const geo = new THREE.Mesh(geometry, geoMaterial)
// geo.position.x = 2;
scene.add(geo)

// 顶点偏移转换，  什么时候用，就是原来顶点偏离了原点的时候 才用这个偏移做顶点转换
geometry.translate(2, 0, 0)

geometry.rotateX(Math.PI / 2)

geometry.scale(3, 3, 3)


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

const gui = new GUI()

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置背景贴图
  scene.background = envMap
  // 设置环境贴图
  scene.environment = envMap
  // 设置plane的环境贴图
  geoMaterial.envMap = envMap
})

// 创建法向量 辅助线
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'
const helper = new VertexNormalsHelper(geo, 1, 0xff0000)
scene.add(helper)

