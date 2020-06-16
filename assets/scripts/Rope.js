var FrameAnim = require("FrameAnim");

const Item = {
    Grenade: 'ItemGrenade',
    PowerJuice: 'ItemPowerJuice',
    RockBook: 'ItemRockBook',
    Grass: 'ItemGrass',
    Diamond: 'ItemDiamond'
}

//绳索状态
const Type = {
    Gold: 1,
    Grenade: 2,
    Power: 3,
}

const Status = {
    Idle: 1,
    Shoot: 2,
    Back: 3,
    BackWithTarget: 4,
    Stop: 5,
}

//碰撞类型
const Collision = {
    Hook: 'hook',
    Item: 'item',
    Bomb: 'bomb',
}

//勾到的物体重量，用来设置绳索速度
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
        ropeHeader: {
            type: cc.Node,
            default: null,
            tooltip: '绳索头',
        },
        ropeBody: {
            type: cc.Node,
            default: null,
            tooltip: '绳索',
        },
        wSpeed: {
            type: cc.Integer,
            default: 120,
            tooltip: '绳索角速度',
        },
        wdirection: {
            type: cc.Integer,
            default: 1,
            tooltip: '绳索摆动角度的方向,1表示逆时针,-1表示顺时针',
        },
        backNormalSpeed: {
            type: cc.Integer,
            default: 2000,
            tooltip: '绳索回来的一般速度'
        },
        backRealSpeed: {
            type: cc.Integer,
            default: 2500,
            tooltip: '绳索回来的实际速度'
        },
        angle: {
            type: cc.Integer,
            default: 0,
            visible: false,
        },
        maxAngle: {
            type: cc.Integer,
            default: 120,
            tooltip: '绳子摇晃的最大角度',
        },
        maxRopeLen: {
            type: cc.Integer,
            default: 550,
            tooltip: '绳索最长的长度',
        },
        minRopeLen: {
            type: cc.Integer,
            default: 80,
            tooltip: '绳索最短的长度',
        },
        // everyRopeLen: {
        //     type: cc.Integer,
        //     default: 1000,
        //     tooltip: '绳索变化的长度，如每次增加1000或每次减少1000',
        // },
        state: {
            type: cc.Integer,
            default: Status.Idle,
            tooltip: '绳索状态',
        },
        // heavy: {
        //     type: cc.Integer,
        //     default: Weight.Zero,
        //     visible: false,
        // },
        is_collision: {
            type: cc.Integer,
            default: 1,
            visible: false,
        }
    },

    setRopeLength: function (len) {
        this.ropeBody.height = len;
        this.ropeHeader.y = this.ropeBody.y - this.ropeBody.height;
        // console.log(this.ropeBody.y,this.ropeBody.height,this.ropeHeader.height / 2,this.ropeHeader.y);
    },
    ropeSpeed(type, dt) {
        // console.log(`ropeSpeed : ${type}  `)
        if (type != Weight.Stop) {
            this.backRealSpeed = this.backNormalSpeed / type;
            let height = this.ropeBody.height + this.backRealSpeed * dt;
            this.setRopeLength(height)
        } else {
            this.setRopeLength(this.ropeBody.height);
        }
    },
    //绳索变化长度的函数
    ropeShoot: function (dt) {
        if (this.is_collision != 1) {
            this.is_collision = 1;
        }
        if (this.ropeBody.height >= this.maxRopeLen) {
            this.setRopeLength(this.maxRopeLen);
            this.stateChange(Status.Back)
        }
        this.ropeSpeed(Weight.Zero, dt)
        // this.setRopeLength(this.ropeBody.height + (this.everyRopeLen * 2) * dt);
    },
    //绳索摆动
    ropeIdle: function (dt) {
        if (this.wdirection == 0) {
            this.wdirection = 1;
        }
        if (this.wdirection * this.node.angle >= this.maxAngle) {
            this.wdirection = -this.wdirection;
        }
        this.node.angle += this.wSpeed * this.wdirection * dt;
    },
    //绳索回归
    ropeBack: function (dt) {
        if (this.is_collision != 0) {
            this.is_collision = 0;
        }
        if (this.ropeBody.height <= this.minRopeLen) {
            this.stateChange(Status.Idle)
            this.setRopeLength(this.minRopeLen);
        }
        this.ropeSpeed(Weight.Zero, -dt);
        // this.setRopeLength(this.ropeBody.height - (this.everyRopeLen * 2) * dt);
    },

    //将皮肤不同的但是功能基本一样的使用同一个脚本
    getType(item) {
        let temp = item.name;
        if (temp == 'SheepGetDiamond') {
            temp = 'Sheep';
        } else if (temp == 'SmallStone') {
            temp = 'Stone'
        }
        return temp;
    },
    getScript(item, script) {
        let temp = item.getComponent(script);
        return temp;
    },
    //绳索（带item）回来的速度根据type进行处理,钩子伸缩的时候不进行碰撞检测
    ropeBackWithTarget: function (dt) {

        // console.log(item.name,item.node)
        // console.log('ropeBackWithTarget:  ', this.heavy, this.item.node)
        // console.log(`ropeBackWithTarget:  ${this.state}`)
        if (this.is_collision != 0) {
            this.is_collision = 0;
        }
        //可能被手雷摧毁
        if (this.item.isDestroy && this.item.isDestroy == true) {
            this.item.destroy();
            this.item = null;
            this.anim.play_once();
            this.stateChange(Status.Back);
            // console.log(`Rope:RBWT :  ${this.item}`)
            return;
        }
        // console.log(`Rope:RBWT222222 :  ${this.item}`)
        //有可能触碰到绵羊的时候又触发炸弹
        if (this.item == null) {
            this.stateChange(Status.Back);
            return;
        }

        // console.log("RopeBackWithTarget :" ,this.item.node)
        if (this.ropeBody.height <= this.minRopeLen) {
            this.setRopeLength(this.minRopeLen);
            //
            // console.log(this.item.node.name)
            let temp = this.getType(this.item);

            let script = this.item.getComponent(temp)
            //对幸运袋的手雷和极品力量进行动画描写
            if (temp == 'LuckyBox' && script.content != Type.Gold) {
                if (script.content == Type.Grenade) {
                    localStorage.setItem(Item.Grenade, parseInt(localStorage.getItem(Item.Grenade)) + 1)
                    // let grenadeNode = script.getGrenadeSprite()
                    // console.log(`Rope RBWT :  this.game : ${this.game}`)
                    let grenadeNode = cc.instantiate(this.game.grenadePrefab);
                    // console.log(`Rope RBWT :  ${grenadeNode}    ${grenadeNode.name}`)
                    //这里需要修改
                    grenadeNode.parent = this.grenadeAll
                    let countX = grenadeNode.parent.childrenCount;
                    grenadeNode.name = `Grenade${countX}`
                    let countY = 0;
                    if (countX >= 4) {
                        countY = parseInt(countX / 4);
                        countX -= 4 * countY
                    }
                    grenadeNode.x = 10 + 20 * (countX - 1);
                    grenadeNode.y = 16 + countY * 34;;
                    // console.log(`Rope:RBWT  Grenade  ${grenadeNode.parent.x} ${grenadeNode.x} ${grenadeNode.y}  ${grenadeNode.width}  ${grenadeNode.height}`)
                    // console.log(`Rope:RBWT  Grenade ${countX}  ${grenadeNode.name}`)
                    // return;
                } else if (script.content == Type.Power) {
                    this.stateChange(Status.Stop);
                    this.item.scaleX = 2;
                    this.item.scaleY = 2;
                    localStorage.setItem(Item.PowerJuice, true)
                    script.play_anim();
                    this.scheduleOnce(function () {
                        this.item.destroy();
                        this.stateChange(Status.Idle);
                    }, 2)

                }

            }
            // console.log(`Rope:RBWT  ${this.item.name} ${script.score}  ${script.objectType} ${temp}`)
            // console.log(temp)
            this.stateChange(Status.Stop);
            this.stop = true;
            if ((temp == 'Sheep' && script.score >= 600) || temp == 'Diamond') {
                if (JSON.parse(localStorage.getItem(Item.Diamond)) == true)
                    this.showScore(script.score + 300);
                else {
                    this.showScore(script.score);
                }
            } else {
                this.showScore(script.score);
            }
        }
        let heavy = JSON.parse(localStorage.getItem(Item.PowerJuice))
        if (heavy == true) {
            this.heavy = Weight.Zero;
        }
        this.ropeSpeed(this.heavy, -dt)
    },

    ropeStop: function (dt) {
        this.ropeSpeed(Weight.Zero, dt)
    },

    showScore: function (score) {
        let node = new cc.Node('showScore');
        let label = node.addComponent(cc.Label);
        node.parent = this.node.parent;
        node.width = 150;
        node.height = 50;
        node.x = -90;
        node.y = 244;
        label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        label.string = score;
        label.fontSize = 40;
        // achieved = false;
        // localStorage.setItem('sum',score)
        this.scheduleOnce(function () {
            
            this.game.score = JSON.parse(localStorage.getItem('sum'))+score;
            this.game.sumLabel.string = `￥${this.game.score}`
            localStorage.setItem('sum', this.game.score)
            // console.log(`Rope:showScore  sum ${localStorage.getItem('sum')}`)
            // let sumLabel = cc.find('Canvas/number/sumLabel');
            //分数显示消失
            node.destroy();
            //抓取的物品消失
            this.item.destroy();
            this.item = null;
            // console.log(`this.item.node.destroy();!!!`)
            this.stop = false;
            this.stateChange(Status.Idle);
        }, 2);

        // console.log(score)
    },
    /*
    碰到的问题：
    （1）在scale不是为1的情况下，钩子获取到黄金之后（改变黄金的父节点）会变小，
    现在把它的scale全部变为1之后基本好使了
    （2）需要将物品的anchor(0.5,1)对准钩子的(0.5,0.5)
        如果是有放大缩小比例的，还需要乘以scale,比如不同规格的黄金
    */
    onCollisionEnter: function (other, self) {
        // console.log("onCollisionEnter :", other.node.name)
        if (this.is_collision == 0) {
            return;
        }
        // console.log(other.node.name)
        if (!this.stateEqual(Status.Shoot)) {
            return;
        }
        if (other.node.group == Collision.Item) {
            //移除物体的碰撞盒
            other.node.parent = this.ropeHeader;
            let otherScript = this.getScript(other.node, this.getType(other.node));
            other.node.x = 0, other.node.y = -(other.node.height * other.node.scaleY) / 2;
            this.item = other.node;
            //this.item.stopAllActions();
            // if()
            // console.log("onCollisionEnter :", this.item.node.name, other.node.name)
            // console.log(`Rope:onCollisionEnter : ${this.item.name}, ${other.node.name} ${otherScript}`)
            //这里需要修改
            // this.heavy = Weight.Zero;
            this.heavy = otherScript.heavy
            // console.log(`Rope:onCollisionEnter : ${this.heavy}`)
            if (this.getType(other.node) == 'Sheep') {
                otherScript.delayGame();
                otherScript.captured = true;
            }
            other.node.removeComponent(cc.PolygonCollider)
            this.stateChange(Status.BackWithTarget);
            //测试中心位置的
            // this.stateChange(Status.Stop);
            //组件移除需要处理号节点后移除
        } else if (other.node.group == Collision.Bomb) {
            //爆炸
            this.stateChange(Status.Back);
        }
    },

    stateChange: function (status) {
        this.state = status;
        // this.item = item;
        // console.log(`stateChange item ${item.node.name}  ${this.item.node.name}`)
    },

    stateEqual: function (status) {
        return this.state == status;
    },

    stateDo: function (dt) {
        if (this.stateEqual(Status.Idle)) {
            this.ropeIdle(dt);
            return;
        } else if (this.stateEqual(Status.Shoot)) {
            this.ropeShoot(dt);
            return;
        } else if (this.stateEqual(Status.Back)) {
            this.ropeBack(dt);
            return;
        } else if (this.stateEqual(Status.BackWithTarget)) {
            // console.log('stateDo :',this.heavy,this.item)
            this.ropeBackWithTarget(dt);
            return;
        } else if (this.stateEqual(Status.Stop)) {
            this.ropeStop(dt);
            return;
        }
    },
    //只有在摇摆的状态下才能伸长，只有在回收的状态下才能使用手雷
    onKeyDown: function (event) {
        // console.log(`Rope:onKeyDown `)
        switch (event.keyCode) {
            case 40:
                // if (this.state == Status.Idle) {
                if (this.stateEqual(Status.Idle)) {
                    this.stateChange(Status.Shoot)
                }
                console.log(`onKeyDown :40`)
                break;
            case 38:
                //丢手雷
                if (this.stateEqual(Status.BackWithTarget)) {
                    // if (this.state == Status.BackWithTarget){
                    this.dealGrenade();
                    console.log(`onKeyDown ${this.state}`)
                }
                // console.log(`onKeyDown :38`);
                break;
        }
        // console.log(event.keyCode)
    },

    //如果没有手雷，或者不是拉物体回来的状态，不使用手雷
    dealGrenade: function () {
        let count = this.grenadeAll.childrenCount;
        if (count <= 0) {
            return;
        }

        // console.log(`Rope:dealGrenade : ${this.state}  ${this.stateEqual(Status.ropeBackWithTarget)}`)
        let useGrenade = this.grenadeAll.getChildByName(`Grenade${count}`);
        // console.log(`Rope:dealGrenade  ${useGrenade}  ${count}`)
        useGrenade.parent = this.node;
        useGrenade.x = 0;
        useGrenade.y = 0;
        let des = cc.v2(this.ropeHeader)
        cc.tween(useGrenade).by(1, { position: des }).start()
        // console.log(`Rope:dealGrenade   ${useGrenade.name} ${des}`)
        this.anim = useGrenade.getComponent(FrameAnim);
        // console.log(`Rope:dealGrenade   ${this.anim} ${des}`)
        //摧毁物体
        this.item.isDestroy = true;
        // console.log(`Rope:dealGrenade  this.item  ${this.item}`)

        // anim.play_once();
        //数据库减少一个
        localStorage.setItem(Item.Grenade, count - 1)
        // useGrenade.destroy();
        // count = this.grenadeAll.childrenCount;
        // console.log(`Rope:dealGrenade   ${count}`)
    },


    // LIFE-CYCLE CALLBACKS:
    onLoad() { },

    //！！！防止一次性碰撞两个,在拾起物体的时候需要将物体的碰撞盒去掉


    //初始化长度，绳索状态，监听键盘,获取Game组件，便于金钱处理
    start() {
        this.wSpeed = 100;
        this.maxAngle = 80;
        this.maxRopeLen = 650;
        this.minRopeLen = 80;
        this.backNormalSpeed = 300;
        this.game = this.node.parent.getComponent('Game');
        let number = this.node.parent.getChildByName('number');
        this.sumLabel = number.getChildByName('sumLabel').getComponent(cc.Label).string;
        this.grenadeAll = cc.find('Canvas/GrenadeAll')
        this.stop = false;
        // console.log(this.number.getChildByName('sumLabel').getComponent(cc.Label).string);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // console.log(this.game.score,this.game.sumLabel.string)
        this.setRopeLength(this.minRopeLen);
        this.stateChange(Status.Idle)

        this.is_collision = 1;
        // this.Game = this.node.parent.getComponent('Game')
    },

    update(dt) {
        // console.log(`Rope:update this.stop ${this.stop} cc.director.getCollisionManager()  ${cc.director.getCollisionManager().enabled}`)
        if (this.stop == true) {
            return;
        }
        this.stateDo(dt);
    },
});
