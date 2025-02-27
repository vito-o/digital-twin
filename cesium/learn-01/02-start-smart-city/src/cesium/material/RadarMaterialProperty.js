import * as Cesium from "cesium";
import gsap from "gsap";

export default class RadarMaterialProperty {

  params = {
    uTime: 0
  }

  definitionChanged = new Cesium.Event();

  constructor(name) {
    this.name = name;

    Cesium.Material._materialCache.addMaterial(
      "RadarMaterial", 
      {
        fabric: {
          type: 'RadarMaterial',
          uniforms: {
            uTime: 0,
          },
          source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
              // 生成默认材质
              czm_material material = czm_getDefaultMaterial(materialInput);

              // 旋转uv
              vec2 newSt = mat2(
                cos(uTime),-sin(uTime), sin(uTime),cos(uTime)
              ) * (materialInput.st - 0.5);

              newSt = newSt + 0.5;

              // 获取st
              // vec2 st = materialInput.st;
              vec2 st = newSt;
              
              // 设置圆，外部透明，内部不透明
              float alpha = 1.0 - step(0.5, distance(st, vec2(0.5)));

              // 按照角度来设置强弱
              float angle = atan(st.x-0.5, st.y-0.5);
              float strength = (angle + 3.1416) / 6.2832;

              // 将强弱与透明度结合
              alpha = alpha * strength;

              material.alpha = alpha;
              material.diffuse = vec3(st, 1.0);

              return material;
            }
          `
        }
      }
    )

    gsap.to(this.params, {
      uTime: 6.28,
      duration: 5,
      repeat: -1,
      ease: "linear",
    });
  }

  // 返回材质类型
  getType() {
    return "RadarMaterial"
  }

  // 返回材质值
  getValue(time, result) {
    result.uTime = this.params.uTime;
    return result;
  }

  equals(other) {
    // 判断两个材质是否相等
    return (
      other instanceof RadarMaterialProperty &&
      this.name === other.name
    );
  }
}