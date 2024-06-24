import './style.css'
// webgpu着色器节点函数编写
import * as THREE from 'three'
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入webgpu渲染器
import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer.js";
// 判断webgpu是否可用
import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";
// 加载程序化节点
import { texture, equirectUV } from "three/examples/jsm/nodes/Nodes.js";
// 导入程序化节点
import * as Nodes from "three/examples/jsm/nodes/Nodes.js";

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
// renderer.shadowMap.enabled = true
// 设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 添加渲染器到dom
document.body.appendChild(renderer.domElement);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 创建立方体
const geometry = new THREE.BoxGeometry();
// 创建材质
const material = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 });
// 创建网格
const cube = new THREE.Mesh(geometry, material);
cube.position.y = 1;
cube.castShadow = true;
cube.receiveShadow = true;
// 创建地面
const groundMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x999999,
});
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
groundMesh.castShadow = true;
scene.add(groundMesh);

// 添加平行光
const directionalLight = new THREE.DirectionalLight(0x8888ff, 2);
directionalLight.position.set(3, 20, 12);
directionalLight.castShadow = true;
directionalLight.shadow.bias = 0.0001;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// 平行光的阴影相机
directionalLight.shadow.camera.near = 8;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -17;
directionalLight.shadow.camera.right = 17;
directionalLight.shadow.camera.top = 17;
directionalLight.shadow.camera.bottom = -17;

// 聚光灯
const spotLight = new THREE.SpotLight(0xff8888, 200);
spotLight.castShadow = true
spotLight.angle = Math.PI / 5;
spotLight.penumbra = 0.3;
spotLight.position.set(8, 10, 5);
spotLight.castShadow = true;
spotLight.shadow.bias = 0.0001;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
scene.add(spotLight);

scene.add(directionalLight);

// 点光源
const pointLight = new THREE.PointLight(0x44ffff, 200, 400, 2);
pointLight.position.set(-5, 10, 5);
pointLight.castShadow = true;
pointLight.shadow.bias = 0.0001;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
scene.add(pointLight);

// 添加网格到场景
scene.add(cube);



// 渲染场景
function animate() {

  renderer.renderAsync(scene, camera);

  requestAnimationFrame(animate);
}
animate();