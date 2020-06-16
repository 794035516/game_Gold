var FrameAnim = require("FrameAnim");
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
        score:{
            type:cc.Integer,
            default:600,
            tooltip:'钻石的价钱',
        },
        heavy:{
            type:cc.Integer,
            default:Weight.Zero,
        }
    },
    init:function(game){
        this.game = game;
        this.Weight = Weight.Zero
    },
    //钻石被拾取到
    play_anim(){
        // console.log(anim_state);
        this.anim.play_once(null);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.anim = this.getComponent(FrameAnim);
        this.anim.duration = 0.3;
        // console.log(this,"this");
        // console.log(this.anim,"this.anim");
        // this.anim.play_loop();
    },

    // update (dt) {},
});
