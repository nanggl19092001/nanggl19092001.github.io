import * as THREE from 'three'
class Character {
    constructor(x, y){
        this.x = x
        this.y = y

        const geometry = new THREE.PlaneGeometry(1,1)
        const material = new THREE.MeshBasicMaterial({color: '#E84E41', side: THREE.DoubleSide})
        
        this.mesh = new THREE.Mesh(geometry, material)
    }

    move(xVal, yVal){
        this.x = this.x + xVal
        this.y = this.y + yVal

        // console.log("X:" + xVal)
        // console.log("Y:" + yVal)

        this.mesh.position.x = this.mesh.position.x + xVal
        this.mesh.position.y = this.mesh.position.y + yVal

    }

    collisionDetect(objects){
        let allowingDirection = {
            'up': true,
            'down': true,
            'left': true,
            'right': true
        }

        
            // this.x - 0.5 < objects[i].x + objects[i].width/2
            // && this.y - 0.5 < objects[i].y + objects[i].height/2
            // && this.x + 0.5 > objects[i].x - objects[i].width/2
            // && this.y + 0.5 > objects[i].y - objects[i].height/2

        for(let i = 0; i < objects.length; i++){
            let collideBot = (
                this.y - 0.5 >= objects[i].y - objects[i].height/2&&
                this.y - 0.5 <= objects[i].y + objects[i].height/2  + 0.1&&
                this.x - 0.5 < objects[i].x + objects[i].width/2 &&
                this.x + 0.5 > objects[i].x - objects[i].width/2
            )

            let collideTop = (
                this.y + 0.5 >= objects[i].y - objects[i].height/2 - 0.1&&
                this.y + 0.5 <= objects[i].y + objects[i].height/2&&
                this.x - 0.5 < objects[i].x + objects[i].width/2 &&
                this.x + 0.5 > objects[i].x - objects[i].width/2
            )

            let sideCollide = ((this.y - 0.5 < objects[i].y + objects[i].height/2 &&
                this.y - 0.5 > objects[i].y - objects[i].height/2) ||
                (this.y + 0.5 < objects[i].y + objects[i].height/2 &&
                this.y + 0.5 > objects[i].y - objects[i].height/2))

            let collideLeft = (
                this.x - 0.5 < objects[i].x + objects[i].width/2 + 0.1 && this.x - 0.5 > objects[i].x - objects[i].width/2
                &&
                sideCollide
            )

            let collideRight = (
                this.x + 0.5 > objects[i].x - objects[i].width/2 - 0.1 && this.x - 0.5 < objects[i].x - objects[i].width/2
                &&
                sideCollide
            )

            // if(this.x - 0.5 < objects[i].x + objects[i].width/2
            // && this.y - 0.5 < objects[i].y + objects[i].height/2
            // && this.x + 0.5 > objects[i].x - objects[i].width/2
            // && this.y + 0.5 > objects[i].y - objects[i].height/2)
            //     continue
            if(collideBot) allowingDirection.down = false
            if(collideTop) allowingDirection.up = false
            if(collideLeft) allowingDirection.left = false
            if(collideRight) allowingDirection.right = false
        }

        return allowingDirection
    }

    draw() {
        this.mesh.position.x = this.x
        this.mesh.position.y = this.y
        return this.mesh
    }
}

export default Character