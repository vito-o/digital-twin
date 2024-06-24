<script setup>
import { onMounted } from 'vue'
import * as THREE from "three";
// 程序化节点的使用
import { MeshPhysicalNodeMaterial, normalWorld, timerLocal, mx_noise_vec3, mx_worley_noise_vec3, mx_cell_noise_float, mx_fractal_noise_vec3 } from 'three/nodes';
import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js';
import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';

if ( WebGPU.isAvailable() === false && WebGL.isWebGL2Available() === false ) {

  document.body.appendChild( WebGPU.getErrorMessage() );

  throw new Error( 'No WebGPU or WebGL2 support' );
}

// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 5);
camera.lookAt(0, 0, -2);


// 渲染器
// let renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 2;
// document.body.appendChild(renderer.domElement);
let renderer = new WebGPURenderer( { antialias: true } );
// renderer.setAnimationLoop( animate );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
document.body.appendChild( renderer.domElement );


// 设置环境光
let ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);


const offsetNode = timerLocal();
const customUV = normalWorld.mul( 10 ).add( offsetNode );
let nodeMaterial = new MeshPhysicalNodeMaterial();
nodeMaterial.colorNode = mx_noise_vec3( customUV );

// 创建球体
let geometry = new THREE.SphereGeometry(0.5, 32, 32);
let sphere = new THREE.Mesh(geometry, nodeMaterial);
scene.add(sphere);

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 渲染
function animate() {
  // renderer.render(scene, camera);
  renderer.renderAsync(scene, camera);

  requestAnimationFrame(animate);
}

onMounted(() => {
  animate()
})
</script>

<template>
  <div></div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

canvas {
  width: 100vw;
  height: 100vh;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
