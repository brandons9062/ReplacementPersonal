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
        console.log(`this.score: ${this.score}, this.coins: ${this.coins}`)
        }
    
    destroy(){
        
        this.addScoreAndCoins(this.score, this.coins)
        
        
        this.delete = true;
        
        if(this.radius > 20){
            let enemy = new Enemy({
                position: this.position,
                size: this.radius - 20,
                create: this.create.bind(this),
                addScoreAndCoins: this.addScoreAndCoins.bind(this),
                type: this.type.bind(this)
            })
            this.create(enemy, 'enemies');
        
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
        
        
            context.save();
            context.translate(this.position.x, this.position.y);
            context.rotate(this.rotation * Math.PI/180);
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(0, -this.radius);
            for(var i = 1; i < this.vertices.length; i++){
                context.lineTo(this.vertices[i].x, this.vertices[i].y)
            };
            context.closePath();
            context.stroke();
            context.restore();
    }
}

export default Enemy;