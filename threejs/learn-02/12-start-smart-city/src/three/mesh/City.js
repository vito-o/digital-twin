import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import scene from "../scene";
import modifyCityMaterial from "../modify/modifyCityMaterial";
import MeshLine from './MeshLine'
import LightWall from './LightWall'
import LightRadar from './LightRadar'
import AlarmSprite from './AlarmSprite'
import FlyLine from './FlyLine'
import FlyLineShader from './FlyLineShader'

function createCity() {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/model/city.glb", (gltf) => {

    gltf.scene.traverse(item => {
      if (item.type == 'Mesh') {
        const cityMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x0c0e33)
        })
        item.material = cityMaterial
        modifyCityMaterial(item);
        if (item.name == 'Layerbuildings') {
          const meshLine = new MeshLine(item.geometry);
          const size = item.scale.x;
          meshLine.mesh.scale.set(size, size, size);
          scene.add(meshLine.mesh);
        }
      } 
    })

    scene.add(gltf.scene)

    // 添加光墙
    // const lightWall = new LightWall()
    // scene.add(lightWall.mesh)

    // 雷达
    // const lightRadar = new LightRadar();
    // scene.add(lightRadar.mesh)

    // 警告标识
    // const alarmSprite = new AlarmSprite()
    // scene.add(alarmSprite.mesh)
    // alarmSprite.onClick(e => console.log('告警', e))

    // 飞线
    // const flyLine = new FlyLine();
    // scene.add(flyLine.mesh)
    
    // 飞线着色器
    // const flyLineShader = new FlyLineShader();
    // scene.add(flyLineShader.mesh)
  })
}

export default createCity;