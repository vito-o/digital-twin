import * as Cesium from "cesium";

// Cesium.ExperimentalFeatures.enableModelExperimental = true;

export default async function modifyBuild(viewer) {

  // 添加3D建筑
  let tiles3d = await Cesium.createOsmBuildingsAsync()
  viewer.scene.primitives.add(tiles3d)

  tiles3d.style = new Cesium.Cesium3DTileStyle({
    // show: "${feature['name']} !== '广州塔'",
    // color: "color('white', 0.0)"
  });
  // 禁用轮廓线显示
  // tiles3d.debugShowBoundingVolume = false;
  tiles3d.outlineColor = Cesium.Color.TRANSPARENT;

  // 创建自定义着色器
  const customShader = new Cesium.CustomShader({
    vertexShaderText: `
      void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
      }
    `,
    // 自定义着色器的代码
    fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        // 获取模型position信息
        vec4 position = czm_inverseModelView * vec4(v_positionEC, 1.0);
        // 根据高度来设置渐变颜色
        float strength = position.z / 255.0;

        material.diffuse = vec3(strength, 0.15*strength, strength); 
        // material.alpha = strength;

        // 设置镜面反射颜色
        material.specular = vec3(0);

        // 动态光环
        // czm_frameNumber获取当前帧数
        // fract(x),返回x的小数部分
        float time = fract(czm_frameNumber/(60.0 * 10.0));
        // 实现往返的操作
        time = abs(time - 0.5) * 2.0;
        // clamp(x, min, max)，返回x在min和max之间的最小值
        float diff = abs(clamp(position.z/500.0, 0.0, 1.0) - time);
        // step(edge, x)，如果x大于等于edge，返回1，否则返回0
        diff = step(0.01, diff);
        material.diffuse += vec3(0.5)*(1.0-diff);
      }
    `
  });
  tiles3d.customShader = customShader;


  /* // 监听瓦片可见事件，应用自定义着色器
  tiles3d.tileVisible.addEventListener(tile => {
    const cesium3DTileCon = tile.content;
    const featuresLength = cesium3DTileCon.featuresLength;

    for (let i = 0; i < featuresLength; i++) {
      const feature = cesium3DTileCon.getFeature(i);
      if (i == 0) {
        console.log(feature.content)

      }
      // 为模型应用自定义着色器
      feature.content._model.customShader = customShader;
    }
  }); */
}