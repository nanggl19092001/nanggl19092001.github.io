import * as THREE from 'three';
import { TextureLoader, Vector2 } from 'three';

let currentPage = null
let theLetters = "abcdefghijklmnopqrstuvwxyz#%&^+=-";
let aboutMeText = "My name is Nguyen Huu Nang. A senior computer science student. with interest in back-end developement and computer graphics"

let aboutMeButton = document.getElementById("about-me-btn")
let skillButton = document.getElementById("skill-btn")
let projectButton = document.getElementById("project-btn")

function main() {
    const canvasDiv = document.getElementById('canvas-div')
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight, true)
    renderer.setClearColor("#f2f2f2")
    canvasDiv.appendChild(renderer.domElement)
    
    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let loadingTime = 2.0
    const loadingPlane = new THREE.PlaneGeometry(1.6, 0.02)
    const loadingPlaneMaterial = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: `
        varying vec2 f_uv;
        void main(){
            f_uv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
        fragmentShader: `
        varying vec2 f_uv;
        uniform float u_loadingTime;
        uniform vec2 u_resolution;
        void main(){
            float loadingValue = step(u_loadingTime/2.0, 1.0 - f_uv.x);
            gl_FragColor = vec4(0.7, 0.7, 0.7, loadingValue);
        }
        `,
        uniforms: {
            u_loadingTime: {type: 'f', value: loadingTime},
            u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        }
    })
    const loadingPlaneMesh = new THREE.Mesh(loadingPlane, loadingPlaneMaterial);

    const SphereGeometry = new THREE.SphereGeometry(2, 50, 50)
    const SphereMaterial = new THREE.ShaderMaterial({
        transparent:  true,
        vertexShader: `
        varying vec2 f_uv;
        uniform float u_time;
        uniform sampler2D u_texture;
        uniform vec2 u_mouseUv;
        void main() {

            vec3 newPos = position + normal*sin((position.x * position.y * position.z) * 10. + u_time) * 0.1;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
            f_uv = uv;
        }
        `,
        fragmentShader: `
        varying vec2 f_uv;
        uniform vec2 u_resolution;
        uniform sampler2D u_texture;
        uniform float u_time;
        uniform vec2 u_mouse;

        void main() {
            float d = distance(gl_FragCoord.xy/u_resolution, u_mouse);
            vec3 color = vec3(1.0, 0.5, 0.5) * d;
            gl_FragColor = vec4(color, 0.6 * f_uv.x * f_uv.y);
        }
        `,
        uniforms: {
            u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            u_texture: {type: 't', value: new TextureLoader().load('./noise.png')},
            u_time: {type: 'f', value: 0},
            u_mouseUv: {type: 'v2', value: new Vector2(0.0, 0.0)},
            u_mouse: {type: 'v2', value: pointer}
        }
    })
    const SphereMesh = new THREE.Mesh(SphereGeometry, SphereMaterial)
    
    scene.add(SphereMesh)
    camera.position.z = 5;
    
    let startFrameTime = new Date()
    let endFrameTime = new Date()
    let startLoadingTime = new Date()
    let endLoadingTime = new Date()
    let deltaTime = (endFrameTime - startFrameTime)/1000
    let time = 0

    let playbackTime = 0

    function animate(){
        raycaster.setFromCamera( pointer, camera );

        const intersects = raycaster.intersectObjects( scene.children );

        if(intersects[0]){
            SphereMaterial.uniforms.u_mouseUv.value = intersects[0].uv
        }

        SphereMesh.rotation.x += 0.25 * deltaTime;
        SphereMesh.rotation.y += 0.25 * deltaTime;
        SphereMesh.rotation.z += 0.25 * deltaTime;

        endLoadingTime = new Date()
        endFrameTime = new Date()
        deltaTime = (endLoadingTime - startLoadingTime)/1000
        playbackTime += (endLoadingTime - startLoadingTime)/5000
        time = (endFrameTime - startFrameTime)/500
        if(loadingTime < 0){
            document.getElementById('root').style.display = 'flex'
            scene.add(SphereMesh)
            scene.remove(loadingPlaneMesh)
        }
        else{
            scene.remove(SphereMesh)
            scene.add(loadingPlaneMesh)
            loadingTime -= (endLoadingTime - startLoadingTime)/1000
            loadingPlaneMaterial.uniforms.u_loadingTime.value = loadingTime
        }
        SphereMaterial.uniforms.u_time.value = time
        startLoadingTime= endLoadingTime

        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }

    animate()


    function onPointerMove( event ) {

        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    window.addEventListener( 'pointermove', onPointerMove );

    function onWindowResize(){

        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize( window.innerWidth, window.innerHeight );
        
    }
    window.addEventListener( 'resize', onWindowResize, false );
}

aboutMeButton.addEventListener("click", () => {
    if(currentPage !== "about-me"){
        currentPage = "about-me"
        document.getElementById("about-me-content").style.display = "block"
        document.getElementById("about-me-content").textContent = ""
        document.getElementById("skill-content").style.display = "none"
        document.getElementById("project-content").style.display = "none"
        for(let i = 0; i < aboutMeText.length; i++){
            if(aboutMeText[i] === "."){
                document.getElementById("about-me-content").textContent += "\n"
            }
            else{
                document.getElementById("about-me-content").textContent += aboutMeText[i]
            }
        }
    }
})

skillButton.addEventListener("click", () => {
    if(currentPage !== "skill"){
        currentPage = "skill"
        document.getElementById("about-me-content").style.display = "none"
        document.getElementById("skill-content").style.display = "block"
        document.getElementById("project-content").style.display = "none"
    }
})

projectButton.addEventListener("click", () => {
    if(currentPage !== "project"){
        currentPage = "project"
        document.getElementById("about-me-content").style.display = "none"
        document.getElementById("skill-content").style.display = "none"
        document.getElementById("project-content").style.display = "block"
    }
})

main()

