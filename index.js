import * as THREE from 'three'
import Character from './com/Entity/Character.js'
import Floor from './com/Entity/Floor.js'
import Wall from './com/Entity/Wall.js'
import WebGLUtils from './com/WebGLUtils.js'

let buttonPressed = {
    'w': false,
    'a': false,
    's': false,
    'd': false
}

let allowingDirection = {
    'up': true,
    'down': true,
    'left': true,
    'right': true
}

let objects = []

const canvas = document.getElementById("root")
const character = new Character(6, 5)
const floor = new Floor(0, 0, 10, 1)
objects.push(floor)
const wall = new Wall(-1, 2.5, 2, 1)
objects.push(wall)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 100)
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(window.innerWidth, window.innerHeight, true)
camera.position.z = 5

scene.add(character.draw())
for(let i = 0; i < objects.length; i++){
    scene.add(objects[i].draw())
}

let vec = 4
let start = performance.now()
let characterVelocity = 0

function render(){
    let end = performance.now()
    let delta = end - start
    
    start = end
    requestAnimationFrame(render)

    allowingDirection = character.collisionDetect(objects, vec)

    characterVelocity = (delta/1000)*vec

    moveCharacter(characterVelocity)
    
    renderer.render(scene, camera)
}

render()

document.addEventListener('keydown', (e) => {
    switch(e.key){
        case "w":
            buttonPressed.w = true
            break
        case "a":
            buttonPressed.a = true
            break
        case "s":
            buttonPressed.s = true
            break
        case "d":
            buttonPressed.d = true
            break
    }
})

document.addEventListener('keyup', (e) => {
    switch(e.key){
        case "w":
            buttonPressed.w = false
            break
        case "a":
            buttonPressed.a = false
            break
        case "s":
            buttonPressed.s = false
            break
        case "d":
            buttonPressed.d = false
            break
    }
})

function moveCharacter(velocity) {
    if(buttonPressed.w && allowingDirection.up) 
        character.move(0, velocity, objects)
    if(buttonPressed.a && allowingDirection.left  ) 
        character.move(-velocity, 0, objects)
    if(buttonPressed.s && allowingDirection.down) 
        character.move(0, -velocity, objects)
    if(buttonPressed.d && allowingDirection.right) 
        character.move(velocity, 0, objects)
}


