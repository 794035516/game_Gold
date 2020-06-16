var FrameAnim = require("FrameAnim");

const Collision = {
    Hook: 'hook',
    Item: 'item',
    Bomb: 'bomb',
}

cc.Class({
    extends: cc.Component,
    /*
    炸弹唯一的作用就是被钩子触碰到引发爆炸，不会被绵阳以及黄金钻石触发爆炸
    炸弹具有爆炸范围和爆炸方法，爆炸动画实现
    */
    properties: {
        // 爆炸范围
        bombRadius: {
            type: cc.Integer,
            default: 50,
        },
        width: {
            type: cc.Integer,
            default: 100,
        },
        height: {
            type: cc.Integer,
            default: 100,
        },
        //为了方便测试，以后需要改成摧毁
        score: {
            type: cc.Integer,
            default: 0,
        }
    },

    init: function (game, script) {
        this.game = game;
        this.is_collision = false;
        // this.anim = this.getComponent(cc.Animation);
        // bomb_fire.clip 是炸弹的火花动画，small_bomb.clip是炸弹被碰撞的动画
        // this.play_anim(1);
        //观察碰撞盒
        this.bombAnimation();
        // this.bombDestroy();
    },

    // onLoad () {},
    setSize: function () {
        this.node.width = this.width;
        this.node.height = this.height;
    },
    //启动碰撞检测器
    onLoad() {
    },

    // 炸弹具有的方法，将周围一定范围的物体全部炸毁
    bombDestroy: function () {
        // let collider = this.getComponent(cc.PolygonCollider);
        // this.node.opacity = 0;
        if (this.node.name == 'Bomb') {
            this.node.scaleX = 4;
            this.node.scaleY = 4;
        } else if (this.node.name == 'Grenade') {
            this.node.width = 30;
        }
        this.is_collision = true;
        // console.log('!!!!!   ', this.anim.duration)
        // console.log('!!!!!   ', this.anim)

        this.anim.play_once(null);
        this.scheduleOnce(function () {
            this.node.destroy();
        }, 1)
    },

    bombAnimation: function () {
        this.anim = this.getComponent(FrameAnim)
        // let collider = this.node
    },

    /*
        炸弹只对物品起作用,但是羊不能主动触发炸弹效果
        //补充：炸弹也可以引爆其他炸弹
    */
    onCollisionStay: function (other, self) {
        if ((other.node.name == 'Sheep' || other.node.name == 'SheepGetDiamond') && this.node.scaleX > 1) {
            other.node.destroy();
        }
    },

    onCollisionEnter: function (other, self) {
        // console.log(`Bomb:onCollisionEnter  ${other.node.name},${self.node.name},${this.is_collision}`)
        // if ((other.node.name == 'Sheep' || other.node.name == 'SheepGetDiamond') && this.node.scaleX == 1) {
        if (other.node.name == 'Sheep' || other.node.name == 'SheepGetDiamond' ) {
            return
        }
        // if(this.is_collision ){
        //     return;
        // }
        // console.log(other.node.name)
        if (other.node.group == Collision.Item) {
            other.node.destroy();
            this.bombDestroy();
        } else if (other.node.group == Collision.Hook || other.node.group == Collision.Bomb) {
            this.bombDestroy();
        } 
        // else if (other.node.group == Collision.Bomb) {
        //     this.bombDestroy();
        //     // console.log('other : ',other.node.anim.duration);
        // }
        // this.node.destroy();


    },

    start() {
        this.bombAnimation();
    },
    // update (dt) {},
});
