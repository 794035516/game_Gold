const Type = {
    SmallStone : 1,
    LargeStone : 2,
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
 石头只会被炸弹炸毁，包含挖矿人丢的炸弹以及洞里的炸弹，
  或者被挖矿人挖去
 */
cc.Class({
    extends: cc.Component,

    properties: {
        score:{
            type:cc.Integer,
            default:10,
            tooltip:'石头的价值',
        },
        heavy:{
            type:cc.Integer,
            default:0,
            tooltip:'石头的重量',
        },
       
    },
    // LIFE-CYCLE CALLBACKS:
    // setSize:function(){
    //     this.node.width = this.width;
    //     this.node.height = this.height;
    // },
    // onLoad () {},
    
        
    //需要对game实现数据传递
    init:function(game,script,type){
        this.game = game;
        this.type = type;
        let nameTemp = this.node.name;
        if(nameTemp == 'SmallStone'){
            this.heavy = Weight.Medium
            this.score = 15;
        }else if(nameTemp == 'Stone'){
            this.heavy = Weight.Hell
            this.score = 35;
        }
    },

    onLoad () {
        // if(this.type == Type.Smallstone){
        //     this.score = 10;
        // }else{
        //     this.score = 35;
        // }
    },

    start(){
        this.init();
    },

    update (dt) {
    },
});
