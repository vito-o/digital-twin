<script setup>
import { onMounted } from 'vue'
// App02控制相机上下跟随人物
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Octree } from "three/examples/jsm/math/Octree.js";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88ccee)
scene.fog = new THREE.Fog(0x88ccee, 0, 50)

const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.001, 1000)
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping

const stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";


// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true
plane.rotation.x = - Math.PI / 2;

// 创建立方体叠楼梯的效果
for (let i = 0; i < 10; i++) {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 0.15)
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const box = new THREE.Mesh(boxGeometry, boxMaterial)
  box.position.y = 0.15 + i * 0.15
  box.position.z = i * 0.3;
  plane.add(box)
}

const group = new THREE.Group()
group.add(plane)
scene.add(group)

// 创建一个octree
const worldOctree = new Octree();
worldOctree.fromGraphNode(group)

// 创建一个octreeHelper
const octreeHelper = new OctreeHelper(worldOctree)
scene.add(octreeHelper)

// 创建一个人的碰撞体
const playerCollider = new Capsule(
  new THREE.Vector3(0, 0.35, 0),
  new THREE.Vector3(0, 1.35, 0),
  0.35
)


// 创建一个胶囊物体
const capsuleGeometry = new THREE.CapsuleGeometry(0.35, 1, 32)
const capsuleMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide
})
const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
capsule.position.set(0, 0.85, 0)

// 创建一个平面（胶囊胳膊）
const capsuleBodyGeometry = new THREE.PlaneGeometry(1, 0.5, 1, 1)
const capsuleBodyMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide
})
const capsuleBody = new THREE.Mesh(capsuleBodyGeometry, capsuleBodyMaterial)
capsuleBody.position.set(0, 0.5, 0)
capsule.add(capsuleBody)

// 将相机作为胶囊的子元素，就可以实现跟随
camera.position.set(0, 2, -5);
camera.lookAt(capsule.position);

// 控制旋转上下的空3d对象
const capsuleBodyControl = new THREE.Object3D();
capsuleBodyControl.add(camera)
capsule.add(capsuleBodyControl)

// capsule.add(camera);
scene.add(capsule)


// 设置重力
const gravity = - 9.8
// 玩家速度
const playerVelocity = new THREE.Vector3(0, 0, 0)
// 方向向量
// const playerDirection = new THREE.Vector3(0, 0, 0)
// 键盘按下事件
const keyStates = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  Space: false,
  isDown: false,
}
// 玩家是否在地面上
let playerOnFloor = false;

// 根据键盘状态更新玩家的速度
function controlPlayer(deltaTime) {
  if (keyStates['KeyW']) {
    // playerDirection.z = 1;
    // 获取胶囊的正前面方向
    const capsuleFront = new THREE.Vector3(0, 0, 0);
    capsule.getWorldDirection(capsuleFront)
    // 计算玩家的速度
    playerVelocity.add(capsuleFront.multiplyScalar(deltaTime))
  }

  if (keyStates['KeyS']) {
    // playerDirection.z = 1;
    // 获取胶囊得正前面方向
    const capsuleFront = new THREE.Vector3(0, 0, 0)
    capsule.getWorldDirection(capsuleFront)
    // 计算玩家得速度
    playerVelocity.add(capsuleFront.multiplyScalar(-deltaTime))
  }

  if (keyStates['KeyA']) {
    // playerDirection.x = 1;
    // 获取胶囊得正前面方向
    const capsuleFront = new THREE.Vector3(0, 0, 0)
    capsule.getWorldDirection(capsuleFront)
    // 侧方的方向，正前面的方向和胶囊的正上方球叉积，求出侧方的方向
    // a 和 b，叉积 a×b 的结果是一个垂直于 a 和 b 所在平面的向量。
    capsuleFront.cross(capsule.up)
    // 计算玩家的速度
    playerVelocity.add(capsuleFront.multiplyScalar(-deltaTime))
  }

  if (keyStates['KeyD']) {
    // playerDirection.x = 1;
    // 获取胶囊得正前面方向
    const capsuleFront = new THREE.Vector3(0, 0, 0)
    capsule.getWorldDirection(capsuleFront)
    // 侧方的方向，正前面的方向和胶囊的正上方球叉积，求出侧方的方向
    // a 和 b，叉积 a×b 的结果是一个垂直于 a 和 b 所在平面的向量。
    capsuleFront.cross(capsule.up)
    // 计算玩家的速度
    playerVelocity.add(capsuleFront.multiplyScalar(deltaTime))
  }


  if (keyStates["Space"]) {
    playerVelocity.y = 5;
  }
}

// 根据键盘按下的键来更新键盘的状态
window.addEventListener('keydown', e => {
  keyStates[e.code] = true
  keyStates.isDown = true
}, false)
window.addEventListener('keyup', e => {
  keyStates[e.code] = false
  keyStates.isDown = false
}, false)

// 根据鼠标在屏幕移动，来旋转胶囊
window.addEventListener('mousemove', e => {
  // 胶囊 mesh旋转
  capsule.rotation.y -= e.movementX * 0.003
  capsuleBodyControl.rotation.x += e.movementY * 0.003
}, false)

window.addEventListener('mousedown', () => {
  // 锁定鼠标指针
  document.body.requestPointerLock();
}, false)

function updatePlayer(deltaTime) {
  let damping = -0.05; //添加阻力，使得不按键时，物体能够停下来
  if (playerOnFloor) {
    playerVelocity.y = 0
    keyStates.isDown || playerVelocity.addScaledVector(playerVelocity, damping)
  } else {
    playerVelocity.y += gravity * deltaTime
  }

  // 计算玩家移动的距离
  const playerMoveDistance = playerVelocity.clone().multiplyScalar(deltaTime)
  playerCollider.translate(playerMoveDistance)
  // 给胶囊mesh的位置进行设置
  playerCollider.getCenter(capsule.position)

  // 进行碰撞检测
  playerCollisions();
}

function playerCollisions() {
  // 人物碰撞监测
  const result = worldOctree.capsuleIntersect(playerCollider)

  playerOnFloor = false
  if (result) {
    playerOnFloor = result.normal.y > 0 // y是高度
    playerCollider.translate(result.normal.multiplyScalar(result.depth));
  }
}

function resetPlayer() {
  if (capsule.position.y < -10) {
    playerCollider.start.set(0, 2.35, 0)
    playerCollider.end.set(0, 3.35, 0)
    playerCollider.radius = 0.35
    playerVelocity.set(0, 0, 0)
    // playerDirection.set(0, 0, 0)
  }
}

// ------------------------------------------------------------------------
// Lod 多层次细节展示
// 距离远时，以顶点比较少的模型方式进行展示，距离近时以顶点细节比较多的模型进行展示
const material = new THREE.MeshBasicMaterial({ 
  color: 0xff0000,
  wireframe: true
})
const lod = new THREE.LOD();
for (let i = 0; i < 5; i++) {
  const geometry = new THREE.SphereGeometry(1, 22 - i * 5, 22 - i * 5)
  const mesh = new THREE.Mesh(geometry, material)
  lod.addLevel(mesh, i * 5)
}
lod.position.set(10, 0, 10)
scene.add(lod)
// ------------------------------------------------------------------------


const clock = new THREE.Clock();
const animate = () => {
  let delta = clock.getDelta();

  // controls.update()
  controlPlayer(delta);

  updatePlayer(delta);

  resetPlayer();
 
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}


onMounted(() => {
  const container = document.getElementById('container')

  container.appendChild(renderer.domElement)

  container.appendChild(stats.domElement);

  animate()
})

window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setPixelRatio(window.devicePixelRatio)
  // 设置渲染器的像素比
  renderer.setSize(window.innerWidth, window.innerHeight)
})
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
}
</style>
