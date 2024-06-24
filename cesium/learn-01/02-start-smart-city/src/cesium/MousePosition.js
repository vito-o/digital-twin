import * as Cesium from 'cesium'

export default class MousePosition {
  constructor(viewer) {

    this.divDom = document.createElement('div')
    this.divDom.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      height: 50px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: 14px;
      line-height: 50px;
      text-align: center;
      z-index: 100;
    `
    document.body.appendChild(this.divDom)

    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(
      movement => {
        // 获取鼠标坐标
        const cartensian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
        if (cartensian) {
          // 转换成经纬度
          const cartographic = Cesium.Cartographic.fromCartesian(cartensian)
          const longitudeString = Cesium.Math.toDegrees(cartographic.longitude)
          const latitudeString = Cesium.Math.toDegrees(cartographic.latitude)
          const heightString = cartographic.height

          // 显示经纬度
          this.divDom.innerHTML = `
            经度：${longitudeString.toFixed(3)} 维度：${latitudeString.toFixed(3)}
          `
        }
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    )
  }
}
