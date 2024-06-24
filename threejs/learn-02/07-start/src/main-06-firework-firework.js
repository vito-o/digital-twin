import * as Three from 'three'

import startpoint_vertexShader from './shader/firework/startpoint_vertex.glsl?raw'
import startpoint_fragmentShader from './shader/firework/startpoint_fragment.glsl?raw'
import firework_vertexShader from './shader/firework/firework_vertex.glsl?raw'
import firework_fragmentShader from './shader/firework/firework_fragment.glsl?raw'


export default class Fireworks {
  constructor(color, to, from = {x: 19, y: 2, z: 7.3}) {
    this.color = new Three.Color(color)

    // 创建烟花发射的球点
    this.startGeometry = new Three.BufferGeometry();
    const startPositionArray = new Float32Array(3)
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    this.startGeometry.setAttribute('position', new Three.BufferAttribute(startPositionArray, 3))

    const astepArray = new Float32Array(3)
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.z;
    this.startGeometry.setAttribute('aStep', new Three.BufferAttribute(astepArray, 3))

    // 设置着色器材质
    this.startMaterial = new Three.ShaderMaterial({
      vertexShader: startpoint_vertexShader,
      fragmentShader: startpoint_fragmentShader,
      transparent: true,
      blending: Three.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value : 0
        },
        uSize: {
          value: 20,
        },
        uColor: {
          value: this.color
        }
      }
    })

    // 创建烟花球点
    this.startPoint = new Three.Points(this.startGeometry, this.startMaterial)

    this.clock = new Three.Clock()

    // 创建爆炸烟花
    this.fireworkGeometry = new Three.BufferGeometry()
    
    this.fireworksCount = 180 + Math.floor(Math.random() * 180);
    const startPositionFireworksArray = new Float32Array(this.fireworksCount*3);
    const directionFireworksArray = new Float32Array(this.fireworksCount * 3)
    const scaleFireworksArray = new Float32Array(this.fireworksCount)

    for(let i = 0; i < this.fireworksCount; i++) {
      // 烟花爆炸每个粒子起始点
      startPositionFireworksArray[i * 3 + 0] = to.x;
      startPositionFireworksArray[i * 3 + 1] = to.y;
      startPositionFireworksArray[i * 3 + 2] = to.z;

      // 烟花爆炸每个粒子方向
      let theta = Math.random() * 2 * Math.PI;
      let beta = Math.random() * 2 * Math.PI;
      let r = Math.random();
      directionFireworksArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      directionFireworksArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      directionFireworksArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);

      // 粒子大小
      scaleFireworksArray[i] = Math.random()
    }

    this.fireworkGeometry.setAttribute('position', new Three.BufferAttribute(startPositionFireworksArray, 3));
    this.fireworkGeometry.setAttribute('aRandom', new Three.BufferAttribute(directionFireworksArray, 3))
    this.fireworkGeometry.setAttribute('aScale', new Three.BufferAttribute(scaleFireworksArray, 1))

    this.fireworkMaterial = new Three.ShaderMaterial({
      vertexShader: firework_vertexShader,
      fragmentShader: firework_fragmentShader,
      transparent: true,
      blending: Three.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value : 0
        },
        uSize: {
          value: 0,
        },
        uColor: {
          value: this.color
        }
      }
    })

    this.firework = new Three.Points(this.fireworkGeometry, this.fireworkMaterial)



    // 创建音频
    this.linstener1 = new Three.AudioListener()
    this.linstener2 = new Three.AudioListener()
    this.sendSound = new Three.Audio(this.linstener1)
    this.fireworkSound = new Three.Audio(this.linstener2)

    const audioLoader = new Three.AudioLoader()
    audioLoader.load(`/assets/audio/send.mp3`, buffer => {
      this.sendSound.setBuffer(buffer)
      this.sendSound.setLoop(false)
      this.sendSound.setVolume(0.1)
    })
    audioLoader.load(`/assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`, buffer => {
      this.fireworkSound.setBuffer(buffer)
      this.fireworkSound.setLoop(false)
      this.fireworkSound.setVolume(0.2)
    })

  }

  addScene(scene, camera) {
    scene.add(this.startPoint)
    scene.add(this.firework)
    this.scene = scene
  }

  update() {
    let elapsedTime = this.clock.getElapsedTime()
    if (elapsedTime > 0.2 && elapsedTime < 1) {
      if (!this.sendSound.isPlaying && !this.sendPlay) {
        this.sendSound.play()
        this.sendPlay = true;
      }

      this.startMaterial.uniforms.uTime.value = elapsedTime
      this.startMaterial.uniforms.uSize.value = 20.0;
    } else if (elapsedTime > 0.2) {
      let time = elapsedTime - 1;
      // 让点消失
      this.startMaterial.uniforms.uSize.value = 0;
      this.startPoint.clear()
      this.startGeometry.dispose()
      this.startMaterial.dispose()

      // 显示烟花
      this.fireworkMaterial.uniforms.uSize.value = 20;
      this.fireworkMaterial.uniforms.uTime.value = time;

      if (!this.fireworkSound.isPlaying && !this.fireworkPlay) {
        this.fireworkSound.play()
        this.fireworkPlay = true;
      }

      if (time > 4) {
        this.fireworkMaterial.uniforms.uSize.value = 0;
        this.firework.clear()
        this.fireworkGeometry.dispose()
        this.fireworkMaterial.dispose()

        this.scene.remove(this.startPoint)
        this.scene.remove(this.firework)
        return 'remove'
      }
    }
  }

}