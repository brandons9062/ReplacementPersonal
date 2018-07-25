import React, {Component} from 'react';
import {connect} from 'react-redux';
import Ship from './Ships';
import Enemy from './Enemies';
import {randomNumBetweenExcluding} from './helperFunctions';
import {addUserPointsAndCoins, authUser, getUser} from './actions';


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
                ratio: window.devicePixelRatio || 1,
            },
            context: null,
            keys: {
                left: 0,
                right: 0,
                up: 0,
                down: 0,
                space: 0
            },
            enemyCount: 3,
            currentScore: 0,
            topScore: 0,
            inGame: false,
            coinsEarned: 0,
            totalCoins: 0
        }
        this.ship = [];
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
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
                ratio: window.devicePixelRatio || 1,
            }
        })
    }
    
    
    componentDidMount() {
        window.addEventListener('keyup', this.handleKeys.bind(this, false))
        window.addEventListener('keydown', this.handleKeys.bind(this, true))
        window.addEventListener('resize', this.handleResize.bind(this, false))
        
        const context = this.refs.canvas.getContext('2d');
        this.setState({context: context});
//        console.log(this.props.users);
        
        
        this.startGame();
        
        
        requestAnimationFrame(() => {this.update()});
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleKeys);
        window.removeEventListener('resize', this.handleKeys);
        window.removeEventListener('resize', this.handleResize);
    }
    
    update() {
        const context = this.state.context;
        const keys = this.state.keys;
        const ship = this.ship[0];
        
        context.save();
        context.scale(this.state.screen.ratio, this.state.screen.ratio);
        
        var backgroundImg = new Image();
        backgroundImg.src = 'http://getwallpapers.com/wallpaper/full/b/f/9/16392.jpg';


        //context.fillStyle = '#000';
        context.globalAlpha = 0.4;
        //context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.drawImage(backgroundImg, 0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;
       
        this.updateObjects(this.particles, 'particles');
        this.updateObjects(this.ship, 'ship');
        this.updateObjects(this.bullets, 'bullets');
        this.updateObjects(this.enemies, 'enemies');


        if(this.enemies.length < 1){
            let count = this.state.enemyCount + 1;
            this.setState({enemyCount: count});
            this.sendEnemies(count);
        }
        
        this.collisionCheckWith(this.ship, this.enemies);
        this.collisionCheckWith(this.bullets, this.enemies);
        
        if(this.props.users.id){
            this.setState({
                topScore: this.props.users.highscore,
                totalCoins: this.props.users.totalcoins
            })
        }

        
        context.restore();
        
        requestAnimationFrame(() => {this.update()});
    }
    
    addScoreAndCoins(points, coins){
        if(this.state.inGame){
            this.setState({
                currentScore: this.state.currentScore + points,
                coinsEarned: this.state.coinsEarned + coins
            });
        }
    }
    
    startGame() {
        console.log(`this.props.users.id: ${this.props.users.id}`)
//        if(!this.props.users.id){
           this.props.authUser();
            
//        }else{
//            this.props.getUser(this.props.users.id)
//            
//            
//        }
        this.setState({
            inGame: true,
            currentScore: 0,
            coinsEarned: 0
        });
        
        let ship = new Ship({
            position: {
                x: this.state.screen.width/2,
                y: this.state.screen.height/2
            },
            create: this.createObject.bind(this),
            onDead: this.endGame.bind(this)
        })
        this.createObject(ship, 'ship');
        
        this.enemies = [];
        this.sendEnemies(this.state.enemyCount);
    }
    

    endGame() {
        if(this.state.currentScore > this.state.topScore){
            this.setState({
                topScore: this.state.currentScore
            })
        }
        var newCoins = this.state.coinsEarned + this.state.totalCoins;
        
        console.log(`NEW TOTAL COINS: ${newCoins}`)
        
        this.setState({
            inGame: false,
            totalCoins: newCoins
        });
//        console.log(`this.state.totalcoins: ${this.state.totalCoins}`)
//        console.log(`this.state.topScore: ${this.state.topScore}`)
        console.log(this.props.users)
        
        this.props.addUserPointsAndCoins(this.props.users.id, this.state.topScore, newCoins);
    }
    
    sendEnemies(num){
        let enemies = [];
        let ship = this.ship[0];
        for(var i = 0; i < num; i++){
            var enemy = new Enemy({
                position: {
                    x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x - 60, ship.position.x + 60),
                    y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y - 60, ship.position.y + 60)
                },
                size: 80,
                create: this.createObject.bind(this),
                addScoreAndCoins: this.addScoreAndCoins.bind(this),
                type: this.setType.bind(this)
            })
            this.createObject(enemy, 'enemies');
        }
    }
    
    setType(){
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
    
    createObject(object, type){
        this[type].push(object);
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
        if(objects1 === this.ship){
            ships = true;
        } else if(objects1 === this.bullets){
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
                        obj1.destroy()
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
        let coinsmessage = `Coins Earned: ${this.state.coinsEarned}`;
        if(this.state.currentScore > this.state.topScore){
            scoremessage = `New High Score: ${this.state.currentScore}`;
        } else{
            scoremessage = `Score: ${this.state.currentScore}`;
        }
        
        if(!this.state.inGame){
            gameover = (
                <div className="endgame">
                    <p>Game Over!</p>
                    <p>{scoremessage}</p>
                    <p>{coinsmessage}</p>
                    <button onClick={this.startGame.bind(this)}>
                        Retry?
                    </button>
                </div>
            );
        };
        
        
        return (
            <div>
                {gameover}
                <span className="score current-score">Score: {this.state.currentScore}</span>
                <span className="score top-score">Top Score: {this.state.topScore}</span>
                <span className="score current-coins">Coins Earned: {this.state.coinsEarned}</span>
                <canvas ref="canvas" width={this.state.screen.width * this.state.screen.ratio} height={this.state.screen.height * this.state.screen.ratio} />
            </div>
        );
    }
}
function mapStateToProps(state){
    return {users: state.users};
}


export default connect(mapStateToProps, {addUserPointsAndCoins, authUser, getUser})(MainGame);