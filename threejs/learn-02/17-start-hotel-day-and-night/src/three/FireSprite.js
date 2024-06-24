import * as THREE from "three";
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper.js";
import fragmentShader from './shader/FireSprite/fragment.glsl?raw'

export default class FireSprite {
  constructor(
    camera,
    position = new THREE.Vector3(-4.9, 1.8, 25.1),
    scale = 1
  ) {
    this.camera = camera;

    this.spriteMaterial = new THREE.ShaderMaterial({
      uniforms: {
        rotation: { value: 0 },
        center: {
          value: new THREE.Vector2(0.5, 0.5),
        },
        iTime: {
          value: 0,
        },
        iResolution: {
          value: new THREE.Vector2(1000, 1000),
        },
        iMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uFrequency: {
          value: 0,
        },
      },
      vertexShader: `
        uniform float rotation;
        uniform vec2 center;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
            scale *= - mvPosition.z;
            
            vec2 alignedPosition = -( position.xy - ( center - vec2( 0.5 ) ) ) * scale/mvPosition.z;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;
            gl_Position = projectionMatrix * mvPosition;
            gl_Position.z = -5.0;
        }
      `,
      fragmentShader: fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      //   depthTest: false,
      side: THREE.DoubleSide,
      /* `
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(vUv, 0.0, 1.0);
        }
      ` */
    });

    /* this.spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('/textures/effect/ke123.png'),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide
    }) */

    // this.spriteMaterial.onBeforeCompile = shader => {
    //   console.log(shader.vertexShader)
    // }

    this.sprite = new THREE.Sprite(this.spriteMaterial)
    this.sprite.renderOrder = 1;
    this.sprite.position.copy(position)
    this.sprite.scale.set(scale, scale, scale)
    this.mesh = this.sprite;


    // 创建音乐
    this.listener = new THREE.AudioListener();
    this.sound = new THREE.PositionalAudio(this.listener)
    this.audioLoader = new THREE.AudioLoader();
    this.audioLoader.load('/audio/gnzw.mp3', buffer => {
      this.sound.setBuffer(buffer)
      this.sound.setRefDistance(10)
      this.sound.setLoop(true)
      this.sound.play()
    })
    this.mesh.add(this.sound)

    // const helper = new PositionalAudioHelper(this.sound, 10);
    // this.sound.add(helper);
    this.analyser = new THREE.AudioAnalyser(this.sound, 32);
  }

  update(deltaTime) {
    let position = this.camera.localToWorld(new THREE.Vector3(0, 0, 0));
    let distanceSquared = position.distanceToSquared(this.mesh.position);
    this.sound.setVolume(1 / distanceSquared * 200)
    let frequency = this.analyser.getAverageFrequency();
//
    this.spriteMaterial.uniforms.uFrequency.value = frequency;
    this.spriteMaterial.uniforms.iTime.value = deltaTime;
  }
}