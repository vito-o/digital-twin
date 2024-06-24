import * as THREE from 'three'

class SpriteCanvas {
  constructor(
    camera,
    text = 'text',
    position = new THREE.Vector3(0, 0, 0),
    euler = new THREE.Euler(0, 0, 0)
  ) {
    this.fns = [];

    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024

    const context = canvas.getContext('2d')
    context.fillStyle = "rgba(90,90,90,0.7)";
    context.fillRect(0, 256, 1024, 512);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 200px Arial";
    context.fillStyle = "rgba(255,255,255,1)";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const material = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true
    })
    this.mesh = new THREE.Sprite(material)
    this.mesh.scale.set(1, 1, 1)
    this.mesh.position.copy(position)


    // 创建射线
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // 事件监听
    window.addEventListener('click', event => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, camera)

      event.mesh = this.mesh
      event.spriteCanvas = this;
      event.intersects = this.raycaster.intersectObject(this.mesh)

      if (event.intersects.length > 0) {
        this.fns.forEach(fn => fn(event))
      }
    })
  }

  onClick(fn) {
    this.fns.push(fn)
  }
}

export default SpriteCanvas;