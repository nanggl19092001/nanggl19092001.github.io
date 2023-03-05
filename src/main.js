import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';



function renderMainCanvas(){
    const pointer = new Vector2()
    const canvasDiv = document.getElementById("canvas")
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvasDiv.offsetWidth, canvasDiv.offsetHeight)
    renderer.setClearColor("#141414", 0.0)
    canvasDiv.appendChild(renderer.domElement)

    const canvasWidth = renderer.domElement.width
    const canvasHeight = renderer.domElement.height

    let rect = renderer.domElement.getBoundingClientRect()

    camera.position.z = 43;

    const CubeGeometry = new THREE.PlaneGeometry(1,1)
    const CubeMaterial = new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: `
            uniform vec2 u_mouse;
            uniform vec2 u_resolution;

            void main(){
                float distanceXY = distance(u_mouse/u_resolution, position.xy);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x + distanceXY, position.y + distanceXY, position.z, 1.0);            
            }`,
            fragmentShader: `
                void main(){
                    gl_FragColor = vec4(0.45, 1.0, 0.2, 0.3);
                }
            `,
            uniforms: {
                u_mouse: new THREE.Uniform(new THREE.Vector2(pointer.x, pointer.y)),
                u_resolution: new THREE.Uniform(new THREE.Vector2(canvasWidth, canvasHeight))
            }
    })

    for(let i = 0; i < 50; i++){
        const CubeMesh = new THREE.Mesh(CubeGeometry, CubeMaterial);

        CubeMesh.position.x = THREE.MathUtils.randFloat(-80, 80);
        CubeMesh.position.y = THREE.MathUtils.randFloat(-40, 40);

        scene.add(CubeMesh)
    }

    renderer.render(scene,camera)

    function animate(){
        requestAnimationFrame(animate)

        renderer.render(scene, camera);
    }

    function onPointerMove(event){
        pointer.x = event.clientX - rect.left
        pointer.y = - (event.clientY - rect.bottom)
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)

    animate()
}

export default renderMainCanvas

