import './style.css'
// App01-初试webgpu
import * as THREE from 'three'
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入webgpu渲染器
import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer.js";
// 判断webgpu是否可用
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";

// 判断webgpu是否可用
if (!WebGPU.isAvailable()) {
  alert("WebGPU is not available");
  throw new Error("WebGPU is not available");
}

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 2, 6);

// 创建渲染器
const renderer = new WebGPURenderer({
  antialias: true
})
// 设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 添加渲染器到dom
document.body.appendChild(renderer.domElement);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 创建立方体
const geometry = new THREE.BoxGeometry();
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 创建网格
const cube = new THREE.Mesh(geometry, material);

// 添加网格到场景
scene.add(cube);

// 渲染场景
function animate() {
  
  renderer.renderAsync(scene, camera);

  requestAnimationFrame(animate);
}
animate();