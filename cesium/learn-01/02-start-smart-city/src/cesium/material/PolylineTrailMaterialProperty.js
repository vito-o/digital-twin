import * as Cesium from "cesium";
import gsap from "gsap";

export default class PolylineTrailMaterialProperty {

  static typeNum = 0

  params = {
    uTime: 0
  }

  definitionChanged = new Cesium.Event();

  constructor(color = new Cesium.Color(0.7, 0.6, 1.0, 1.0)) {
    this.color = color;

    PolylineTrailMaterialProperty.typeNum ++;
    this.num = PolylineTrailMaterialProperty.typeNum;

    Cesium.Material._materialCache.addMaterial(
      "PolylineTrailMaterial" + this.num, 
      {
        fabric: {
          type: 'PolylineTrailMaterial' + PolylineTrailMaterialProperty.typeNum,
          uniforms: {
            uTime: 0,
            color: this.color
          },
          source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
              // 生成默认材质
              czm_material material = czm_getDefaultMaterial(materialInput);
              // 获取st
              vec2 st = materialInput.st;
              // 获取当前帧数，10秒内从0-1变化
              float time = fract(czm_frameNumber / (60.0 * 10.0));
              time = time + 0.1;
              // 平滑过渡函数
              // smoothstep(edge0, edge1, value);
              // 参数1：边缘0,==8,
              // 参数2：边缘1,==10,
              // 参数3：当前值,==7 , result = 0
              // 参数3：当前值,==9 , result = 0.5
              // 参数3：当前值,==10 , result = 1
              float alpha = smoothstep(time - 0.1, time, st.s) * step(-time, -st.s);
              alpha += 0.05;

              material.alpha = alpha;
              material.diffuse = color.rgb;

              return material;
            }
          `
        }
      }
    )

    gsap.to(this.params, {
      uTime: 1,
      duration: 2,
      repeat: -1,
      yoyo: true,
    });
  }

  // 返回材质类型
  getType() {
    return "PolylineTrailMaterial" + this.num
  }

  // 返回材质值
  getValue(time, result) {
    result.uTime = this.params.uTime;
    return result;
  }

  equals(other) {
    // 判断两个材质是否相等
    return (
      other instanceof PolylineTrailMaterialProperty &&
      this.color === other.color
    );
  }
}