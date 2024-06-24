import * as THREE from "three";

export default class Wall extends THREE.Mesh {
  constructor(wallPoints, faceRelation) {
    super()
    this.wallPoints = wallPoints
    this.faceRelation = faceRelation
    
    this.init()
  }

  init() {
    this.wallPoints.forEach(item => {
      item.x = item.x / 100;
      item.y = item.y / 100;
      item.z = item.z / 100;
    })

    let faceIndexs = [
      // 底面
      [0, 1, 2, 3],
      // 上面
      [4, 5, 6, 7],
      // 左面
      [0, 3, 6, 5],
      // 右面
      [2, 1, 4, 7],
      // 前面
      [1, 0, 5, 4],
      // 后面
      [3, 2, 7, 6],
    ];

    // 材质索引
    let mIndex = []
    faceIndexs.forEach(item => {
      // 根据面相关判断对应的全景图和材质
      let faceItem;
      let isFace = this.faceRelation.some(face => {
        faceItem = face;
        return (
          item.includes(face.index[0]) &&
          item.includes(face.index[1]) &&
          item.includes(face.index[2]) &&
          item.includes(face.index[3])
        );
      })
      if (isFace) {
        mIndex.push(faceItem.panorama)
      } else {
        mIndex.push(0)
      }
    })
    
    // faces是一个墙的6个面，每个面里面，四个坐标点
    let faces = faceIndexs.map((item, index) => {
      return [
        [this.wallPoints[item[0]].x, this.wallPoints[item[0]].z, this.wallPoints[item[0]].y],
        [this.wallPoints[item[1]].x, this.wallPoints[item[1]].z, this.wallPoints[item[1]].y],
        [this.wallPoints[item[2]].x, this.wallPoints[item[2]].z, this.wallPoints[item[2]].y],
        [this.wallPoints[item[3]].x, this.wallPoints[item[3]].z, this.wallPoints[item[3]].y],
      ]
    })
    // 六个面的顶点数据
    let positions = []
    // 六个面的uv数据
    let uvs = []
    // 六个面的顶点索引数据
    let indices = []
    let normals = []
    let faceNormals = [
      [0, -1, 0],
      [0, 1, 0],
      [-1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
      [0, 0, -1]
    ]
    let materialGroups = [];

    for (let i = 0; i < faces.length; i++) {
      let points = faces[i]

      let facePositions = []
      let faceUvs = []
      let faceIndices = []

      // 一个面的顶点坐标数组
      facePositions.push(...points.flat())
      // 一个面的uv数据
      faceUvs.push(0, 0, 1, 0, 1, 1, 0, 1)  //设置uv坐标 (逆时针走，从左下角开始， uv坐标是贴图的坐标)
      // 一个面的顶点Index数据
      faceIndices.push(                      //逆时针，一个面两个三角形
        0 + i * 4,
        2 + i * 4,
        1 + i * 4,
        0 + i * 4,
        3 + i * 4,
        2 + i * 4
      )

      positions.push(...facePositions)
      uvs.push(...faceUvs)
      indices.push(...faceIndices)
      // 一个面的四个顶点的法向方向都相同
      normals.push(
        ...faceNormals[i],
        ...faceNormals[i],
        ...faceNormals[i],
        ...faceNormals[i],
      )

      materialGroups.push({
        start: i * 6, 
        count: 6,
        materialIndex: i
      })
    }

    let geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1))
    geometry.groups = materialGroups;

    this.geometry = geometry;
    this.material = mIndex.map(item => {
      if (item == 0) {
        return new THREE.MeshBasicMaterial({ color: 0x333333 })
      } else {
        return item.material
      }
    })

  }
}