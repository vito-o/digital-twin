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
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

import { ref } from 'vue'

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

// 加载全景图
let textureLoader = new THREE.TextureLoader()
let envMap = textureLoader.load('/texture/Scene_1108.jpg')
envMap.mapping = THREE.EquirectangularReflectionMapping
envMap.flipY = false
scene.background = envMap
scene.environment = envMap

// 创建天空的包围球
let sphere = new THREE.SphereGeometry(50, 64, 64)
sphere.scale(1, 1, -1)
envMap.flipY = true;
let skyboxMaterial = new THREE.MeshBasicMaterial({
  map: envMap
})
let skybox = new THREE.Mesh(sphere, skyboxMaterial)
scene.add(skybox)

// 加载地面材质纹理
let uvNode = Nodes.uv().mul(5)
let fabricTexture = textureLoader.load('/texture/fabric/FabricPlainWhiteBlackout009_COL_2K.jpg')
fabricTexture.wrapS = fabricTexture.wrapT = THREE.RepeatWrapping
// 加载地面法向贴图
let fabricNormalMap = textureLoader.load('/texture/fabric/FabricPlainWhiteBlackout009_COL_2K.jpg')
fabricNormalMap.wrapS = fabricNormalMap.wrapT = THREE.RepeatWrapping
// 加载地面高光贴图
let fabricSheen = textureLoader.load('/texture/fabric/FabricPlainWhiteBlackout009_COL_2K.jpg')
fabricSheen.wrapS = fabricSheen.wrapT = THREE.RepeatWrapping

// 创建地面
let planeGeometry = new THREE.CircleGeometry(40, 64);
let planeMaterial = new Nodes.MeshPhysicalNodeMaterial();
// 添加阴影贴图
let aoTexture = textureLoader.load('/texture/ferrari_ao.png')
planeMaterial.colorNode = Nodes.texture(fabricTexture, uvNode).mul(
  Nodes.texture(
    aoTexture,
    Nodes.uv().mul(Nodes.vec2(30, 14)).add(Nodes.vec2(-14.525, -6.52))
  )
);
planeMaterial.normalNode = Nodes.texture(fabricNormalMap, uvNode)
planeMaterial.sheenNode = Nodes.texture(fabricSheen, uvNode)

let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);


// 创建光源
// 添加聚光灯
let spotLight = new THREE.SpotLight(0xffffff, 100);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 8;
spotLight.penumbra = 0.3;
scene.add(spotLight);

// 添加点光源
let pointLight = new THREE.PointLight(0xff9999, 1);
pointLight.position.set(4, 4, 0);
scene.add(pointLight);

let pointLight2 = new THREE.PointLight(0x99ffff, 1);
pointLight2.position.set(-4, 4, 0);
scene.add(pointLight2);

let pointLight3 = new THREE.PointLight(0xff99ff, 1);
pointLight3.position.set(0, 4, 4);
scene.add(pointLight3);

let pointLight4 = new THREE.PointLight(0x00ffff, 1);
pointLight4.position.set(0, 4, -4);
scene.add(pointLight4);


let carMaterial = null;
// 加载模型
let loader = new GLTFLoader();
let leftDoor, rightDoor;
loader.load("./model/zeekr.glb", gltf => {
  let model = gltf.scene;

  model.traverse(child => {
    if (child.isMesh) {
      if (child.name === "车顶窗") {
        child.material.transparent = true;
      }
      if (child.name === "挡风玻璃") {
        child.material.transparent = true;
        child.material.opacity = 0.1;
        child.material.thickness = 2;
      }
      if (child.name === "后右车门窗") {
        child.material.color = new THREE.Color(0x333333);
        child.material.transparent = true;
        child.material.opacity = 0.8;
        child.material.thickness = 2;
      }
      if (child.name == "车灯罩") {
        child.material.transparent = true;
        child.material.opacity = 0.5;
        child.material.thickness = 2;
      }
      if (child.name == "机盖2") {
        child.material.color = new THREE.Color(0xffccff);
        child.material.roughness = 0.3;
        child.material.clearcoat = 1;
        child.material.clearcoatRoughness = 0;
        carMaterial = child.material;
      }
      if (child.material && child.material.name == "视频纹理") {
        video.addEventListener("loadeddata", function () {
          video.play();
          let videoTexture = new THREE.VideoTexture(video);
          child.material = new THREE.MeshPhongMaterial({
            map: videoTexture,
            emissiveMap: videoTexture,
          });
        });
      }
    }
    if (child.name === "前左车门p") {
      leftDoor = child;
    }
    if (child.name === "前右车门p") {
      rightDoor = child;
    }
  })

  scene.add(model);
})

// 监听交互事件
let timeline = gsap.timeline();
const enterCar = window.enterCar = (e) => {
  timeline.to(camera.position, {
    z: -0.1,
    x: 0.43,
    y: 1.24,
    duration: 1,
    ease: "power2.inOut",
  });
};

const outCar = window.outCar = () => {
  timeline.to(camera.position, {
    z: 6,
    x: 0,
    y: 2,
    duration: 1,
    ease: "power2.inOut",
  });
};

// 设置颜色选项
const colors = [
  {
    name: "红色",
    color: "rgb(255,0,0)",
  },
  {
    name: "蓝色",
    color: "rgb(0,0,255)",
  },
  {
    name: "紫色",
    color: "rgb(255,0,255)",
  },
  {
    name: "白色",
    color: "rgb(255,255,255)",
  },
];

const isColor = ref(false);
const toggleColor = window.toggleColor = () => {
  isColor.value = !isColor.value;
};

const changeColor = window.changeColor = (color) => {
  carMaterial.color = new THREE.Color(color);
};

// 开车门
let isOpen = false;
let timeline1 = gsap.timeline();
let timeline2 = gsap.timeline();
const openDoor = window.openDoor = () => {
  if (isOpen) {
    isOpen = false;
    timeline1.to(leftDoor.rotation, {
      y: 0,
      duration: 1,
      ease: "power2.inOut",
    });
    timeline2.to(rightDoor.rotation, {
      y: 0,
      duration: 1,
      ease: "power2.inOut",
    });
  } else {
    isOpen = true;
    timeline1.to(leftDoor.rotation, {
      y: -Math.PI / 4,
      duration: 1,
      ease: "power2.inOut",
    });
    timeline2.to(rightDoor.rotation, {
      y: Math.PI / 4,
      duration: 1,
      ease: "power2.inOut",
    });
  }
};

// 渲染场景
function animate() {

  renderer.renderAsync(scene, camera);

  requestAnimationFrame(animate);
}
animate();