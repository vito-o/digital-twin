<script setup>
import { onMounted, ref } from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import * as CANNON from "cannon-es";
import nipplejs from 'nipplejs'

import { PointerLockControlsCannon } from "./threeMesh/PointerLockControlsCannon.js";
// import { Reflector } from "./mesh/Reflector.js";
import { Reflector } from 'three/examples/jsm/objects/Reflector'
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture.js";

import { 
  MeshPhysicalNodeMaterial, normalWorld, timerLocal, mx_noise_vec3, mx_worley_noise_vec3, mx_cell_noise_float, mx_fractal_noise_vec3,
  color,
  normalMap,
  uv,
  texture,
  float,
} from 'three/nodes';
import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js';
import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';


let screenDom = ref(null)

// 场景
const scene = new THREE.Scene()

// 照相机
const camera = new THREE.PerspectiveCamera(
  45,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  10000  // 远平面
)
camera.position.set(0, 2, 8)
camera.lookAt(0, 0, -2)

let renderer = new WebGPURenderer( { antialias: true } );
// 渲染器
// const renderer = new THREE.WebGLRenderer({antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.body.appendChild(renderer.domElement)

// 坐标助手 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

// 控制器
let controls;
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true // 设置带阻尼惯性

// 渲染
let clock = new THREE.Clock()
function animate() {
  let delta = clock.getDelta()

  world.step(1 / 60, delta, 3)
  sphereMesh.position.copy(sphereBody.position)

  if (robot) robot.quaternion.copy(controls.getObject().quaternion)
  if (controls) controls.update(delta)

  requestAnimationFrame(animate)
  renderer.renderAsync(scene, camera)
}

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix()
})

let gltfLoader = new GLTFLoader();
let dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
gltfLoader.setDRACOLoader(dracoLoader);


// 加载纹理
const textureLoader = new THREE.TextureLoader();
// 加载环境纹理
let envMap = textureLoader.load('/textures/0006_4k.jpg')
envMap.mapping = THREE.EquirectangularReflectionMapping
scene.background = envMap
scene.environment = envMap

// 设置环境光
let ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight)


// 初始化cannon
let world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// 初始化物理材质
world.defaultContactMaterial.contactEquationStiffness = 1e9;
world.defaultContactMaterial.contactEquationRelaxation = 4;

// 创建了一个新的广义坐标求解器实例，用于解决物理仿真中约束力的计算问题
const solver = new CANNON.GSSolver()
// 设置求解器的迭代次数为7次，迭代次数决定了求解器在每个时间步长内为解决约束力问题进行计算的次数
// 更多的迭代次数通常会提高仿真的准确性，也会增加计算开销
solver.iterations = 7;
// 这行代码设置求解器的容差为0.1.容差决定了求解器停止迭代的条件。即当约束力计算的误差小于
// 该容差时，求解器会提前停止迭代。较小的容差值通常会提高仿真的准确性，但也会增加计算时间
solver.tolerance = 0.1;
world.solver = new CANNON.SplitSolver(solver);

// 创建物理材质
const physicsMaterial = new CANNON.Material('physics')
const physics_physics = new CANNON.ContactMaterial(
  physicsMaterial,
  physicsMaterial,
  {
    // 当摩擦力为0时，物体不会滑动
    friction: 0,
    // 弹性系数
    restitution: 0.3
  }
)
world.addContactMaterial(physics_physics)


// 创建一个球体
const radius = 0.8
const sphereShape = new CANNON.Sphere(radius)
const sphereBody = new CANNON.Body({
  mass: 5,
  material: physicsMaterial
})
sphereBody.addShape(sphereShape)
// 用于控制刚体在运动过程中受到的线性阻尼。这是一种模拟空气阻力或其他阻力的方式，使物体在运动时逐渐减速。
sphereBody.linearDamping = 0.9
sphereBody.position.set(0, 5, 0)
world.addBody(sphereBody)

// 创建一个threejs的球
const sphereGeometry = new THREE.SphereGeometry(radius, 8, 8)
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  wireframe: true,
})
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)
// 球里面添加模型
let robot;
gltfLoader.load('/model/robot.glb', gltf => {
  robot = gltf.scene;
  robot.children[0].position.set(0, -0.8, 0)
  robot.children[0].rotation.set(0, Math.PI, 0)
  // robot.add(camera)
  sphereMesh.add(robot)
})



// 创建一个平面
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({
  mass: 0,
  material: physicsMaterial
})
groundBody.addShape(groundShape)
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody)

gltfLoader.load("./model/roomModel/ground03.glb", (gltf) => {
  // 镜面反射的地面
  let mirrorGeometry = new THREE.PlaneGeometry(100, 100)
  let groundMirror = new Reflector(mirrorGeometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777,
  })
  groundMirror.position.y = 0.1
  groundMirror.rotateX(-Math.PI / 2)
  // scene.add(groundMirror)

  let model = gltf.scene;

  model.traverse(child => {
    if (child.isMesh && child.name == '平面') {
      let childMaterial = child.material;
      let nodeMaterial = new MeshPhysicalNodeMaterial()
      let groundTexture = new THREE.TextureLoader().load('/textures/001/Marble_White_006_basecolor.jpg')
      groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
      let groundUv = uv().mul(10)
      nodeMaterial.colorNode = texture(groundTexture, groundUv)
      nodeMaterial.normalNode = normalMap(mx_noise_vec3(groundUv))
      nodeMaterial.clearcoatNode = float(1)
      nodeMaterial.clearcoatRoughnessNode = float(0.01)
      nodeMaterial.roughnessNode = mx_noise_vec3(groundUv);
      child.material = nodeMaterial
    }
  })

  scene.add(model);
});

const initPointerLock = () => {
  controls = new PointerLockControlsCannon(camera, sphereBody);
  scene.add(controls.getObject())

  renderer.domElement.addEventListener('click', () => {
    controls.lock()
  })

  controls.addEventListener('lock', () => {
    console.log('lock')
    controls.enabled = true;
  })

  controls.addEventListener('unlock', () => {
    console.log('unlock')
    controls.enabled = false;
  })
}

const initNipple = () => {
  let manager = nipplejs.create({})

  let isMove = false;

  manager.on('start', (evt, data) => {
    isMove = true
    console.log('start')
  })

  manager.on('end', (evt, data) => {
    isMove = false
    console.log('end')
  })

  manager.on('move', (evt, data) => {
    if (isMove) {
      const vector = data.vector;
      const angle = data.angle.radian

      sphereBody.velocity.set(
        vector.x * 3 * data.force,
        sphereBody.velocity.y,
        -vector.y * 3 * data.force
      );
      let target = angle - Math.PI / 2;
      if (robot) {
        robot.rotation.y = robot.rotation.y + (target - robot.rotation.y) * 0.1 * data.force
      }
    }
  })
};


gltfLoader.load('/model/roomModel/collisions.glb', gltf => {
  let model = gltf.scene;

  model.traverse(child => {
    if (child.isMesh) {
      // let geometry = child.geometry;
      // let material = child.material
      // let mesh = new THREE.Mesh(geometry, material)
      // mesh.position.copy(child.position)
      // mesh.rotation.copy(child.rotation)
      // mesh.scale.copy(child.scale)
      // scene.add(mesh)

      let shape = new CANNON.Box(
        new CANNON.Vec3(child.scale.x, child.scale.y, child.scale.z)
      )
      let body = new CANNON.Body({
        mass: 0,
        material: physicsMaterial
      })
      body.addShape(shape)
      body.position.copy(child.position)
      body.quaternion.copy(child.quaternion)
      world.addBody(body)
    }
  })
})



onMounted(() => {

  animate()

  initPointerLock();

  // initNipple();

  gltfLoader.load('/model/roomModel/ground.glb', gltf => {
    // 珠光漆
    let flakesTexture = new FlakesTexture();
    let canvasTexture = new THREE.CanvasTexture(flakesTexture);
    canvasTexture.anisotropy = 16;
    canvasTexture.wrapS = THREE.RepeatWrapping;
    canvasTexture.wrapT = THREE.RepeatWrapping;

    let nodeMaterial = new MeshPhysicalNodeMaterial();
    nodeMaterial.colorNode = color(0xeeeeff);
    nodeMaterial.normalNode = normalMap(
      texture(canvasTexture, uv().mul(2.5, 1.5)),
      0.15
    );
    nodeMaterial.metalnessNode = float(0.9);
    nodeMaterial.roughnessNode = float(0.5);
    nodeMaterial.clearcoatNode = float(1);
    nodeMaterial.clearcoatRoughnessNode = float(0.01);

    let model = gltf.scene
    model.traverse(child => {
      if (child.isMesh) {
        child.material = nodeMaterial;
      }
    })
    scene.add(model)
  })

  let video = document.createElement("video");
  video.src = "./textures/DigitalTwin.mp4";
  video.loop = true;
  video.muted = true;
  video.play();
  let videoTexture = new THREE.VideoTexture(video);
  // 主舞台
  gltfLoader.load("./model/roomModel/stage.glb", (gltf) => {
    let model = gltf.scene;
    let carbonTexture = textureLoader.load("./textures/carbon/Carbon.png");
    carbonTexture.encoding = THREE.sRGBEncoding;
    carbonTexture.wrapS = THREE.RepeatWrapping;
    carbonTexture.wrapT = THREE.RepeatWrapping;
    let carbonNormal = textureLoader.load("./textures/carbon/Carbon_Normal.png");
    carbonNormal.wrapS = THREE.RepeatWrapping;
    carbonNormal.wrapT = THREE.RepeatWrapping;

    // let carbonUv = uv().mul(25).add(timerLocal());
    let carbonUv = uv().mul(10);
    let nodeMaterial = new MeshPhysicalNodeMaterial();
    nodeMaterial.colorNode = texture(carbonTexture, carbonUv);
    nodeMaterial.normalNode = normalMap(texture(carbonNormal, carbonUv));
    nodeMaterial.clearcoatNode = float(1);
    nodeMaterial.clearcoatRoughnessNode = float(0.01);
    nodeMaterial.roughnessNode = float(0.5);
    model.traverse((child) => {
      if (child.isMesh && child.material.name == "Material_579") {
        // 碳纤维材质
        child.material = nodeMaterial;
      }
      if (child.isMesh && child.material.name == "Material_593") {
        child.material.map = videoTexture;
        child.material.emssiveMap = videoTexture;
      }
    });
    scene.add(model);
  });


  // 展板
  gltfLoader.load("./model/roomModel/board.glb", (gltf) => {
    let model = gltf.scene;
    scene.add(model);
  });

  // 副舞台
  gltfLoader.load("./model/roomModel/stage02.glb", (gltf) => {
    let model = gltf.scene;
    scene.add(model);
  })

  // 添加灯光
  gltfLoader.load("./model/roomModel/light.glb", (gltf) => {
    let model = gltf.scene;
    model.traverse((child) => {
      child.intensity = 0.1;
    });
    scene.add(model);
  });
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
