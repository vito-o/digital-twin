import * as THREE from 'three'
import SpriteText from "../SpriteText.js";

let dataExamples = [
  {
    value: 2.5,
    name: "星期一",
    type: "亿台",
  },
  {
    value: 1.7,
    name: "星期二",
    type: "万台",
  },
  {
    value: 2.0,
    name: "星期三",
    type: "万台",
  },
  {
    value: 1.5,
    name: "星期四",
    type: "万台",
  },
  {
    value: 2.2,
    name: "星期五",
    type: "万台",
  },
  {
    value: 2.6,
    name: "星期六",
    type: "万台",
  },
  {
    value: 1.0,
    name: "星期日",
    type: "万台",
  },
];

export default class Polyline3d {
  constructor(data) {
    data = data || dataExamples

    this.mesh = new THREE.Group();
    
    let color = new THREE.Color(Math.random() * 0xffffff)
    const extrudeSettings = {
      steps: 1,
      depth: 0.5,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 5,
    };

    const shape = new THREE.Shape();
    shape.moveTo(0, 0)

    data.forEach((item, i) => {
      shape.lineTo(i, item.value)

      let textPosition = new THREE.Vector3(i, item.value + 0.5, 0)
      let spriteText = new SpriteText(
        '' + item.value + item.type,
        textPosition
      )
      this.mesh.add(spriteText.mesh)
    })
    shape.lineTo(data.length - 1, 0)
    shape.lineTo(0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      opacity: 0.8,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(-3, 0, 0)
    this.mesh.add(mesh)
  }
}