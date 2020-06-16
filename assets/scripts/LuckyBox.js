/*
Gold都很重
Grenade可能是Weight.Zero,可能很重Weight.Hell,Weight.Medium，Weight.Hell(1*2-1,2*2-1，3*2-1,4*2-1)
Power同上
*/
const Type = {
    Gold: 1,
    Grenade: 2,
    Power: 3,
}

const Item = {
    Grenade:'ItemGrenade',
    PowerJuice:'ItemPowerJuice',
    RockBook:'ItemRockBook',
    Grass:'ItemGrass',
    Diamond:'ItemDiamond'
}

//如果有幸运草，还需要添加666,888,移除25和33,111
const TypeGold = [25, 33, 111, 222, 333];
const LuckyGold = [280, 360, 520, 666, 888]

const Weight = {
    Stop: 0,
    Zero: 1,
    Light: 2,
    Medium: 3,
    Heavy: 5,
    Hell: 9,
}

/*
    幸运带可能随机黄金，有分数
    也可能是道具，手雷，力量
*/
cc.Class({
    extends: cc.Component,

    properties: {
        score: {
            type: cc.Integer,
            default: 0,
            tooltip: '幸运带的分数',
        },
        heavy: {
            type: cc.Integer,
            default: Weight.Zero,
        },
        content: {
            type: cc.Integer,
            default: Type.Gold,
        },
        luckyOrNot: {
            type: cc.Integer,
            default: 0,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    init(game) {
        this.game = game;
        this.content  = this.randomNum(3);
        this.score = 0;
        //测试，生成手雷
        // this.content = Type.Grenade
        //测试，生成黄金
        // this.content = Type.Gold
        //测试，生成力量
        // this.content = Type.Power;
        //localStorage.getItem获取的是字符串，需要转数字
        this.luckyOrNot = JSON.parse(localStorage.getItem(Item.Grass))
        // console.log(`LuckyBox:init  ${this.luckyOrNot}`)
        if (this.content == Type.Gold) {
            this.heavy = Weight.Hell;
            if (!this.luckyOrNot) {
                this.score = TypeGold[this.randomNum(5)-1]
                // console.log(`LuckyBox:init  000  ${this.score}`)
            } else {
                this.score = LuckyGold[this.randomNum(5)-1]
                // console.log(`LuckyBox:init  111  ${this.score}`)
            }
        } else {
            this.heavy = this.randomNum(4);
        }
        // console.log(`LuckyBox:init  ${this.content}  ${this.heavy}  ${this.score}`)
    },
    //num是3的时候生成类型
    //是4的时候根据类型分重量
    randomNum: function (num) {
        let temp = Math.ceil(Math.random() * 10 % num);
        if (num == 4) {
            temp = 2 * temp - 1;
        }
        return temp;
    },
    // onLoad () {},

    start() {
        this.init();
    },

    play_anim() {
        this.anim = this.getComponent('FrameAnim')    
        this.anim.play_once(null);
    },

    getGrenadeSprite() {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite)
        cc.loader.loadRes("item/grenade", cc.SpriteFrame, function (err, spriteFrame) {
            sprite.spriteFrame = spriteFrame;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            node.width = 8;
            node.height = 30;
        });
        // let realUrl = cc.url.raw('resources/item/grenade.png');
        // let texture = cc.textureCache.addImage(realUrl)
        // node.getComponent(cc.Sprite).spriteFrame.setTexture(texture)
        return node;
    },

    play_anim_grenade() {

    },
    // update (dt) {},
});
