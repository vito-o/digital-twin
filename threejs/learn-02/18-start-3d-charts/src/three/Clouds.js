import * as THREE from 'three'
import gsap from 'gsap'

export default class Clouds {
  constructor(
    height = 10,
    num = 300,
    size = 15,
    scale = 10,
    autoRotate = true
  ) {
    let textureLoader = new THREE.TextureLoader();
    const map1 = textureLoader.load("/textures/cloud/cloud1.jfif");
    const map2 = textureLoader.load("/textures/cloud/cloud2.jfif");
    const map3 = textureLoader.load("/textures/cloud/cloud3.jpg");

    let material1 = new THREE.SpriteMaterial({
      map: map2,
      color: 0xffffff,
      alphaMap: map1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    })

    let material2 = new THREE.SpriteMaterial({
      map: map3,
      color: 0xffffff,
      alphaMap: map2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    })

    let material3 = new THREE.SpriteMaterial({
      map: map1,
      color: 0xffffff,
      alphaMap: map3,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    })

    this.materials = [material1, material2, material3]
    this.mesh = new THREE.Group();

    for(let i = 0; i < num; i++) {
      let index = Math.floor(Math.random() * 3);
      let material = this.materials[index];
      let sprite = new THREE.Sprite(material)

      let randomSize = Math.random() * size;
      sprite.scale.set(randomSize, randomSize, randomSize);

      let randomX = (Math.random() - 0.5) * 2 * scale;
      let randomY = Math.random() * (height / 2) + height;
      let randomZ = (Math.random() - 0.5) * 2 * scale;
      sprite.position.set(randomX, randomY, randomZ);

      this.mesh.add(sprite)
    }

    if (autoRotate) {
      this.animate()
    }
  }

  animate() {
    gsap.to(this.mesh.rotation, {
      duration: 120,
      repeat: -1, 
      y: Math.PI * 2
    })
  }
}


export class CloudsPlus {
  constructor(
    height = 10,
    num = 100,
    size = 15,
    scale = 10,
    autoRotate = true
  ) {
    this.height = height;
    this.num = num;
    this.size = size;
    this.scale = scale;
    this.autoRotate = autoRotate;

    let textureLoader = new THREE.TextureLoader();
    const map1 = textureLoader.load("./textures/cloud/cloud1.jfif");
    const map2 = textureLoader.load("./textures/cloud/cloud2.jfif");
    const map3 = textureLoader.load("./textures/cloud/cloud3.jpg");

    let materials = [];

    let material1 = new THREE.PointsMaterial({
      map: map1,
      color: 0xffffff,
      alphaMap: map2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      size: 0.2 * this.size
    })

    let material2 = new THREE.PointsMaterial({
      map: map2,
      color: 0xffffff,
      alphaMap: map3,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      size: 0.5 * this.size
    })

    let material3 = new THREE.PointsMaterial({
      map: map3,
      color: 0xffffff,
      alphaMap: map1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      size: 0.8 * this.size
    })

    let material4 = new THREE.PointsMaterial({
      map: map2,
      color: 0xffffff,
      alphaMap: map1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      size: 1 * this.size
    })

    materials.push(material1, material2, material3, material4)
    this.mesh = new THREE.Group();

    for(let i = 0; i < materials.length; i++) {
      let material = materials[i]
      let geometry = this.generateGeometry(this.num)
      let points = new THREE.Points(geometry, material)
      this.mesh.add(points)
    }

    if (autoRotate) {
      this.animate()
    }
  }


  generateGeometry(num = 300) {
    const vertices = []

    for (let i = 0; i < num; i++) {
      let randomX = (Math.random() - 0.5) * 2 * this.scale;
      let randomY = Math.random() * (this.height / 2) + this.height;
      let randomZ = (Math.random() - 0.5) * 2 * this.scale;
      vertices.push(randomX, randomY, randomZ)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }

  animate() {
    let i = 0;
    this.mesh.traverse(item => {
      let speed = 40 * i;

      if (item instanceof THREE.Points) {
        gsap.to(item.rotation, {
          duration: speed,
          repeat: -1,
          y: Math.PI * 2
        })
      }

      i++;
    })
  }

}