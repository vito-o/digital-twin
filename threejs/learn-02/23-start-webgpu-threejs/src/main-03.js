import './style.css'
// 初级材质节点
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

// 加载纹理
const loader = new THREE.TextureLoader();
// 加载纹理图片
const textureEnv = loader.load("/textures/hdr/012.jpg");
// textureEnv.mapping = THREE.EquirectangularReflectionMapping
// scene.background = textureEnv
// scene.environment = textureEnv

// 设置纹理y轴颠倒
textureEnv.flipY = false
// 设置纹理环境映射
scene.backgroundNode = texture(textureEnv, equirectUV(), 0)


// 加载纹理图片
let uvTexture = loader.load("/textures/uv_grid_opengl.jpg");
let opacityTexture = loader.load("/textures/alphaMap.jpg");
uvTexture.flipY = false
opacityTexture.flipY = false
// 设置纹理重复
uvTexture.wrapS = uvTexture.wrapT = THREE.RepeatWrapping
opacityTexture.wrapS = opacityTexture.wrapT = THREE.RepeatWrapping

// 创建一个基础材质节点
const materialNode = new Nodes.MeshBasicNodeMaterial()

// 设置材质节点的颜色,使用物体局部坐标系的x,y,z作为颜色
// materialNode.colorNode = Nodes.positionLocal

// 设置材质节点颜色为物体法向
// materialNode.colorNode = Nodes.normalLocal

// 设置材质节点颜色为世界法向
// materialNode.colorNode = Nodes.normalWorld

// 设置材质节点颜色为视图法向
// materialNode.colorNode = Nodes.normalView;

// 设置材质节点颜色为uv纹理图片
// materialNode.colorNode = Nodes.texture(uvTexture, Nodes.uv())

// 设置材质节点的透明度
// 设置颜色
materialNode.colorNode = Nodes.color(0x0099ff);
// materialNode.opacityNode = Nodes.float(0.5)
materialNode.opacityNode = Nodes.texture(opacityTexture, Nodes.uv())
materialNode.transparent = true
// 设置透明度检测，当大于0.5时，显示，小于0.5时，不显示
materialNode.alphaTestNode = 0.5

cube.material = materialNode


// 渲染场景
function animate() {

  renderer.renderAsync(scene, camera);

  requestAnimationFrame(animate);
}
animate();