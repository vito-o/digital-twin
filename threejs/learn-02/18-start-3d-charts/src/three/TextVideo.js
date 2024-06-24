import * as THREE from "three";

export default class TextVideo{ 
  constructor(
    scene,
    text = "helloworld",
    position = new THREE.Vector3(0, 0, 0),
    euler = new THREE.Euler(0, 0, 0)
  ) {
    this.text = text;

    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.context = this.canvas.getContext("2d");

    this.video = document.createElement('video')
    this.video.src = '/video/chatFrame.mp4'
    this.video.muted = true;
    this.video.loop = true;
    this.video.play();

    this.texture = new THREE.CanvasTexture(this.canvas);
    const planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.planeMaterial = new THREE.MeshBasicMaterial({
      map: this.texture,
      alphaMap: this.texture,
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(planeGeometry, this.planeMaterial);
    this.mesh.position.copy(position);
    this.mesh.rotation.copy(euler);
    scene.add(this.mesh);
  }

  drawVideoText(text) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.drawImage(this.video, 0, 0, 1024, 1024)
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.font = "bold 100px Arial";
    this.context.fillStyle = "rgba(0,255,255,1)";
    this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    this.texture.needsUpdate = true
    this.planeMaterial.needsUpdate = true
  }

  update(deltaTime) {
    this.drawVideoText(this.text)
  }
}