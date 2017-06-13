import Bullet from './Bullets';
import Particle from './Particles';
import {rotatePoint, randomNumBetween} from './helperFunctions';

class Ship {
    constructor(args){
        this.position = args.position
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.rotationSpeed = 6
        this.speed = 0.15
        this.inertia = 0.99
        this.radius = 20
        this.lastShot = 0
        this.create = args.create
        this.onDead = args.onDead
    }
    
    destroy(){
        this.delete = true
        this.onDead();
    }
    
    rotate(direction){
        if(direction === "LEFT"){
            this.rotation -= this.rotationSpeed
        }
        if(direction === "RIGHT"){
            this.rotation += this.rotationSpeed
        }
    }
    
    accelerate(val){
        this.velocity.x -= Math.sin(-this.rotation*Math.PI/180) * this.speed;
        this.velocity.y -= Math.cos(-this.rotation*Math.PI/180) * this.speed;
    }
    
    render(state) {
        if(state.keys.up){
            this.accelerate(1)
        }
        if(state.keys.left){
            this.rotate("LEFT")
        }
        if(state.keys.right){
            this.rotate("RIGHT")
        }
        if(state.keys.space && Date.now() - this.lastShot > 300){
            const bullet = new Bullet({
                ship: this
            })
            this.create(bullet, 'bullets')
            this.lastShot = Date.now()
        }
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.x *= this.inertia
        this.velocity.y *= this.inertia
        
        if(this.rotation >= 360){
            this.rotation -= 360
        }
        if(this.rotation < 0){
            this.rotation += 360
        }
        
        if(this.position.x > state.screen.width) {
            this.position.x = 0
        } else if(this.position.x < 0) {
            this.position.x = state.screen.width
        }
        if(this.position.y > state.screen.height){
            this.position.y = 0
        } else if(this.position.y < 0) {
            this.position.y = state.screen.height
        }
        
        const context = state.context
        
        var img = new Image();
        img.src = 'https://cynet-web.com/wp-content/uploads/2015/05/SEO-SPACESHIP-ICON-CYNET-white-250px.png'
        var aspect = img.height/img.width;
        img.style.height = this.radius/2;
        img.style.width = img.height/aspect;
        
        context.save()
        context.translate(this.position.x, this.position.y)
        context.rotate(this.rotation * Math.PI/180)
        context.strokeStyle = '#FFFFFF'
//        context.fillStyle = '#FFFFFF'
        context.lineWidth = 2
        context.beginPath()
        context.moveTo(0, -15) 
        context.lineTo(10, 10)
        context.lineTo(5, 7)
        context.lineTo(-5, 7)
        context.lineTo(-10, 10)
        context.closePath()
//        context.fill()
        context.stroke()
        context.clip();
        context.translate(-this.radius/aspect, -this.radius);
        context.drawImage(img, 0, 0, this.radius/aspect * 2, this.radius * 2);
        context.translate(this.radius/aspect,  this.radius);
        context.restore()
        
    }
}

export default Ship;