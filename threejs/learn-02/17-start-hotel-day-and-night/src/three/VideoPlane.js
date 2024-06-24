import * as THREE from "three";

export default class VideoPlane {
  constructor(
    videoSrc,
    size = new THREE.Vector2(1, 1),
    position = new THREE.Vector3(0, 0, 0)
  ) {
    this.video = document.createElement('video');
    this.video.src = videoSrc
    this.video.muted = true;
    this.video.loop = true;
    this.video.play();

    const texture = new THREE.VideoTexture(this.video)

    const planeGeometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1)
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: texture,
      alphaMap: texture
    })
    this.mesh = new THREE.Mesh(planeGeometry, planeMaterial)
    this.mesh.position.copy(position)
  } 
}