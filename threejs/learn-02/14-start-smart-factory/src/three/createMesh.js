import Wall from "./mesh/Wall";
import Floor1 from "./mesh/Floor1";
import Floor2 from "./mesh/Floor2";
import Fighter from "./mesh/Fighter";
import scene from "./scene";

import gsap from 'gsap'
import eventHub from "@/utils/eventHub";

let floor1;
let floor2;
let wall;
let fighter;
export default function createMesh() {
  wall = new Wall(scene)
  floor1 = new Floor1(scene)
  floor2 = new Floor2(scene)
  fighter = new Fighter(scene)
  fighter.setFloor2(floor2)

  initEvent ()
}

function initEvent () {
  eventHub.on('showWall', () => {
    wall.show()
    floor1.hide()
    floor2.hide()
    fighter.hide()
  })
  eventHub.on('showFloor1', () => {
    wall.hide()
    floor1.show()
    floor2.hide()
    fighter.hide()
  })
  eventHub.on('showFloor2', () => {
    wall.hide()
    floor1.hide()
    floor2.show()
    fighter.show()
  })
  eventHub.on('clickFighter', (floor2Visible) => {
    if (floor2Visible) {
      floor2.hide()
    } else {
      floor2.show()
    }
  })

  eventHub.on('flatFighter', () => {
    fighter.flat()
  })
  eventHub.on('recoverFighter', () => {
    fighter.recover()
  })

  eventHub.on('pointsFighter', () => {
    fighter.becomePoint()
  })
  eventHub.on('pointsBlast', () => {
    fighter.pointsBlast()
  })
  eventHub.on('pointsBack', () => {
    fighter.pointsRevert()
  })


  eventHub.on('showAll', () => {
    wall.show()
    floor1.show()
    floor2.show()
    fighter.show()

    gsap.to(wall.meshGroup.position, {
      y: 200,
      duration: 1
    })
    gsap.to(floor2.meshGroup.position, {
      y: 50,
      duration: 1,
      delay: 1
    })
    gsap.to(fighter.meshGroup.position, {
      y: 50,
      duration: 1,
      delay: 1
    })
  })
  eventHub.on('hideAll', () => {
    gsap.to(floor2.meshGroup.position, {
      y: 0,
      duration: 1,
    })
    gsap.to(fighter.meshGroup.position, {
      y: 0,
      duration: 1,
    })
    gsap.to(wall.meshGroup.position, {
      y: 0,
      duration: 1,
      delay: 1,
      onComplete: () => {
        floor1.hide()
        floor2.hide()
        fighter.hide()
      }
    })
  })
}


export function updateMesh(time) {
  // city.update(time)
  // if (fighter)
}