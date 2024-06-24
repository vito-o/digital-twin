import '../style.css'
// MeshPhysicalMaterial 

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
  //sword.gltf
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

let thicknessMap = new THREE.TextureLoader().load('/textures/diamond/diamond_emissive.png')

// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhysicalMaterial({
  transparent: true,
  // 透光率（或者说透光性），范围从0.0到1.0。默认值是0.0。
  transmission: .95,
  // 粗糙度, 0表示不粗糙，但是只有薄薄的一层纸，--立方体需要厚度
  roughness: 0.05,
  // 厚度
  thickness: 2,
  thicknessMap: thicknessMap,
  // 衰减颜色
  attenuationColor: new THREE.Color(0.6, 0, 0),
  // 衰减距离
  attenuationDistance: 1
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 衰减距离和厚度相互关联，比如衰减距离为10、厚度2的时候的效果和 衰减距离为0.5、厚度0.1的效果类似
gui.add(cube.material, "attenuationDistance", 0, 10).name('衰减距离')
gui.add(cube.material, "thickness", 0, 2).name('厚度')

// 为非金属材质所设置的折射率，范围由1.0到2.333。默认为1.5。
gui.add(cube.material, 'ior', 1, 2).name('折射率')
// 反射率，由0.0到1.0。默认为0.5, 相当于折射率1.5。
gui.add(cube.material, 'reflectivity', 0, 1).name('反射率')