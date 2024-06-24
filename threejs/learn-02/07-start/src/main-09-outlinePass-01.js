import '../style.css'
//效果合成器 - 使用 OutlinePass 渲染物体的外轮廓
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 导入后期效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

// 导入渲染通道
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

import gsap from 'gsap'

// 场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  90,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  1000  // 远平面
)
// 设置相机位置
camera.position.set(0, 0, 20)

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ------------------------------------
// 重置相机宽高比
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
// 重置渲染器宽高比
renderer.setSize(window.innerWidth, window.innerHeight)
// ------------------------------------

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true



// 创建一个金属球添加到场景中
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material1 = new THREE.MeshBasicMaterial({
  color: "#ffaa33",
});
const sphere = new THREE.Mesh(geometry, material1);
sphere.position.set(-5, 0, 0);
// sphere.layers.set(1);
scene.add(sphere);

// 创建一个正方体
const geometry2 = new THREE.BoxGeometry(1, 1, 1);
const material2 = new THREE.MeshStandardMaterial({
  emissive: 0x33ff33,
});
const cube = new THREE.Mesh(geometry2, material2);
cube.position.set(5, 0, 0);
scene.add(cube);

// 创建一个纽结体
const geometry3 = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material3 = new THREE.MeshStandardMaterial({
  emissive: 0x33ff33,
});
const torusKnot = new THREE.Mesh(geometry3, material3);
torusKnot.position.set(0, 0, 0);
scene.add(torusKnot);



const composer = new EffectComposer(renderer)
composer.setSize(window.innerWidth, window.innerHeight)

const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
)
outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 2;
outlinePass.edgeThickness = 3;
outlinePass.pulsePeriod = 2;
outlinePass.selectedObjects = [torusKnot]
composer.addPass(outlinePass)

window.addEventListener('click', () => {
  outlinePass.selectedObjects = [cube]
})


function animate() {
  controls.update()

  requestAnimationFrame(animate)
  // 渲染
  // renderer.render(scene, camera)
  composer.render()
  // effectComposer.render()
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