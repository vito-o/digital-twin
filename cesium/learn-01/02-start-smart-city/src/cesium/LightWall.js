import * as Cesium from "cesium";
import gsap from 'gsap'

import LightWallMaterialProperty from './material/LightWallMaterialProperty'

export default class LightWall {
  constructor(viewer) {

    this.entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(113.3081, 23.101, 200),
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          113.3051, 23.099, 200.0, 
          113.3101, 23.099, 200.0, 
          113.3101, 23.104, 200.0, 
          113.3051, 23.104, 200.0, 
          113.3051, 23.099, 200.0,
        ]),
        material: new LightWallMaterialProperty('lightWall')
      }
    })

  }
}