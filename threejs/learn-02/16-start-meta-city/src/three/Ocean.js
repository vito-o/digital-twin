import * as THREE from "three";
import { Water } from 'three/examples/jsm/objects/Water2.js'

export default class Ocean {
  constructor(radius = 500) {
    this.waterGeometry = new THREE.CircleGeometry(radius, 128)
    this.water = new Water(this.waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0x08dbea,
      flowDirection: new THREE.Vector2(1, 1),
      scale: 100,
    })
    this.water.position.y = -5;
    this.water.rotation.x = -Math.PI / 2;
    this.mesh = this.water;
    this.water.renderOrder = -1;


    // 着色器修改水面颜色
    // console.log(this.water.material.fragmentShader);
    this.water.material.fragmentShader = 
      this.water.material.fragmentShader.replace(
        "gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );",
        `
          gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );

          gl_FragColor = mix(gl_FragColor, vec4(0.05, 0.3, 0.7, 1.0), vToEye.z*0.0005+0.5);
        `
      )
  }
}