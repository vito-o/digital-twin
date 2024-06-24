import '../style.css'
//材质混合模式详解

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
  // plane.material.map = envMap
  plane.material.needsUpdate = true
})

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(5, 5)
const planeMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('/texture/sprite0.png'),
  side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.visible = false;
plane.renderOrder = 0;
scene.add(plane);

// 设置深度模式
plane.material.depthFunc = THREE.LessEqualDepth;
plane.material.depthWrite = true;
plane.material.depthTest = true;

let material = plane.material;
// 在使用此材质显示对象时要使用何种混合。
// 必须将其设置为CustomBlending才能使用自定义blendSrc, blendDst 或者 [page:Constant blendEquation]。
material.blending = THREE.CustomBlending;
material.blendEquationAlpha = THREE.AddEquation;
material.blendSrcAlpha = THREE.OneFactor;
material.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
                            
// 设置混合方程式 最终颜色 = 源颜色 * 源因子 + 目标颜色 * 目标因子

// gui
gui
  .add(material, "blending", {
    NoBlending: THREE.NoBlending,
    NormalBlending: THREE.NormalBlending,
    AdditiveBlending: THREE.AdditiveBlending,
    SubtractiveBlending: THREE.SubtractiveBlending,
    MultiplyBlending: THREE.MultiplyBlending,
    CustomBlending: THREE.CustomBlending,
  })
  .name("blending");

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


