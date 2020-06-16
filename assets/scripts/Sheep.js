const ObjectType = {
    Sheep: 1,
    SheepGetDiamond: 2,
}

const Weight = {
    Stop: 0,
    Zero: 1,
    Light: 2,
    Medium: 3,
    Heavy: 5,
    Hell: 7,
}
/*
该脚本需要完成的功能是：
    绵阳走来走去
    与钩子的触碰处理

*/

cc.Class({
    extends: cc.Component,
    //定义一个左右移动的物体，左右有最大限制，可以被抓取，被抓可能有两种，
    // 一种被勾走获得积分， 一种触发爆炸

    properties: {
        //move speed
        moveSpeed: 0,
        maxMovation: 0,
        //object type ,maybe be captured or exploded
        width: cc.Integer,
        height: cc.Integer,
        objectType: {
            type: cc.Integer,
            default: ObjectType.Sheep,
            tooltip: '绵羊是否抓着钻石',
        },
        score: {
            type: cc.Integer,
            default: 2,
            tooltip: '绵羊的价值',
        },
        heavy:{
            type:cc.Integer,
            default:Weight.Zero
        }
    },

    direction_change: function () {
        this.dir = (this.dir + 1) % 2;
    },

    // LIFE-CYCLE CALLBACKS:
    flipX_Game: function () {
        // 图片默认是头朝左边边
        var bool = this.dir == 1 ? true : false;
        var flipXAction = cc.flipX(bool);
        this.node.runAction(flipXAction);
        // cc.log("flip");
    },
    // 返回当前绵阳的位置
    getPosition: function () {
        return cc.v2(this.node.x, this.node.y);
    },
    // 绵阳在挖矿人的下面，这里用（800，800）默认为挖矿人的位置

    setSize: function () {
        this.node.width = this.width;
        this.node.height = this.height;
    },
    setSpeed: function () {
        this.moveSpeed = 40;
        this.maxMovation = 200;
    },
    // 配合update()使用
    delayGame: function () {
        this.do_enable = false;
        // console.log(`Sheep:delayGame aaaaaaaa`)
        // this.wait();
    },
    onStartGame: function () {
        // 用来处理是否执行update函数
        this.do_enable = true;
        this.walk();
    },
    walk:function(){
        this.armatureDisPlay.walk();
    },

    wait:function(){
        this.armatureDisPlay.wait();
    },
    //初始化长宽，速度，分数
    init: function (game,  type) {
        this.game = game;
        this.getObject();
        this.heavy = Weight.Zero
        // console.log('Sheep:init  ',this.node.name)
        console.log(this.score)
        if(this.objectType == ObjectType.SheepGetDiamond){
            this.score += 600;
        }
        // console.log(this.score)
    },
    getArmature: function () {
        //获取 ArmatureDisplay
        this.armatureDisPlay = this.getComponent('SheepAnim')
    },

   getObject(){
       if('SheepGetDiamond' == this.node.name){
        //    console.log(`Sheep:getObject  ${this.node.name}`)
           this.objectType = 2;
       }else{
           this.objectType = 1;
       }
   },
    
    //initialize 
    onLoad: function () {},
    
    start() {
        this.getArmature();
        this.score = 2;
        // console.log(`Sheep:start  ${this.score}`)
        this.init(1,1);
        // console.log(`Sheep:start  ${this.score}`)
        // this.getAnim();
        // console.log(`sheep  ${ this.node.name } ${this.anim.test}`)
        // console.log(111111 ,this.anim.test);
        // 0 explain left , 1 explain right
        // 随机定义绵羊方向
        this.dir = Math.floor(Math.random() * 2);
        // explain that its 0 move
        // 随机定义绵阳已走过的路程
        this.movation = Math.random() * this.maxMovation;
        this.captured = false;
        this.do_enable = false;
        this.width = 40;
        this.height = 40;
        this.setSize();
        this.setSpeed();
        // if (this.objectType == ObjectType.SheepGetDiamond) {
        //     this.score = Diamond.score + this.score;
        // }
        this.onStartGame();
        this.begin = 0;
    },

    update(dt) {
        // console.log(`update : ,${this.armatureDisPlay} ,${this.node.name}`)
        if (this.do_enable == false) {
            return;
        }else if(this.captured == true){
            return;
        }
        if (this.begin == 0) {
            // 初始化方向
            this.wait();
            this.flipX_Game();
            this.begin += 1;
        }

        let temp = this.moveSpeed * dt;
        if (this.movation + temp < this.maxMovation) {
            let mov = temp;
            if(this.dir == 0){
                mov = -1 * temp;
            }
            let act = cc.moveBy(dt,mov,0);
            this.node.runAction(act);
            // this node move left or right
            //this.dir == 0 ? this.node.x -= temp : this.node.x += temp;
            this.movation += temp;
            this.walk();
        }
        else {
            this.movation = 0;
            // change this.dir 
            this.direction_change();
            // cc.flipX
            this.flipX_Game();
            //  绵阳在最左最右的时候停留一段时间的处理
            this.delayGame();

            this.scheduleOnce(this.onStartGame, 4);
        }
        // console.log(`sheep  update  ${this.anim.test}`)
    },

});
