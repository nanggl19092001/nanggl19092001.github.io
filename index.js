import * as THREE from 'three'
import WebGLUtils from './com/WebGLUtils.js'

const canvas = document.getElementById("root")

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 100)
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(window.innerWidth, window.innerHeight, true)
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const cube = new THREE.Mesh(geometry, material)

camera.position.z = 5

scene.add(cube)

renderer.render(scene, camera)

function animate(){
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
}

animate()





