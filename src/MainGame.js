import React, {Component} from 'react';
import {randomNumBetweenExcluding} from './helperFunctions';
import Enemy from './Enemies';


const KEY = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    SPACE: 32
}

class MainGame extends Component {
    constructor(){
        super();
        this.state = {
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
                ration: window.devicePixelRation || 1,
            },
            context: null,
            keys: {
                left: 0,
                right: 0,
                up: 0,
                down: 0,
                space: 0
            },
            enemyCount: 1,
            currentScore: 0,
//            topScore:,
            inGame: false,
            coinsEarned: 0,
//            totalCoins:
        }
        this.ship = [];
        this.enemies = [];
        this.bullets = [];
        this.dust = [];
    }
    
    handleKeys(value, e){
        let keys = this.state.keys;
        if(e.keyCode === KEY.LEFT) {keys.left = value}
        if(e.keyCode === KEY.RIGHT) {keys.right = value}
        if(e.keyCode === KEY.UP) {keys.up = value}
        if(e.keyCode === KEY.DOWN) {keys.down = value}
        if(e.keyCode === KEY.SPACE) {keys.space = value}
        this.setState({
            keys: keys
        })
    }
    
    handleResize(value, e){
        this.setState({
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
                ration: window.devicePixelRation || 1,
            }
        })
    }
    
    componentDidMount() {
        window.addEventListener('keyup', this.handleKeys.bind(this, false))
        window.addEventListener('keydown', this.handleKeys.bind(this, true))
        window.addEventListener('resize', this.handleResize.bind(this, false))
        const context = this.refs.canvas.getContext('2d')
        this.setState({context: context})
        this.startGame()
        requestAnimationFrame(() => this.update)
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleKeys)
        window.removeEventListener('resize', this.handleKeys)
        window.removeEventListener('resize', this.handleResize)
    }
    
    update() {
        const context = this.state.context
        const keys = this.state.keys
        const ship = this.ship[0]
        context.save()
        context.scale(this.state.screen.ratio, this.state.screen.ratio)
        
        if(this.enemies.length < 1){
            let count = this.state.enemyCount + 1;
            this.setState({enemyCount: count})
            this.sendEnemies(count)
        }
        
        this.collisionCheckWith(this.ship, this.enemies)
        this.collisionCheckWith(this.bullets, this.enemies)
        
        this.updateObjects(this.ship, 'ship')
        this.updateObjects(this.bullets, 'bullets')
        this.updateObjects(this.enemies, 'enemies')
        
        context.restore()
        
        requestAnimationFrame(() => {this.update()})
    }
    
    addScoreAndCoins(points, coins){
        if(this.state.inGame){
            this.setState({
                currentScore: this.state.currentScore + points,
                coinsEarned: this.state.coinsEarned + coins
            })
        }
    }
    
    startGame() {
        this.setState({
            inGame: true,
            currentScore: 0,
            coinsEarned: 0
        })
        
        let ship = new Ship({
            position: {
                x: this.state.screen.width/2,
                y: this.state.screen.height/2
            },
            create: this.createObject.bind(this),
            onDead: this.endGame.bind(this)
        })
        this.createObject(ship, 'ship')
        
        this.enemies = []
        this.sendEnemies(this.state.enemyCount)
    }
    
    endGame() {
        this.setState({
            inGame: false,
//            topScore: ,
            totalCoins: this.state.totalCoins + this.state.coinsEarned
        })
    }
    
    sendEnemies(number){
        let enemies = []
        let ship = this.ship[0]
        for(var i = 0; i < number; i++){
            let enemy = new Enemy({
                position: {
                    x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x - 60, ship.position.x + 60),
                    y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y - 60, ship.position.y + 60)
                },
                create: this.createObject.bind(this),
                addScoreAndCoins: this.addScoreAndCoins.bind(this),
                type: function(){
                    var min = 0;
                    var max = 10;
                    var chance = Math.floor(Math.random() * (max - min)) + min;
                    if(this.state.currentScore >= 500 && chance <= 2){
                        return 'Queen'
                    }
                    if(this.state.currentScore >= 350 && chance <= 3){
                        return 'Knight'
                    }
                    if(this.state.currentScore >= 200 && chance <= 4){
                        return 'Bishop'
                    }
                    if(this.state.currentScore >= 50 && chance <= 5){
                        return 'Rook'
                    }
                    return 'Pawn'
                }
            })
            this.createObject(enemy, 'enemy')
        }
    }
    
    createObject(object, type){
        this[type].push(object)
    }
    
    updateObjects(objects, type){
        let index = 0
        for(var obj of objects){
            if(obj.delete){
                this[type].splice(index, 1)
            } else {
                objects[index].render(this.state)
            }
            index++;
        }
    }
    
    collisionCheckWith(objects1, objects2){
        let ships;
        let bullets;
        if(objects1 == this.ship){
            ships = true;
        } else if(objects1 == this.bullets){
            bullets = true;
        }
        let a = objects1.length - 1
        let b;
        while(a >= 0){
            b = objects2.length - 1
            while(b >= 0){
                let obj1 = objects1[a]
                let obj2 = objects2[b]
                if(this.collisionChecker(obj1, obj2)){
                    if(ships){
                        obj1.destroy()
                    } else if(bullets){
                        obj2.destroy()
                    }
                }
                --b
            }
            --a
        }
    }
    
    collisionChecker(obj1, obj2){
        let nx = obj1.position.x - obj2.position.x
        let ny = obj1.position.y - obj2.position.y
        let length = Math.sqrt(nx * nx + ny * ny)
        if(length < obj1.radius + obj2.radius){
            return true
        }
        return false
    }
    
    render(){
        let gameover;
        let scoremessage;
        let coinsmessage = `Coins Earned: ${this.state.coinsEarned}`
        if(this.state.currentScore > this.state.topScore){
            scoremessage = `New High Score: ${this.state.currentScore}`
        } else{
            scoremessage = `Score: ${this.state.currentScore}`
        }
        
        if(!this.state.inGame){
            gameover = (
                <div>
                    <h2>Game Over!</h2>
                    <h5>{scoremessage}</h5>
                    <h5>{coinsmessage}</h5>
                    <button className="btn btn-primary" onClick={this.startGame.bind(this)}>
                        Retry?
                    </button>
                </div>
            )
        }
        
        
        return (
            <div>
                {gameover}
                <div>Score: {this.state.currentScore}</div>
                <div>Coins Earned: {this.state.coinsEarned}</div>
                <canvas ref="canvas" width={this.state.screen.width * this.state.screen.ratio} height={this.state.screen.height * this.state.screen.ratio} />
            </div>
        );
    }
}

export default MainGame;