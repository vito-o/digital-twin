import '../style.css'
//打造3d全屏滚动官网

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

import * as d3 from "d3";
import gsap from 'gsap'

// 场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  90,   // 视角
  window.innerWidth / window.innerWidth,
  0.1,  // 近平面
  100000  // 远平面
)
// 设置相机位置
camera.position.set(0, 0, 1000)
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();

// 场景渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
//   设置渲染器的像素比
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement)
// ------------------------------------

// 坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true


// 加载纹理
const map = new THREE.Object3D()

const projection = d3.geoMercator().center([116, 39]).translate([0, 0, 0])
const loader = new THREE.FileLoader()
loader.load('/china.json', data => {
  let jsonData = JSON.parse(data)
  console.log(jsonData)
  operationData(jsonData)
})

const operationData = (jsonData) => {
  const features = jsonData.features;

  features.forEach(feature => {
    const province = new THREE.Object3D();
    province.properties = feature.properties.name

    const coordinates = feature.geometry.coordinates
    const color = '#99ff99'

    if (feature.geometry.type === 'MultiPolygon') {
      coordinates.forEach(coordinate => {
        coordinate.forEach(rows => {
          const mesh = drawExtrudeMesh(rows, color, projection)
          const line = drawLine(rows, color, projection)

          mesh.properties = feature.properties.name;
          province.add(mesh)
          province.add(line)
        })
      })
    }

    if (feature.geometry.type === 'Polygon') {
      coordinates.forEach(coordinate => {
        const mesh = drawExtrudeMesh(coordinate, color, projection)
        const line = drawLine(coordinate, color, projection)

        mesh.properties = feature.properties.name;
        province.add(mesh)
        province.add(line)
      })
    }

    map.add(province)
  })
  scene.add(map)
}

const drawExtrudeMesh = (polygon, color, projection) => {
  const shape = new THREE.Shape();
  polygon.forEach((row, i) => {
    const [x, y] = projection(row)
    // console.log(x, y, row)
    if (i == 0) {
      shape.moveTo(x, -y)
    }
    shape.lineTo(x, -y)
  })

  // 拉伸/挤出
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 5,
    bevelEnabled: true
  })

  // 颜色
  const randomColor = (Math.random() * 0.5 + 0.5) * 0xffffff;
  const material = new THREE.MeshBasicMaterial({
    color: randomColor,
    transparent: true,
    opacity: 0.7
  })
  return new THREE.Mesh(geometry, material)
}

const drawLine = (polygon, color, projection) => {
  const lineGeometry = new THREE.BufferGeometry()
  const pointsArray = []
  polygon.forEach(rows => {
    const [x, y] = projection(rows)
    pointsArray.push(new THREE.Vector3(x, -y, 7))
  })
  lineGeometry.setFromPoints(pointsArray)
  
  const lineColor = new THREE.Vector3(
    Math.random() * 0.5 + 0.5,
    Math.random() * 0.5 + 0.5,
    Math.random() * 0.5 + 0.5,
  )

  const lineMaterial = new THREE.LineBasicMaterial({
    color: lineColor
  })

  return new THREE.Line(lineGeometry, lineMaterial)
}

const point = new THREE.Vector3()
const raycaster = new THREE.Raycaster()
let lastPick;

window.addEventListener('click', e => {
  point.x = (e.clientX / window.innerWidth) * 2 - 1;
  point.y = -((e.clientY / window.innerHeight) * 2 - 1)

  raycaster.setFromCamera(point, camera)
  const intersects = raycaster.intersectObject(map)

  if (intersects.length) {
    if (lastPick && lastPick.object.properties && lastPick.object.properties !== intersects[0].object.properties) {
      lastPick.object.material.color = lastPick.object.material.rawColor.clone()
    }

    if (intersects[0].object.properties) {
      intersects[0].object.material.rawColor = intersects[0].object.material.color.clone()
      intersects[0].object.material.color.set('red')
    }
    lastPick = intersects[0]  
  } else {
    if (lastPick && lastPick.object.properties) {
      lastPick.object.material.color = lastPick.object.material.rawColor.clone()
      lastPick = null;
    }
  }
})


function animate() {
  controls.update()
  // 渲染
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

animate()

// 监听窗口变化
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
})

// 创建GUI
// const gui = new GUI();

