import * as THREE from 'three';
import fragmentShader from './fragmentShader.js';
import vertexShader from './vertexShader.js';
import { Mesh, Vector2, Vector3 } from 'three';

const startTime = new Date()

function renderMainCanvas(){
    const canvasDiv = document.getElementById('canvas')
    let pointer = new Vector2()
    let raycaster = new THREE.Raycaster();

    let aspect = window.innerWidth/window.innerHeight
    let renderer = new THREE.WebGLRenderer({ antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    canvasDiv.appendChild(renderer.domElement)

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    let BackgroundPlane = new THREE.BufferGeometry();

    let BackgroundPlaneVert = new Float32Array(
        [
            -2.0 * aspect, -2.0,  0.0,
            2.0 * aspect, -2.0,  0.0,
            2.0 * aspect,  2.0,  0.0,

            2.0 * aspect,  2.0,  0.0,
            -2.0 * aspect,  2.0,  0.0,
            -2.0 * aspect, -2.0,  0.0
        ]
    )

    BackgroundPlane.setAttribute("position", new THREE.BufferAttribute(BackgroundPlaneVert, 3))
    const BackgroundPlaneMaterial = new THREE.ShaderMaterial({
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        transparent: true,
        uniforms: {
            u_resolution: {type: 'v2', value:new Vector2(window.innerWidth, window.innerHeight)},
            u_mouse: {type: 'v2', value: pointer},
            u_aspect: {type: 'f', value: aspect},
            u_time: {type: 'f', value: 0.0}
        }
    })

    let BackgroundPlaneMesh = new THREE.Mesh(BackgroundPlane, BackgroundPlaneMaterial);

    let geometries = []
    geometries.push(new THREE.PlaneGeometry(0.008,0.008))
    geometries.push(new THREE.CircleGeometry(0.005))

    let dotMaterial = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: `
        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
        }
        `,
        fragmentShader: `
        void main(){
            gl_FragColor = vec4(0.45, 0.8, 0.2, 0.3);
        }
        `
    })
    let dotMeshes = []
    for(let i = 0; i < 1000; i++ ){

        let dotMesh = new THREE.Mesh(geometries[Math.floor(Math.random() * 2)], dotMaterial);
        dotMesh.position.x = -0.9 * aspect + i%50 * 0.07
        dotMesh.position.y = -1.2 * 1/aspect + Math.floor(i/50) * 0.07
        console.log(dotMesh.position.y)
        dotMesh.position.z = 1
        scene.add(dotMesh)
        dotMeshes.push(dotMesh)
    }

    //Add objects to scene
    scene.add(BackgroundPlaneMesh)

    camera.position.z = 2.0

    let playbackTime = 0

    let startFrameTime = new Date()
    let endFrameTime = new Date()
    function render(){
        endFrameTime = new Date()
        playbackTime += (endFrameTime - startFrameTime)/1000
        renderer.render(scene, camera)
        BackgroundPlaneMaterial.uniforms.u_mouse.value.x = pointer.x
        BackgroundPlaneMaterial.uniforms.u_mouse.value.y = pointer.y
        BackgroundPlaneMaterial.uniforms.u_time.value = playbackTime
        
        startFrameTime = endFrameTime
        requestAnimationFrame(render)
    }

    function onWindowResize(){
        renderer.setSize(window.innerWidth, window.innerHeight)
        aspect = window.innerWidth/window.innerHeight

        BackgroundPlaneMaterial.uniforms.u_resolution.value.x = window.innerWidth
        BackgroundPlaneMaterial.uniforms.u_resolution.value.y = window.innerHeight
        BackgroundPlaneMaterial.uniforms.u_aspect.value = aspect
    }

    function onPointerMove(event){
        pointer.x = event.clientX
        pointer.y = window.innerHeight - event.clientY
    }

    window.addEventListener("resize", onWindowResize)

    window.addEventListener("pointermove", onPointerMove)

    render()
}
export default renderMainCanvas

