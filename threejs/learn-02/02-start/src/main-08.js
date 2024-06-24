import '../style.css'
//透明冰块_透明液体_透明杯子多个透明物体混和渲染

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

let rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  scene.environment = envMap
})


// .glb 模型是二进制的数据
// .gltf 模型是json格式的数据
const gltfLoader = new GLTFLoader()
gltfLoader.load('/model/cup.glb', gltf => {
  // console.log(gltf.scene)
  let cup = gltf.scene.getObjectByName('copo_low_01_vidro_0')
  let water = gltf.scene.getObjectByName('copo_low_02_agua_0')
  let ice = gltf.scene.getObjectByName('copo_low_04_vidro_0')

  ice.scale.set(0.86, 0.86, 0.86)
  water.position.z = -1
  ice.renderOrder = 1
  water.renderOrder = 2
  cup.renderOrder = 3

  // cup.visible = false
  // water.visible = false

  let iceMaterial = ice.material;
  ice.material = new THREE.MeshPhysicalMaterial({
    transparent: true,
    color: 0xffffff,
    transmission: .95,
    roughness: 0,
    thickness: 10,
    ior: 2,
    normalMap: iceMaterial.normalMap,
    metalnessMap: iceMaterial.metalnessMap
  })

  let waterMaterial = water.material;
  water.material = new THREE.MeshPhysicalMaterial({
    map: waterMaterial.map,
    normalMap: waterMaterial.normalMap,
    metalnessMap: waterMaterial.metalnessMap,
    roughnessMap: waterMaterial.roughnessMap,
    transparent: true,
    transmission: .95,
    roughness: 0.1,
    thickness: 10,
    ior: 2,
    blending: THREE.CustomBlending,
    blendDst: THREE.SrcColorFactor
  })

  let cupMaterial = cup.material
  cup.material = new THREE.MeshPhysicalMaterial({
    map: cupMaterial.map,
    normalMap: cupMaterial.normalMap,
    metalnessMap: cupMaterial.metalnessMap,
    roughnessMap: cupMaterial.roughnessMap,
    transparent: true,
    transmission: .95,
    roughness: 0.1,
    thickness: 10,
    ior: 2,
    blending: THREE.CustomBlending,
    blendDst: THREE.DstColorFactor
  })

  scene.add(gltf.scene)

  let material = water.material

  gui
    .add(material, "blendEquation", {
      AddEquation: THREE.AddEquation,
      SubtractEquation: THREE.SubtractEquation,
      ReverseSubtractEquation: THREE.ReverseSubtractEquation,
      MinEquation: THREE.MinEquation,
      MaxEquation: THREE.MaxEquation,
    })
    .name("blendEquation");

  gui
    .add(material, "blendSrc", {
      ZeroFactor: THREE.ZeroFactor,
      OneFactor: THREE.OneFactor,
      SrcColorFactor: THREE.SrcColorFactor,
      OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
      SrcAlphaFactor: THREE.SrcAlphaFactor,
      OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
      DstAlphaFactor: THREE.DstAlphaFactor,
      OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
      DstColorFactor: THREE.DstColorFactor,
      OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
      SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
    })
    .name("blendSrc");
  gui
    .add(material, "blendDst", {
      ZeroFactor: THREE.ZeroFactor,
      OneFactor: THREE.OneFactor,
      SrcColorFactor: THREE.SrcColorFactor,
      OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
      SrcAlphaFactor: THREE.SrcAlphaFactor,
      OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
      DstAlphaFactor: THREE.DstAlphaFactor,
      OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
      DstColorFactor: THREE.DstColorFactor,
      OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
      // SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
    })
    .name("blendDst");

  gui
    .add(material, "blendEquationAlpha", {
      AddEquation: THREE.AddEquation,
      SubtractEquation: THREE.SubtractEquation,
      ReverseSubtractEquation: THREE.ReverseSubtractEquation,
      MinEquation: THREE.MinEquation,
      MaxEquation: THREE.MaxEquation,
    })
    .name("blendEquationAlpha");

  gui
    .add(material, "blendSrcAlpha", {
      ZeroFactor: THREE.ZeroFactor,
      OneFactor: THREE.OneFactor,
      SrcColorFactor: THREE.SrcColorFactor,
      OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
      SrcAlphaFactor: THREE.SrcAlphaFactor,
      OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
      DstAlphaFactor: THREE.DstAlphaFactor,
      OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
      DstColorFactor: THREE.DstColorFactor,
      OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
      SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
    })
    .name("blendSrcAlpha");
  gui.add(material, "blendDstAlpha", {
    ZeroFactor: THREE.ZeroFactor,
    OneFactor: THREE.OneFactor,
    SrcColorFactor: THREE.SrcColorFactor,
    OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
    SrcAlphaFactor: THREE.SrcAlphaFactor,
    OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
    DstAlphaFactor: THREE.DstAlphaFactor,
    OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
    DstColorFactor: THREE.DstColorFactor,
    OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
    // SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
  });
})


const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)



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


