import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';



function renderSphere(){
    const pointer = new Vector2()
    const canvasDiv = document.getElementById("about-me-cube")
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
    renderer.setClearColor("#141414", 0.0)
    canvasDiv.appendChild(renderer.domElement)

    let rect = renderer.domElement.getBoundingClientRect()

    const SphereGeometry = new THREE.SphereGeometry(30, 20, 20)
    const SphereMaterial = new THREE.ShaderMaterial({
        wireframe: true,
        vertexShader: `
        varying vec3 fPosition;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        float getDistance3D(vec3 pos1, vec3 pos2){
            return sqrt(pow(pos1.x - pos2.x, 2.0) + pow(pos1.y - pos2.y, 2.0) + pow(pos1.z - pos2.z, 2.0));
        }

        void main(){
            float normX = position.x/u_resolution.x;
            float normY = position.y/u_resolution.y;
            vec2 normMousePos = u_mouse/u_resolution;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
        }
        `,
        fragmentShader: `
        varying vec3 fPosition;

        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        float getDistance(vec2 pos1, vec2 pos2){
            return sqrt(pow(pos1.x - pos2.x, 2.0) + pow(pos1.y - pos2.y, 2.0));
        }

        void main(){
            vec2 normCoord = u_mouse/u_resolution;
            vec2 normPos = gl_FragCoord.xy/u_resolution;
            float currentDistance = getDistance(normCoord, normPos);
            gl_FragColor = vec4(0.45, 1.0, currentDistance * 2.0, 0.5);
        }
        `,
        uniforms:{
            u_resolution: new THREE.Uniform( new THREE.Vector2(renderer.domElement.width, renderer.domElement.height)),
            u_mouse: new THREE.Uniform(pointer)
        }
    })
    const SphereMesh = new THREE.Mesh(SphereGeometry, SphereMaterial)

    scene.add(SphereMesh)

    camera.position.z = 43;

    renderer.render(scene,camera)

    function animate(){
        requestAnimationFrame(animate)

        SphereMesh.position.x = 

        SphereMesh.rotation.x += 0.005;
        SphereMesh.rotation.y += 0.005;

        renderer.render(scene, camera);
    }

    function onPointerMove(event){
        pointer.x = event.clientX - rect.left
        pointer.y = - (event.clientY - rect.bottom)
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)

    animate()
}

export default renderSphere

