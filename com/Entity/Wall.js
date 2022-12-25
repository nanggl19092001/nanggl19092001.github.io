import * as THREE from 'three'

class Wall {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        const geometry = new THREE.PlaneGeometry(width,this.height)
        const material = new THREE.MeshBasicMaterial({color: '#660000', side: THREE.DoubleSide})

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = x
        mesh.position.y = y

        this.mesh = mesh
    }

    draw(){
        return this.mesh
    }
}

export default Wall