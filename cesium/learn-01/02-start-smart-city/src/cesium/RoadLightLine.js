import * as Cesium from "cesium";
import PolylineTrailMaterialProperty from "./material/PolylineTrailMaterialProperty";
import SpritelineMaterialProperty from "./material/SpritelineMaterialProperty";

export default class RoadLightLine {
  constructor(viewer) {
    let geoJsonPromise = Cesium.GeoJsonDataSource.load('/geojson/roadline.geojson')
    geoJsonPromise.then(dataSource => {
      viewer.dataSources.add(dataSource)

      let entities = dataSource.entities.values;
      let color = new Cesium.Color(0.7, 1.0, 0.7, 1.0)
      // let polylineTrailMaterialProperty = new PolylineTrailMaterialProperty(color)
      let spritelineMaterialProperty = new SpritelineMaterialProperty();

      entities.forEach(item => {
        let polyline = item.polyline;
        polyline.material = spritelineMaterialProperty
      })
    })
  }
}