import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

import CameraModule from "./camera";
import { renderer } from "./renderer";
import eventHub from "@/utils/eventHub";

import * as THREE from "three";
class ControlsModule {
  constructor() {
    this.setOrbitControls()

    eventHub.on('toggleControls', code => {
      this[`set${code}Controls`]()
    })
  }

  setOrbitControls() {
    // 初始化控制器
    this.controls = new OrbitControls(CameraModule.activeCamera, renderer.domElement);
    // 设置控制器阻尼
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = 0;

    // this.controls.target = new THREE.Vector3(-815, 145, 65)
  }

  setFlyControls() {
    this.controls = new FlyControls(CameraModule.activeCamera, renderer.domElement)
    this.controls.movementSpeed = 100
    this.controls.rollSpeed = Math.PI / 60
  }

  setFirstPersonControls() {
    this.controls = new FirstPersonControls(CameraModule.activeCamera, renderer.domElement)
    this.controls.movementSpeed = 100
    this.controls.rollSpeed = Math.PI / 60
  }

}

export default new ControlsModule()