import * as THREE from "three";

import { Octree } from "three/examples/jsm/math/Octree.js";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Physics{
  // 动作混合器
  mixer = null;
  actions = {};
  // 激活的动作
  activeAction = null;
  prevAction = null;
  // 事件位置
  eventPositionList = []

  constructor(planeGroup, camera, scene) {

    this.worldOctree = new Octree();
    this.worldOctree.fromGraphNode(planeGroup)

    // 创建一个人的碰撞体
    this.playerCollider = new Capsule(
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(0, 1.35, 0),
      0.35
    );

    // 加载机器人模型
    const loader = new GLTFLoader();
    loader.load('/model/RobotExpressive.glb', gltf => {
      this.robot = gltf.scene;
      this.robot.scale.set(0.5, 0.5, 0.5);
      this.robot.position.set(0, -0.88, 0);
      this.capsule.add(this.robot)

      // 动作
      this.mixer = new THREE.AnimationMixer(this.robot);
      for (let i = 0; i < gltf.animations.length; i++) {
        let name = gltf.animations[i].name;
        this.actions[name] = this.mixer.clipAction(gltf.animations[i]);
        if (name == "Idle" || name == "Walking" || name == "Running") {
          this.actions[name].clampWhenFinished = false;
          this.actions[name].loop = THREE.LoopRepeat;
        } else {
          this.actions[name].clampWhenFinished = true;
          this.actions[name].loop = THREE.LoopOnce;
        }
      }
      this.activeAction = this.actions['Idle']
      this.activeAction.play();
    });

    this.capsule = new THREE.Object3D();
    this.capsule.position.set(0, 0.85, 0);

    // 将相机作为胶囊的子元素，就可以实现跟随
    this.backCamera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.001, 1000);
    camera.position.set(0, 2, -5);
    camera.lookAt(this.capsule.position);
    this.backCamera.position.set(0, 2, 5);
    this.backCamera.lookAt(this.capsule.position)

    // 控制旋转上下的空3d对象
    this.capsuleBodyControl = new THREE.Object3D();
    this.capsuleBodyControl.add(camera)
    this.capsuleBodyControl.add(this.backCamera)
    this.capsule.add(this.capsuleBodyControl)
    scene.add(this.capsule);


    // 设置重力
    this.gravity = -9.8;
    // 玩家的速度
    this.playerVelocity = new THREE.Vector3(0, 0, 0);
    // 方向向量
    this.playerDirection = new THREE.Vector3(0, 0, 0);
    // 键盘按下事件
    this.keyStates = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      Space: false,
      isDown: false,
    };
    // 玩家是否在地面上
    this.playerOnFloor = false;


    // 根据键盘按下的键来更新键盘的状态
    window.addEventListener('keydown', e => {
      this.keyStates[e.code] = true;
      this.keyStates.isDown = true;
    }, false);

    window.addEventListener('keyup', e => {
      this.keyStates[e.code] = false;
      this.keyStates.isDown = false;
      if (e.code === 'KeyV') {
        this.activeAction = this.activeAction === camera ? this.backCamera: camera;
      }
      if (e.code === "KeyT") {
        // 打招呼
        this.fadeToAction("Wave");
      }
    }, false);

    window.addEventListener('mousedown', () => {
      document.body.requestPointerLock()
    }, false);

    // 根据鼠标在屏幕移动，来旋转胶囊
    window.addEventListener('mousemove', e => {
      this.capsule.rotation.y -= e.movementX * 0.003;

      this.capsuleBodyControl.rotation.x += e.movementY * 0.003;
      if (this.capsuleBodyControl.rotation.x > Math.PI / 8) {
        this.capsuleBodyControl.rotation.x = Math.PI / 8;
      } else if (this.capsuleBodyControl.rotation.x < -Math.PI / 8) {
        this.capsuleBodyControl.rotation.x = -Math.PI / 8;
      }
    }, false);
  }

  update(delta) {
    this.controlPlayer(delta);
    this.updatePlayer(delta);
    this.resetPlayer();
    if (this.mixer) {
      this.mixer.update(delta);
    }
    this.emitPositionEvent();
  }


  controlPlayer(deltaTime) {
    if (this.keyStates["KeyW"]) {
      this.playerDirection.z = 1;
      //获取胶囊的正前面方向
      const capsuleFront = new THREE.Vector3(0, 0, 0)
      this.capsule.getWorldDirection(capsuleFront)
      if (this.playerVelocity.x * this.playerVelocity.x + this.playerVelocity.z * this.playerVelocity.z <= 200) {
        this.playerVelocity.add(capsuleFront.multiplyScalar(deltaTime * 5))
      }
    }
    if (this.keyStates["KeyS"]) {
      this.playerDirection.z = 1;
      //获取胶囊的正前面方向
      const capsuleFront = new THREE.Vector3(0, 0, 0);
      this.capsule.getWorldDirection(capsuleFront);
      // 计算玩家的速度
      this.playerVelocity.add(capsuleFront.multiplyScalar(-deltaTime));
    }
    if (this.keyStates["KeyA"]) {
      this.playerDirection.x = 1;
      //获取胶囊的正前面方向
      const capsuleFront = new THREE.Vector3(0, 0, 0);
      this.capsule.getWorldDirection(capsuleFront);

      // 侧方的方向，正前面的方向和胶囊的正上方求叉积，求出侧方的方向
      capsuleFront.cross(this.capsule.up);
      // 计算玩家的速度
      this.playerVelocity.add(capsuleFront.multiplyScalar(-deltaTime));
    }
    if (this.keyStates["KeyD"]) {
      this.playerDirection.x = 1;
      //获取胶囊的正前面方向
      const capsuleFront = new THREE.Vector3(0, 0, 0);
      this.capsule.getWorldDirection(capsuleFront);

      // 侧方的方向，正前面的方向和胶囊的正上方求叉积，求出侧方的方向
      capsuleFront.cross(this.capsule.up);
      // 计算玩家的速度
      this.playerVelocity.add(capsuleFront.multiplyScalar(deltaTime));
    }
    if (this.keyStates["Space"]) {
      this.playerVelocity.y = 5;
    }
  }

  updatePlayer(deltaTime) {
    let damping = -0.25;

    if (this.playerOnFloor) {
      this.playerVelocity.y = 0;

      if (!this.keyStates.isDown) {
        this.playerVelocity.addScaledVector(this.playerVelocity, damping);
      }

    } else {
      this.playerVelocity.y += this.gravity * deltaTime;
    }
    // this.playerVelocity.y = 0;
    // 计算玩家移动距离
    const playerMoveDistance = this.playerVelocity
      .clone()
      .multiplyScalar(deltaTime);
    this.playerCollider.translate(playerMoveDistance);
    // 将胶囊的位置进行设置
    // 给this.capsule.position设置this.playerCollider的位置
    this.playerCollider.getCenter(this.capsule.position);


    // 碰撞检测
    // 1.人物碰撞检测
    const result = this.worldOctree.capsuleIntersect(this.playerCollider);
    this.playerOnFloor = false;
    if (result) {
      // console.log(result.normal, 'result.normal', result.depth)
      this.playerOnFloor = result.normal.y > 0;
      this.playerCollider.translate(result.normal.multiplyScalar(result.depth > 0.1 ? result.depth : 0));
    }


    // 如果有水平的运动，则设置运动的动作
    if (
      Math.abs(this.playerVelocity.x) + Math.abs(this.playerVelocity.z) > 0.1 &&
      Math.abs(this.playerVelocity.x) + Math.abs(this.playerVelocity.z) <= 3
    ) {
      this.fadeToAction("Walking");
    } else if (
      Math.abs(this.playerVelocity.x) + Math.abs(this.playerVelocity.z) >
      3
    ) {
      this.fadeToAction("Running");
    } else {
      this.fadeToAction("Idle");
    }
  }

  resetPlayer() {
    if (this.capsule.position.y < -20) {
      this.playerCollider.start.set(0, 2.35, 0);
      this.playerCollider.end.set(0, 3.35, 0);
      this.playerCollider.radius = 0.35;
      this.playerVelocity.set(0, 0, 0);
      this.playerDirection.set(0, 0, 0);
    }
  }

  fadeToAction(actionName) {
    this.prevAction = this.activeAction;
    this.activeAction = this.actions[actionName];
    if (this.prevAction != this.activeAction) {
      this.prevAction.fadeOut(0.3);
      this.activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(0.3)
        .play();
      
      this.mixer.addEventListener('finished', e => {
        this.prevAction = this.activeAction;
        this.activeAction = this.actions["Idle"];
        this.prevAction.fadeOut(0.3)
        this.activeAction
          .reset()
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(1)
          .fadeIn(0.3)
          .play();
      })
    }
  }


  onPosition(position, callback, outCallback, radius = 2) {
    position = position.clone();
    this.eventPositionList.push({
      position,
      callback,
      outCallback,
      isInner: false,
      radius
    })
  }

  emitPositionEvent() {
    this.eventPositionList.forEach(item => {
      // 计算胶囊距离某个点的距离，是否触发事件
      const distanceToSquared = this.capsule.position.distanceToSquared(item.position);
      // 在圈内
      if (distanceToSquared < item.radius * item.radius && !item.isInner) {
        item.isInner = true
        item.callback && item.callback(item)
      }
      // 在圈外
      if (distanceToSquared >= item.radius * item.radius && item.isInner) {
        item.isInner = false
        item.outCallback && item.outCallback(item)
      }
    })
  }
}