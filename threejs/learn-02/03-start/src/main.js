import '../style.css'

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

import { CSM } from 'three/addons/csm/CSM.js';
import { CSMHelper } from 'three/addons/csm/CSMHelper.js';

let csm, csmHelper;
const params = {
  orthographic: false,
  fade: false,
  shadows: true,
  far: 1000,
  mode: 'practical',
  lightX: - 1,
  lightY: - 1,
  lightZ: - 1,
  margin: 100,
  lightFar: 5000,
  lightNear: 1,
  autoUpdateHelper: true,
  updateHelper: function () {
    csmHelper.update();
  }
};

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
renderer.shadowMap.enabled = params.shadows;

// 设置相机位置
camera.position.z = 15
camera.position.y = 2.4
camera.position.x = 0.4
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

csm = new CSM({
  maxFar: params.far,
  cascades: 4,
  mode: params.mode,
  parent: scene,
  shadowMapSize: 1024,
  lightDirection: new THREE.Vector3(params.lightX, params.lightY, params.lightZ ).normalize(),
  camera: camera
});

csmHelper = new CSMHelper(csm);
csmHelper.visible = false;
scene.add(csmHelper);


const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
const material1 = new THREE.MeshPhysicalMaterial({color: 0xccccff})
const torusKnot = new THREE.Mesh(geometry, material1)
csm.setupMaterial( material1 );
torusKnot.position.set(4, 0, 0)
torusKnot.castShadow = true
torusKnot.receiveShadow = true
scene.add(torusKnot)


const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const material2 = new THREE.MeshPhysicalMaterial({color: 0xffffff})
const sphere = new THREE.Mesh(sphereGeometry, material2)
csm.setupMaterial( material2 );
sphere.castShadow = true
sphere.receiveShadow = true
scene.add(sphere)


const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const material3 = new THREE.MeshPhysicalMaterial({
  color: 0xffcccc,
  // alphaMap: new THREE.TextureLoader().load('/texture/16.jpg'),
  transparent: true,
  side: THREE.DoubleSide,
  alphaTest: 0.5,
})
const box = new THREE.Mesh(boxGeometry, material3)
csm.setupMaterial( material3 );
box.position.set(-4, 0, 0)
box.castShadow = true
box.receiveShadow = true
scene.add(box)

// create plane
let planeGeometry = new THREE.PlaneGeometry(24, 24, 1, 1)
let planeMaterial = new THREE.MeshPhysicalMaterial({color: 0x999999})
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
plane.position.set(0, -2, 0)
plane.receiveShadow = true
scene.add(plane)

// add ambient light
let ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)


// 添加平行光
let directionalLight = new THREE.DirectionalLight(0xffffff, 1.6)
directionalLight.position.set( params.lightX, params.lightY, params.lightZ ).normalize().multiplyScalar( - 200 );
scene.add(directionalLight)


// 平行光辅助器
let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)


// 相机辅助器
let cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(cameraHelper)

gui.add(csm, 'fade').onChange((val) => {
  csm.fade = val
  csm.updateFrustums()
})


let rgbeLoader = new RGBELoader()
rgbeLoader.load('/texture/Video_Copilot-Back Light_0007_4k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  // scene.environment = envMap
})

function animate() {
  controls.update()

  camera.updateMatrixWorld();
  csm.update();

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

  csm.updateFrustums();
})


