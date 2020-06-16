
const Heavy = {
    Large: 10,
    Medium: 7,
    Small: 2,
    Mini: 1,
}
const Weight = {
    Stop: 0,
    Zero: 1,
    Light: 2,
    Medium: 3,
    Heavy: 5,
    Hell: 9,
}

cc.Class({
    extends: cc.Component,

    properties: {
        score: {
            type: cc.Integer,
            default: 50,
            tooltip: '黄金的价钱',
        },
        scale: {
            type: cc.Integer,
            default: 10,
            tooltip: '黄金大小'
        },
        heavy: {
            type: cc.Integer,
            default: Weight.Zero,
        },
        width: cc.Integer,
        height: cc.Integer,
    },
    init: function (game, type) {
        this.scale = type
        this.game = game;
        this.setSize();
        // console.log(`Gold:start  ${this.node.width}  ${this.node.height}`)
    },
    setSize: function () {
        this.node.scale = this.scale / 10;
        // console.log(`Gold:setSize  ${this.node.width * this.node.scale}  ${this.node.height * this.node.scale}`)
        //500
        if (this.scale == Heavy.Large) {
            this.heavy = Weight.Hell;
            this.score = 500;
        }
        //250
        else if (this.scale == Heavy.Medium) {
            this.heavy = Weight.Heavy;
            this.score = 250;
        }
        //100
        else if (this.scale == Heavy.Small) {
            this.heavy = Weight.Medium;
            this.score = 100;
        }
        //50
        else if (this.scale == Heavy.Mini) {
            this.heavy = Weight.Zero;
            this.score = 50;
        }

    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start() {},
    // update (dt) {},
});
