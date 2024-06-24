import * as THREE from "three";

export default class SpriteText {
  constructor(
    text = "helloworld",
    position = new THREE.Vector3(0, 0, 0),
    opacity = 0.7,
    camera
  ) {
    this.fns = []

    // 创建canvas
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    this.context = canvas.getContext('2d')

    this.context.fillStyle = `rgba(90,90,90,${opacity})`;
    this.context.fillRect(0, 256, 1024, 512);
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.font = "bold 200px Arial";
    this.context.fillStyle = "rgba(255,255,255,1)";
    this.context.fillText(text, canvas.width/2, canvas.height/2)

    let texture = new THREE.CanvasTexture(canvas)
    let material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    this.mesh = new THREE.Sprite(material)
    this.mesh.scale.set(1, 1, 1)
    this.mesh.position.copy(position)

    // 创建射线
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    if (camera) {
      window.addEventListener('click', e => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, camera)
        e.mesh = this.mesh
        e.spriteCanvas = this;

        const intersects = this.raycaster.intersectObject(this.mesh)
        e.intersects = intersects

        if (intersects.length) {
          this.fns.forEach(fn => fn(e))
        }
      })
    }
  }

  onClick(fn) {
    this.fns.push(fn)
  }
} 