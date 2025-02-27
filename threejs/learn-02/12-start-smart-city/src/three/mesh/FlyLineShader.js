import * as THREE from "three";
import gsap from "gsap";
import vertex from "@/shader/flyLine/vertex.glsl?raw";
import fragment from "@/shader/flyLine/fragment.glsl?raw";

class FlyLineShader {
  constructor(
    position = { x: 10, z: 0 },
    color = 0x00ffff
  ) {
    // 根据点生成曲线
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(position.x / 2, 4, position.z / 2),
      new THREE.Vector3(position.x, 0, position.z),
    ]

    // 创建曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints)
    const points = this.lineCurve.getPoints(1000)

    // 创建几何顶点
    this.geometry = new THREE.BufferGeometry().setFromPoints(points)

    // 给每个顶点设置属性
    const aSizeArray = new Float32Array(points.length);
    for(let i = 0; i < aSizeArray.length; i++) {
      aSizeArray[i] = i;
    }
    // 设置几何体顶点属性
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(aSizeArray, 1))

    // 设置着色器从材质
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uColor: {
          value: new THREE.Vector3(color)
        },
        uLength: {
          value: points.length
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    this.mesh = new THREE.Points(this.geometry, this.material)

    gsap.to(this.material.uniforms.uTime, {
      value: 1000,
      duration: 2,
      repeat: -1,
      ease: "none",
    })
  }

  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }

}


export default FlyLineShader;