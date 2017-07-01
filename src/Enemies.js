import Particle from './Particles';
import {enemyVertices, randomNumBetween} from './helperFunctions';

class Enemy {
    constructor(args){
        this.type = args.type
        this.position = args.position
        this.speed = {
            x: randomNumBetween(-1.5, 1.5),
            y: randomNumBetween(-1.5, 1.5)
        }
        this.rotation = 0
        this.rotationSpeed = randomNumBetween(-1, 1)
//        this.radius = this.setRadius()
        this.create = args.create
        this.addScoreAndCoins = args.addScoreAndCoins
        this.setRadius = function(){
            if(args.type === "Queen"){
                return 80
            }
            if(args.type === "Knight"){
                return 60
            }
            if(args.type === "Bishop"){
                return 40
            }
            if(args.type === "Rook"){
                return 25
            }
            if(args.type === "Pawn"){
                return 10
            }
        }
        this.radius = args.size 
        this.vertices = enemyVertices(8, args.size)
        this.score = (this.radius/10)*5;
        this.coins = (this.radius/10) * 100;
//        console.log(`this.score: ${this.score}, this.coins: ${this.coins}`)
        }
    
    destroy(){
        
        this.addScoreAndCoins(this.score, this.coins)
        
        
        this.delete = true;
        
        if(this.radius > 20){
            var count = 2;
            while(count >= 0){
                let enemy = new Enemy({
                    position: {
                        x: randomNumBetween(-10, 20)+this.position.x,
                        y: randomNumBetween(-10, 20)+this.position.y
                    },
                    size: this.radius - 20,
                    create: this.create.bind(this),
                    addScoreAndCoins: this.addScoreAndCoins.bind(this),
                    type: this.type.bind(this)
                })
                this.create(enemy, 'enemies');
                --count
            }
        
        } 
        
    }
    render(state){
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        
        this.rotation += this.rotationSpeed;
        if(this.rotation >= 360){
            this.rotation -= 360
        }
        if(this.rotation < 0){
            this.rotation += 360
        }
        
        if(this.position.x > state.screen.width + this.radius) {
            this.position.x = -this.radius
        }
        else if(this.position.x < -this.radius) {
            this.position.x = state.screen.width + this.radius
        }
        if(this.position.y > state.screen.height + this.radius) {
            this.position.y = -this.radius
        }
        else if(this.position.y < -this.radius) {
            this.position.y = state.screen.height + this.radius
        }
        
        const context = state.context;
        
        var img = new Image();
//        img.onload = function() {
//            context.drawImage(img, 0, 0);
//        } 
//        img.src = 'http://berlinfilmjournal.com/wp-content/uploads/2014/03/Nicholas-Cage-FaceOff-1997.jpg'
//        var aspect = img.height/img.width;
//        img.style.height = this.radius/2;
//        img.style.width = img.height/aspect;
//        var pat = context.createPattern(img, "no-repeat");
        
        img.src = 'https://4.bp.blogspot.com/-Q-lzLhIIHcM/UsoBTp_Q3EI/AAAAAAAAhQA/QbGV8g79Neo/s1600/ufo_lineart.png'
//        img.src = require('..../src/imgs/ufo.png')
        var aspect = img.height/img.width;
        img.style.height = this.radius/2;
        img.style.width = img.height/aspect;
            context.save();
            context.translate(this.position.x, this.position.y);
            context.rotate(this.rotation * Math.PI/180);
//            context.strokeStyle = '#FFFFFF';
//            context.fillStyle = '#FFFFFF';
//            context.lineWidth = 2;
            
//            context.globalCompositeOperation = "source-in";
//            context.beginPath();
//            context.moveTo(0, -this.radius);
//            for(var i = 1; i < this.vertices.length; i++){
//                context.lineTo(this.vertices[i].x, this.vertices[i].y)
//            }; 
//            
//            
//            context.closePath();
//            
//            context.fill();
//            context.stroke();
//            context.clip();
            context.translate(-this.radius/aspect, -this.radius);
            context.drawImage(img, 0, 0, this.radius/aspect * 2, this.radius * 2);
            context.translate(this.radius/aspect,  this.radius);
            context.restore();
    }
}

export default Enemy;