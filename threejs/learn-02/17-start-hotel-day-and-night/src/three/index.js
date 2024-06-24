import * as THREE from 'three'
import gsap from 'gsap';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// 导入后期效果合成器
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import Clouds, { CloudsPlus } from './Clouds'
import Ocean from './Ocean'
import Physics from "./Physics";
import VideoPlane from "./VideoPlane";
import LightCircle from "./LightCircle";
import CanvasPlane from "./CanvasPlane";
import TextVideo from "./TextVideo";
import FireSprite from "./FireSprite";
import SphereSky from "./SphereSky";

export default class ThreePlus {
  constructor(selector) {
    this.mixer = []
    this.actions = []
    this.textVideoArrays = []
    this.clock = new THREE.Clock();

    this.domElement = document.querySelector(selector)
    this.width = this.domElement.clientWidth;
    this.height = this.domElement.clientHeight;

    this.updateMeshArr = []
    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControl();
    // this.initAxesHelper();
    this.initEffect()
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.00001, 10000);
    // this.camera.position.set(0, 50, 320);
    this.camera.position.set(-117, 30, -300);
    this.camera.aspect = this.width / this.height;
    // this.camera.lookAt(new THREE.Vector3(0, 50, 0))
    // 更新摄像机的投影矩阵
    this.camera.updateProjectionMatrix();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.3;
    this.renderer.sortObjects = true;
    this.domElement.appendChild(this.renderer.domElement);
  }

  initControl() {
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.target = new THREE.Vector3(20, 40, 20)
  }

  initAxesHelper() {
    this.axesHelper = new THREE.AxesHelper(10);
    this.scene.add(this.axesHelper);
  }

  animate() {
    let deltaTime = this.clock.getDelta();

    this.control && this.control.update();

    /* if (this.physics) {
      this.physics.update(deltaTime);
    }

    if (this.textVideoArrays.length) {
      for(let o of this.textVideoArrays) {
        o.update(deltaTime)
      }
    }

    if (this.updateMeshArr.length) {
      for(let o of this.updateMeshArr) {
        o.update(deltaTime)
      }
    } */

    // this.renderer.render(this.scene, this.camera);
    this.effectComposer.render();

    requestAnimationFrame(this.animate.bind(this));
  }

  // ---------------------------------------------
  gltfLoader(url) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    // 设置draco路径
    dracoLoader.setDecoderPath('/draco/')
    // 设置gltf加载器draco解码器
    gltfLoader.setDRACOLoader(dracoLoader)

    return new Promise((resolve) => {
      gltfLoader.load(url, gltf => {
        resolve(gltf)
      })
    })
  }

  fbxLoader(url) {
    const fbxLoader = new FBXLoader();
    return new Promise((resolve, reject) => {
      fbxLoader.load(url, (fbx) => {
        resolve(fbx);
      });
    });
  }

  hdrLoader(url) {
    const hdrLoader = new RGBELoader();
    return new Promise((resolve, reject) => {
      hdrLoader.load(url, (hdr) => {
        resolve(hdr);
      });
    });
  }

  setBg(url) {
    return new Promise(resolve => {
      this.hdrLoader(url).then(texture => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        texture.anisotropy = 16;
        texture.format = THREE.RGBAFormat;
        this.scene.background = texture
        this.scene.environment = texture

        resolve(texture)
      })
    })
  }

  addClouds() {
    let clouds = new CloudsPlus();
    this.scene.add(clouds.mesh)
  }

  addOcean() {
    let ocean = new Ocean();
    this.scene.add(ocean.mesh)
  }

  addPhysics(planeGroup) {
    this.physics = new Physics(planeGroup, this.camera, this.scene)
    return this.physics;
  }

  addVideoPlane(url, size, position) {
    let videoPlane = new VideoPlane(url, size, position);
    this.scene.add(videoPlane.mesh)
    return videoPlane;
  }

  addLightCircle(position, scale) {
    let lightCircle = new LightCircle(this.scene, position, scale);
    // this.scene.add(lightCircle.mesh)
    return lightCircle;
  }

  addCanvasPlane(text, position, euler) {
    let canvasPlane = new CanvasPlane(this.scene, text, position, euler);
    return canvasPlane;
  }

  addTextVideo(url, position, euler) {
    let textVideo = new TextVideo(this.scene, url, position, euler);
    this.textVideoArrays.push(textVideo);
    return textVideo;
  }

  addFireSprite(position, scale) {
    let fireSprite = new FireSprite(this.camera, position, scale);
    this.scene.add(fireSprite.mesh);
    this.updateMeshArr.push(fireSprite);
    return fireSprite;
  }

  setLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    this.scene.add(this.ambientLight)

    const light1 = new THREE.DirectionalLight(0xffffff, 0.1)
    light1.position.set(0, 10, 10)

    const light2 = new THREE.DirectionalLight(0xffffff, 0.1)
    light2.position.set(0, 10, -10)

    const light3 = new THREE.DirectionalLight(0xffffff, 0.1) 
    light3.position.set(10, 10, 10)

    light1.castShadow = true
    light2.castShadow = true
    light3.castShadow = true
    light1.shadow.mapSize.width = 10240;
    light1.shadow.mapSize.height = 10240;
    light2.shadow.mapSize.width = 10240;
    light2.shadow.mapSize.height = 10240;
    light3.shadow.mapSize.width = 10240;
    light3.shadow.mapSize.height = 10240;
    this.scene.add(light1, light2, light3)
  }


  initEffect() {
    this.effectComposer = new EffectComposer(this.renderer)
    this.effectComposer.setSize(window.innerWidth, window.innerHeight);

    // 添加渲染通道
    const renderPass = new RenderPass(this.scene, this.camera)
    this.effectComposer.addPass(renderPass)

    // 发光效果
    this.unrealBloomPass = new UnrealBloomPass();
    this.unrealBloomPass.enabled = false;
    this.unrealBloomPass.threshold = 0.1;
    this.unrealBloomPass.strength = 0.3;
    this.unrealBloomPass.radius = 0.5;
    this.effectComposer.addPass(this.unrealBloomPass);
  }

  addSphereSky(dayCallback, nightCallback) {
    let uTime = {
      value: 0
    }

    this.sphereSky = new SphereSky(10000, uTime, this.scene.environment)
    this.scene.add(this.sphereSky.mesh, this.sphereSky.sun);

    this.isDay = true;
    gsap.to(uTime, {
      value: 24,
      duration: 24,
      repeat: -1,
      ease: 'linear',
      onUpdate: () => {
        // 08 ~ 16
        if (Math.abs(uTime.value - 12) < 4) {
          this.renderer.toneMappingExposure = 1;
        }
        // 18 ~ 06
        if (Math.abs(uTime.value - 12) > 6) {
          this.renderer.toneMappingExposure = 0.3;
        }

        // 06 ~ 08   16 ~ 18
        if (Math.abs(uTime.value - 12) >= 4 && Math.abs(uTime.value - 12) <= 6) {
          let strength = 1 - (Math.abs(uTime.value - 12) - 4) / 2;
          strength = strength < 0.3 ? 0.3 : strength;
          this.renderer.toneMappingExposure = strength;
        }

        // -----------------------------------------------
        this.sphereSky.updateSun(uTime.value);
        if (uTime.value > 6 && uTime.value <= 18 && !this.isDay) {
          this.sphereSky.sun.visible = true;
          this.isDay = true;
          dayCallback();
        }
        if ((uTime.value > 18 || uTime.value <= 6) && this.isDay) {
          this.sphereSky.sun.visible = false;
          this.isDay = false;
          nightCallback();
        }

      }
    })
  }

}