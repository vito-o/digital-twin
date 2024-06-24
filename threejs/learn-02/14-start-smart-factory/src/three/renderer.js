import * as THREE from "three";
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'

// 初始化渲染器
export const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
  // 两个物体相互重叠（比如地面和公路）时，threejs不知道要选中他们中的哪一个，会出现闪烁现象，设置该参数能处理该问题
  logarithmicDepthBuffer: true,
  physicallyCorrectLights: true
});
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.8 //设置明暗


export const css3dRenderer = new CSS3DRenderer()
css3dRenderer.setSize( window.innerWidth, window.innerHeight );

// export default { renderer, css3dRenderer };
