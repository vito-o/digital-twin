import * as Cesium from "cesium";
import gsap from "gsap";

export default class LightSpreadMaterialProperty {

  params = {
    uTime: 0
  }

  definitionChanged = new Cesium.Event();

  constructor(name) {
    this.name = name;

    Cesium.Material._materialCache.addMaterial(
      "LightSpreadMaterial", 
      {
        fabric: {
          type: 'LightSpreadMaterial',
          uniforms: {
            uTime: 0,
            image: '/texture/hexagon.png'
          },
          source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
              // 生成默认材质
              czm_material material = czm_getDefaultMaterial(materialInput);
              // 获取st
              vec2 st = materialInput.st;
              // 根据uv采样颜色，fract(x)返回x的小数部分
              vec4 color = texture(image, st);

              // 设置材质的透明度
              material.alpha = color.a;
              material.diffuse = color.rgb;

              return material;
            }
          `
        }
      }
    )

    gsap.to(this.params, {
      uTime: 1,
      duration: 5,
      repeat: -1,
      ease: "linear",
    });
  }

  // 返回材质类型
  getType() {
    return "LightSpreadMaterial"
  }

  // 返回材质值
  getValue(time, result) {
    result.uTime = this.params.uTime;
    return result;
  }

  equals(other) {
    // 判断两个材质是否相等
    return (
      other instanceof LightSpreadMaterialProperty &&
      this.name === other.name
    );
  }
}