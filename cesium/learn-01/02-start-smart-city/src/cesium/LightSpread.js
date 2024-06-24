import * as Cesium from "cesium";
import gsap from 'gsap'

import LightSpreadMaterialProperty from './material/LightSpreadMaterialProperty'

export default class LightSpread {

  params = {
    minlot: 113.3091,
    minLat: 23.119,
    maxlot: 113.3141,
    maxLat: 23.124,
  }

  constructor(viewer) {
    this.entity = viewer.entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(
          113.3091,
          23.119,
          113.3141,
          23.124
        ),
        material: new LightSpreadMaterialProperty('LightSpread')
      }
    })

    gsap.to(this.params, {
      minlot: 113.1991,
      minLat: 23.009,
      maxlot: 113.4241,
      maxLat: 23.234,
      duration:  5,
      repeat: -1,
      ease: "linear",
      onUpdate: () => {
        this.entity.rectangle.coordinates = Cesium.Rectangle.fromDegrees(
          this.params.minlot,
          this.params.minLat,
          this.params.maxlot,
          this.params.maxLat
        )
      }
    })
  }
}