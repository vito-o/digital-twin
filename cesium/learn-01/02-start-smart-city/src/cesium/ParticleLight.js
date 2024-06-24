import * as Cesium from "cesium";

export default class ParticleLight {
  constructor(viewer, color = Cesium.Color.WHITE) {

    this.boxEntity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 250),
      box: {
        dimensions: new Cesium.Cartesian3(300.0, 300.0, 500),
        material: Cesium.Color.RED.withAlpha(0),
      }
    })

    let particleSystem = new Cesium.ParticleSystem({
      // 粒子纹理
      image: '/texture/smoke.png',
      // 粒子大小
      // imageSize: new Cesium.Cartesian2(20, 20),
      // 粒子图像大小随机
      minimumImageSize: new Cesium.Cartesian2(0.1, 0.1),
      maximumImageSize: new Cesium.Cartesian2(30, 30),
      // 设置开始颜色
      startColor: color,
      // 设置结束颜色
      endColor: Cesium.Color.WHITE.withAlpha(0),
      //   开始的时候粒子的大小
      startScale: 0.1,
      //   结束的时候粒子的大小
      endScale: 2.0,
      //   速度，米/秒
      //   speed: 5.0,
      // 随机发射速度
      minimumSpeed: 1.0,
      maximumSpeed: 10.0,
      // 设置发射器
      emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(100, 100, 500)),
      // 发射率，每秒产生的粒子数量
      emissionRate: 2,
      // 粒子的生命周期
      lifetime: 5.0,
      modelMatrix: this.boxEntity.computeModelMatrix(
        viewer.clock.currentTime,
        new Cesium.Matrix4()
      ),
    })
    viewer.scene.primitives.add(particleSystem);
  }
}