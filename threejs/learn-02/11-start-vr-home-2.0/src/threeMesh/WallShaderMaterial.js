import * as THREE from 'three'

export default function WallShaderMaterial(panorama) {
  let point = panorama.point[0]
  let panoramaTexture = new THREE.TextureLoader().load(point.panoramaUrl);
  panoramaTexture.flipY = false;
  panoramaTexture.wrapS = THREE.RepeatWrapping
  panoramaTexture.wrapT = THREE.RepeatWrapping
  panoramaTexture.magFilter = THREE.NearestFilter;
  panoramaTexture.minFilter = THREE.NearestFilter;

  let center = new THREE.Vector3(point.x / 100, point.z / 100, point.y / 100);

  return new THREE.ShaderMaterial({
    uniforms: {
      uPanorama: { value: panoramaTexture },
      uCenter: { value: center }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec3 uCenter;
      void main() {
        vUv = uv;
        // 模型矩阵modelMatrix包含了模型自身的位置、缩放、姿态角度信息
        vec4 modelPos = modelMatrix * vec4(position, 1.0);
        vPosition = modelPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      uniform vec3 uCenter;
      uniform sampler2D uPanorama;

      const float PI = 3.14159265358;

      void main() {
        // 表示了从中心点指向模型位置的向量
        vec3 nPos = normalize(vPosition - uCenter);
        float theta = acos(nPos.y) / PI;
        float phi = 0.0;
        phi = (atan(nPos.z, nPos.x)+PI) / (2.0*PI);
        phi += 0.75;
        vec4 pColor = texture2D(uPanorama, vec2(phi, theta));
        
        gl_FragColor = pColor;

        if (nPos.z < 0.003 && nPos.z > -0.003 && nPos.x < 0.0) {
          phi = (atan(0.003, nPos.x)+PI)/(2.0*PI);
          phi += 0.75;
          gl_FragColor = texture2D(uPanorama, vec2(phi, theta));;
        }
      }


      // 备注：
      // 这几行代码是一个典型的用于将全景图像（panorama）投影到球体上的片段着色器代码段，通常用于创建全景效果，比如在虚拟现实环境中。

      // 这一行计算了片段的表面法线方向。vPosition 可能是片段着色器中的顶点位置，uCenter 则是球体的中心位置。这里通过将片段位置减去球体中心位置，然后归一化得到了片段表面法线方向
      // vec3 nPos = normalize(vPosition - uCenter);

      // 在球面上，横向为纬度，纵向为经度
      // 这一行计算了球面上点的纬度角度。通过对表面法线向量的 y 分量（在归一化后）进行反余弦运算，得到了点在球面上的纬度角度，并将其归一化到 [0, 1] 范围内。
      // float theta = acos(nPos.y) / PI;

      // 这里初始化了经度角度。
      // float phi = 0.0;

      // 这一行计算了球面上点的经度角度。通过使用反正切函数 atan(nPos.z, nPos.x) 计算出点在 x-z 平面上的角度，并加上 PI（π）以确保角度在 [0, 2π] 范围内，然后将其归一化到 [0, 1] 范围内。
      // phi = (atan(nPos.z, nPos.x)+PI) / (2.0*PI);

      // 这一行可能是对经度角度进行调整，添加了一个偏移量，可能是为了校正纹理在球面上的位置，以便更好地匹配全景图像的实际展示效果。
      // phi += 0.75;

      // 这一行是利用计算出的球面坐标（经度和纬度）来从全景图像中进行纹理采样。uPanorama 是全景图像的纹理，vec2(phi, theta) 表示球面坐标，即经度和纬度，从而得到球面上相应位置的颜色。
      // vec4 pColor = texture2D(uPanorama, vec2(phi, theta));


      // texture2D的方法参数
      // 参数1：sampler2D：这是一个纹理采样器，用于指定要采样的纹理单元。在 GLSL 中，通常使用 uniform sampler2D 声明
      // 参数2：vec2：这是一个二维向量，用于指定在纹理坐标空间中要采样的位置。通常表示为 vec2 类型的变量，其分量范围在 [0, 1] 之间，表示纹理的范围。
    `
  })
}