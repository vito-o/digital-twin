import * as THREE from "three";
import SpriteText from "../SpriteText.js";
import gsap from "gsap";

let dataExamples = [
  {
    value: 3.5,
    name: "第一季度",
  },
  {
    value: 2.7,
    name: "第二季度",
  },
  {
    value: 3.0,
    name: "第三季度",
  },
  {
    value: 2.5,
    name: "第四季度",
  },
];

export default class Pie3d {
  constructor(data, camera) {
    data = data || dataExamples

    this.mesh = new THREE.Group()
    
    this.sum = 0;
    data.forEach((item, i) => {
      this.sum += item.value
    });

    let sumRotation = 0;
    data.forEach((item, i) => {
      let rotation = (item.value / this.sum) * 2 * Math.PI;

      const shape = new THREE.Shape();
      shape.moveTo(0, 0)

      let rad = 0;
      while(rad < rotation) {
        shape.lineTo(3 * Math.cos(rad), 3 * Math.sin(rad));
        rad += 0.05;
      }
      shape.lineTo(3 * Math.cos(rotation), 3 * Math.sin(rotation));
      shape.lineTo(0, 0);

      const extrudeSettings = {
        steps: 1,
        depth: (item.value / this.sum) * 5,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 5,
      };
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      let color = new THREE.Color(Math.random() * 0xffffff);
      const material = new THREE.MeshStandardMaterial({
        color,
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true
      });

      const cylinder = new THREE.Mesh(geometry, material)
      cylinder.rotation.z = sumRotation
      this.mesh.add(cylinder)

      sumRotation += rotation;

      //   添加字体精灵
      let textPosition = new THREE.Vector3(
        Math.sin(rotation) * 1.5,
        Math.cos(rotation) * 1.5,
        item.value / 2 + 0.5
      );
      let spriteText = new SpriteText(item.name, textPosition);
      cylinder.add(spriteText.mesh);
    });

    this.mesh.rotation.x = -Math.PI / 2;
    this.addMouseMove();
    this.camera = camera;
  }

  addMouseMove() {
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2(1, 1)
    this.timeline = gsap.timeline()
    this.currentPie = null;

    window.addEventListener('mousemove', e => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -((e.clientY / window.innerHeight) * 2) + 1;
    })
  }

  update() {
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const intersects = this.raycaster.intersectObjects(this.mesh.children, false)

    if (intersects.length && !this.currentPie && !this.timeline.isActive()) {
      this.currentPie = intersects[0].object;
      this.timeline.to(this.currentPie.position, {
        x: 1 * Math.cos(this.currentPie.rotation.z),
        y: 1 * Math.sin(this.currentPie.rotation.z),
        duration: 0.5,
      })
    }

    // 如果鼠标从当前的扇形移动到另外一个扇形，那么就将之前的扇形移动回来，将当前的扇形根据当前的角度移动
    if (intersects.length && this.currentPie && this.currentPie != intersects[0].object && !this.timeline.isActive()) {
      this.timeline.to(this.currentPie.position, {
        x: 0,
        y: 0,
        duration: 0.1
      })
      this.currentPie = intersects[0].object
      this.timeline.to(this.currentPie.position, {
        x: 1 * Math.cos(this.currentPie.rotation.z),
        y: 1 * Math.sin(this.currentPie.rotation.z),
        duration: 0.5,
      })
    }

    // 当判断鼠标移出时，将currentPie置为null，恢复原点的位置
    if (intersects.length == 0 && this.currentPie && !this.timeline.isActive()) {
      this.timeline.to(this.currentPie.position, {
        x: 0,
        y: 0,
        duration: 0.5,
        onComplete: () => {
          this.currentPie = null;
        }
      })
    }
  }
}