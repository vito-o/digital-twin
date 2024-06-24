import '../style.css'
// 线框几何体

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


const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader() 
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

/* gltfLoader.load('/model/city.glb', gltf => {

  let buildMesh = gltf.scene.getObjectByName('Plane045')
  // scene.add(buildMesh)
  let geometry = buildMesh.geometry;

  // // 方法一：
  // // 创建EdgedsGeometry （获取边缘geometry）
  // let edgesGeometry = new THREE.EdgesGeometry(geometry)
  // // 创建LineSegments并设置材质 (线段)
  // let edges = new THREE.LineSegments(
  //   edgesGeometry, 
  //   new THREE.LineBasicMaterial({color: 0xffff00})
  // )
  
  // 方法二：
  // 线框geometry
  let edgesGeometry = new THREE.WireframeGeometry(geometry)
  let edges = new THREE.LineSegments(
    edgesGeometry, 
    new THREE.LineBasicMaterial({color: 0xffff00})
  )

  // 将线段模型 将 模型包裹起来
  // 更新建筑物世界转换矩阵
  buildMesh.updateWorldMatrix(true, true)
  edges.matrix.copy(buildMesh.matrixWorld)
  // 将矩阵信息，解构到edges.position, edges.quaternion, edges.scale 这些属性上
  edges.matrix.decompose(edges.position, edges.quaternion, edges.scale)

  scene.add(edges)
}) */

gltfLoader.load('/model/city.glb', gltf => {

  gltf.scene.traverse(child => {
    if (!child.isMesh) return;

    let geometry = child.geometry;
  
    // 创建EdgedsGeometry （获取边缘geometry）
    let edgesGeometry = new THREE.EdgesGeometry(geometry)
    // 创建LineSegments并设置材质 (线段)
    let edges = new THREE.LineSegments(
      edgesGeometry, 
      new THREE.LineBasicMaterial({color: 0xffff00})
    )
    
    // 将线段模型 将 模型包裹起来
    // 更新建筑物世界转换矩阵
    child.updateWorldMatrix(true, true)
    edges.matrix.copy(child.matrixWorld)
    // 将矩阵信息，解构到edges.position, edges.quaternion, edges.scale 这些属性上
    edges.matrix.decompose(edges.position, edges.quaternion, edges.scale)
  
    scene.add(edges)
  })
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
})

