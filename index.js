import * as THREE from 'three';
import { TextureLoader, Vector2, Vector3 } from 'three';

let currentPage = null
let aboutMeText = "My name is Nguyen Huu Nang. A senior computer science student. with interest in back-end developement, computer graphics, IT industry in general"

let aboutMeButton = document.getElementById("about-me-btn")
let skillButton = document.getElementById("skill-btn")
let projectButton = document.getElementById("project-btn")

function main() {
    let aboutmeColor = new Vector3(1.0, 0.0, 0.0)
    let skillColor = new Vector3(1.0, 0.0, 1.0)
    let projectColor = new Vector3(0.0, 0.5, 1.0)

    let bugtrackerTexture = new TextureLoader().load('assets/img/bugtracker.png')
    let chatappTexture = new TextureLoader().load('assets/img/chatapp.png')
    let spaceInvaderTexture = new TextureLoader().load('assets/img/spaceinvader.png')
    let fadeInProject = false
    let currentHoverProject = ''
    let fadeInTime = 0

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

    //Project plane init
    const projectPlaneGeometry = new THREE.PlaneGeometry(4, 5)
    const projectPlaneMarterial = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader:`
        varying vec2 f_uv;
        void main() {
            f_uv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
        fragmentShader: `
        varying vec2 f_uv;
        uniform sampler2D u_texture;
        uniform float u_time;

        float random( float seed )
        {
            return fract( 543.2543 * sin( dot( vec2( seed, seed ), vec2( 3525.46, -54.3415 ) ) ) );
        }

        void main(){
            float shake_power = 0.01;
            
            float shake_rate = 0.2;
            
            float shake_speed = 1.0;
            
            float shake_block_size = 30.5;
            
            float shake_color_rate = 0.01;

            float enable_shift = float(
                random( trunc(u_time * shake_speed ) )
            <	shake_rate
            );
        
            vec2 fixed_uv = f_uv;
            fixed_uv.x += (
                random(
                    ( trunc( f_uv.y * shake_block_size ) / shake_block_size )
                +  u_time
                ) - 0.5
            ) * shake_power * enable_shift;
        
            vec4 pixel_color = textureLod( u_texture, fixed_uv, 0.0 );
            pixel_color.r = mix(
                pixel_color.r
            ,	textureLod( u_texture, fixed_uv + vec2( shake_color_rate, 0.0 ), 0.0 ).r
            ,	enable_shift
            );
            pixel_color.b = mix(
                pixel_color.b
            ,	textureLod( u_texture, fixed_uv + vec2( -shake_color_rate, 0.0 ), 0.0 ).b
            ,	enable_shift
            );
            gl_FragColor = pixel_color;
        }
        `,
        uniforms: {
            u_texture: {type: 't', value: bugtrackerTexture},
            u_time: {type: 'f', value: 1}
        }
    })
    const projectPlaneMesh = new THREE.Mesh(projectPlaneGeometry, projectPlaneMarterial)

    projectPlaneMesh.scale.x = 0
    projectPlaneMesh.scale.y = 0
    projectPlaneMesh.scale.z = 0

    //Loading bar init
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

    //Sphere Plane init
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

        uniform vec3 u_color;

        void main() {
            float d = distance(gl_FragCoord.xy/u_resolution, u_mouse);
            vec3 color = u_color * (1.0 - d);
            gl_FragColor = vec4(color, 0.8 * f_uv.x * f_uv.y);
        }
        `,
        uniforms: {
            u_color: {type: 'v3', value: aboutmeColor},
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

    //main render function
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

        projectPlaneMarterial.uniforms.u_time.value = time
        
        if(fadeInProject){
            scene.add(projectPlaneMesh)
            fadeInTime + deltaTime < 1 ? fadeInTime += deltaTime * 3 : fadeInTime = 1;
            projectPlaneMesh.scale.x = fadeInTime
            projectPlaneMesh.scale.y = fadeInTime
            
        }
        else{
            scene.remove(projectPlaneMesh)
        }

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
    window.addEventListener('resize', onWindowResize, false );

    function transitionProjectBugtracker(){
        fadeInProject = true
        currentHoverProject = "bugtracker"
        projectPlaneMarterial.uniforms.u_texture.value = bugtrackerTexture
    }

    function transitionOutProject(){
        fadeInProject = false
        fadeInTime = 0.0
        projectPlaneMarterial.uniforms.u_texture.value = spaceInvaderTexture
    }

    function transitionProjectChatapp(){
        fadeInProject = true
        currentHoverProject = "bugtracker"
        projectPlaneMarterial.uniforms.u_texture.value = chatappTexture
    }

    function transitionProjectSpaceInvader(){
        fadeInProject = true
        currentHoverProject = "bugtracker"
    }

    document.getElementById('bugtracker').addEventListener('mouseover', transitionProjectBugtracker)

    document.getElementById('chatapp').addEventListener('mouseover', transitionProjectChatapp)

    document.getElementById('spaceinvader').addEventListener('mouseover', transitionProjectSpaceInvader)

    document.getElementById('bugtracker').addEventListener('mouseout', transitionOutProject)

    document.getElementById('chatapp').addEventListener('mouseout', transitionOutProject)

    document.getElementById('spaceinvader').addEventListener('mouseout', transitionOutProject)

    aboutMeButton.addEventListener("click", () => {
        if(currentPage !== "about-me"){
            currentPage = "about-me"
            SphereMaterial.uniforms.u_color.value = aboutmeColor
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
            SphereMaterial.uniforms.u_color.value = skillColor
            document.getElementById("about-me-content").style.display = "none"
            document.getElementById("skill-content").style.display = "block"
            document.getElementById("project-content").style.display = "none"
        }
    })
    
    projectButton.addEventListener("click", () => {
        if(currentPage !== "project"){
            currentPage = "project"
            SphereMaterial.uniforms.u_color.value = projectColor
            document.getElementById("about-me-content").style.display = "none"
            document.getElementById("skill-content").style.display = "none"
            document.getElementById("project-content").style.display = "block"
        }
    })
}

main()

