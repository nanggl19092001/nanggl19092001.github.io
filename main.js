import * as THREE from 'three';
import { Vector3 } from 'three';


function render(){
    const canvasDiv = document.getElementById("about-me-cube")
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
    renderer.setClearColor("#141414", 1.0)
    canvasDiv.appendChild(renderer.domElement)

    const SphereGeometry = new THREE.SphereGeometry(30, 20, 20)
    const SphereMaterial = new THREE.ShaderMaterial({
        wireframe: true,
        vertexShader: `
        varying vec3 fPosition;
        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
            fPosition = gl_Position.xyz;
        }
        `,
        fragmentShader: `
        varying vec3 fPosition;

        void main(){
            gl_FragColor = vec4(57/255, 1.0, 20/255, 1.0);
        }
        `,
        uniforms:{
            resolution: new THREE.Uniform( new THREE.Vector2(canvasDiv.offsetWidth, canvasDiv.offsetHeight))
        }
    })
    const SphereMesh = new THREE.Mesh(SphereGeometry, SphereMaterial)

    scene.add(SphereMesh)

    camera.position.z = 43;

    renderer.render(scene,camera)

    function animate(){
        requestAnimationFrame(animate)

        SphereMesh.rotation.x += 0.01;
        SphereMesh.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    animate()
}

export default render

