import * as THREE from "three";
import gsap from "gsap";

function modifyCityMaterial(mesh) {
  mesh.material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
        #include <dithering_fragment>
        //#~_~#!
      `
    )
    addGradColor(shader, mesh)
    addSpread(shader);
    addLightLine(shader);
    addToTopLine(shader);
    // console.log(shader.vertexShader);
    // console.log(shader.fragmentShader);
  }
}

export default modifyCityMaterial;


function addGradColor(shader, mesh) {
  mesh.geometry.computeBoundingBox();

  let { min, max } = mesh.geometry.boundingBox;
  
  // 获取物体的高度差
  let uHeight = max.y - min.y;

  shader.uniforms.uTopColor = {
    value: new THREE.Color('#aaaeff')
  }
  shader.uniforms.uHeight = {
    value: uHeight
  }

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>
      varying vec3 vPosition;
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>
      vPosition = position;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform vec3 uTopColor;
      uniform float uHeight;
      varying vec3 vPosition;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#~_~#!',
    `
      // 在着色器编程中，mix() 函数通常用于执行线性插值。它接受三个参数：
      // 第一个参数：表示插值的起点。
      // 第二个参数：表示插值的终点。
      // 第三个参数：表示插值的比例因子，通常在 0 到 1 之间，决定了起点和终点之间的权重关系。当参数为 0 时，结果等于第一个参数；当参数为 1 时，结果等于第二个参数。

      vec4 distGradColor = gl_FragColor;
      // 设置混合的百分比
      float gradMix = (vPosition.y + uHeight/2.0) / uHeight;
      // 计算出混合颜色
      vec3 gradMixColor = mix(distGradColor.xyz, uTopColor, gradMix);
      gl_FragColor = vec4(gradMixColor, 1);

      //#~_~#!
    `
  );

}

// 添加建筑材质光波扩散特效
function addSpread(shader, center = new THREE.Vector2(0, 0)) {
  // 设置扩散的中心点
  shader.uniforms.uSpreadCenter = { value: center }
  // 设置扩散的时间
  shader.uniforms.uSpreadTime = { value: -2000 }
  // 设置条带的宽度
  shader.uniforms.uSpreadWidth = { value: 400 }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform vec2 uSpreadCenter;
      uniform float uSpreadTime;
      uniform float uSpreadWidth;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#~_~#!',
    `
      float spreadRadius = distance(vPosition.xz, uSpreadCenter);
      // 扩散范围的函数
      float spreadIndex = -(spreadRadius - uSpreadTime) * (spreadRadius - uSpreadTime) + uSpreadWidth;
      if (spreadIndex > 0.0) {
        gl_FragColor = mix(gl_FragColor, vec4(1, 1, 1, 1), spreadIndex / uSpreadWidth);
      }

      //#~_~#!
    `
  );

  gsap.to(shader.uniforms.uSpreadTime, {
    value: 800, 
    duration: 3,
    ease: 'none',
    repeat: -1,
  })
}

function addLightLine(shader) {
  // 扩散的时间
  shader.uniforms.uLightLineTime = { value: -1500 }
  // 设置条带的宽度
  shader.uniforms.uLightLineWidth = { value: 200 }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform float uLightLineTime;
      uniform float uLightLineWidth;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#~_~#!',
    `
      float LightLineMix = - (vPosition.x+vPosition.z-uLightLineTime) * (vPosition.x+vPosition.z-uLightLineTime) + uLightLineWidth;
      if (LightLineMix > 0.0) {
        gl_FragColor = mix(gl_FragColor, vec4(0.8, 1.0, 1.0, 0.1), LightLineMix / uLightLineWidth);
      }

      //#~_~#!
    `
  );

  gsap.to(shader.uniforms.uLightLineTime, {
    value: 1500,
    duration: 5,
    ease: 'none',
    repeat: -1
  })
}

function addToTopLine(shader) {
  // 扩散的时间
  shader.uniforms.uToTopTime = { value: 20 }
  // 设置条带的宽度
  shader.uniforms.uToTopWidth = { value: 40 }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform float uToTopTime;
      uniform float uToTopWidth;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#~_~#!',
    `
      float toTopMix = - (vPosition.y - uToTopTime) * (vPosition.y - uToTopTime) + uToTopWidth;
      if (toTopMix > 0.0) {
        gl_FragColor = mix(gl_FragColor, vec4(0.8, 0.8, 1, 1), toTopMix / uToTopWidth);
      }
      
      //#~_~#!
    `
  );

  gsap.to(shader.uniforms.uToTopTime, {
    value: 300,
    duration: 10,
    ease: 'none',
    repeat: -1
  })
}