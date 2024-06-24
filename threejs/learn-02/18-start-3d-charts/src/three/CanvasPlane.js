import * as THREE from "three";

export default class CanvasPlane{ 
  constructor(
    scene,
    text = 'hello world',
    position = new THREE.Vector3(0, 0, 0),
    euler = new THREE.Euler(0, 0, 0)
  ) {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    this.context = canvas.getContext('2d')

    let image = new Image();
    image.src = '/textures/frame/frame2.png'
    image.onload = () => {
      this.context.drawImage(image, 0, 0, 1024, 1024)
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.font = "bold 100px Arial";
      this.context.fillStyle = "rgba(0,255,255,1)";
      this.context.fillText(text, canvas.width / 2, canvas.height / 2);

      let texture = new THREE.CanvasTexture(canvas)

      let planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
      let planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        alphaMap: texture,
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      this.mesh = new THREE.Mesh(planeGeometry, planeMaterial)
      this.mesh.position.copy(position)
      this.mesh.rotation.copy(euler)
      scene.add(this.mesh)
    }
  }
}