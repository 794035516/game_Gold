const MissionSet = require('./MissionSet')

const TimeAll = 60

//商店道具
const Item = {
    Grenade: 'ItemGrenade',
    PowerJuice: 'ItemPowerJuice',
    RockBook: 'ItemRockBook',
    Grass: 'ItemGrass',
    Diamond: 'ItemDiamond'
}


// 全局管理对象，应该有绵阳，炸弹袋，幸运袋，石头，黄金，钻石
/*
    （1）主角应该有钩子的相关处理，和上面这些接触物
    （2）还会有商店购买的道具使用，如炸弹（可以炸毁迅速上拉），
    幸运药水（提升在幸运袋的高级道具概率），生力药水（提高钩子速度）
    收藏书（提高石头的价值），辨别书（提高钻石的价值）等
    （3）每当过关后，都会与这关应该获得的分数进行判断，如果低，则
    闯关失败，如果高，则继续
    如果闯关成功，则进入商店购买道具，可以不买，可以买，点击下一关
    按钮继续下一关
*/


/*
碰撞检测（物理系统）：
（1）确保在onLoad里面开启了碰撞检测
（2）确保允许碰撞系统检测事件监听
（3）确保类型分组，可以碰撞
（4）代码函数写对
*/
cc.Class({
    extends: cc.Component,

    properties: {

        // 绵羊
        sheepPrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '绵羊的预制体',
        },
        sheepGetDiamondPrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '带钻石的绵羊的预制体',
        },
        // 钻石
        diamondPrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '钻石的预制体',
        },
        // 炸弹
        bombBoxPrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '炸弹的预制体',
        },
        grenadePrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '手雷的预制体',
        },
        // 石头
        stonePrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '石头的预制体',
        },
        smallStonePrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '小石头的预制体',
        },
        // 黄金
        goldPrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '大黄金的预制体',
        },
        // 幸运袋
        luckyBoxPrefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '随即带的预制体',
        },

        rope: {
            type: cc.Node,
            default: null,
            tooltip: '整个绳索',
        },
        score: {
            type: cc.Integer,
            default: 0,
            tooltip: '总金钱',
        },
        sumLabel: {
            type: cc.Label,
            default: null,
        },
        desLabel: {
            type: cc.Label,
            default: null,
        },
        timeLabel: {
            type: cc.Label,
            default: null,
        },
        missionLabel: {
            type: cc.Label,
            default: null,
        },

    },


    // 生成随机数，用于对绵羊和炸弹，石头，钻石，幸运带的生成
    // random: function (num) {
    //     return Math.round(Math.random() * num) + 3;
    // },
    //生成目标分数,如果在商店购买了道具，目标分就不能是简单的用已有的加上这个随机数
    desRandom: function () {
        let temp = localStorage.getItem('missionEasy') % 5;
        if (0 == (temp + 1) % 5) {
            temp = 0;
        }
        // console.log(`Game:desRandom  temp : ${temp}`)
        let left, right;
        switch (temp) {
            case 0: left = 1300; right = 800; break;
            case 1: left = 450; right = 200; break;
            case 2: left = 500; right = 300; break;
            case 3: left = 800; right = 500; break;
            case 4: left = 1000; right = 800; break;
        }

        localStorage.setItem('missionEasy', (temp++) % 5);
        // console.log(`Game:desRandom  left : ${left}`)
        return Math.ceil(left + parseInt(Math.random() * right / 10) * 10);
    },
    // 层级关系是 SpriteNode/ItemNode
    // nodeDealWith: function (prefab, upNode, script) {
    //     var item = cc.instantiate(prefab);
    //     item.getComponent(script).init(this, item.getComponent(script));
    //     item.setPosition(this.getNewPostion());
    //     upNode.addChild(item);
    // },

    /*
    const Item = {
        Grenade: 'ItemGrenade',
        PowerJuice: 'ItemPowerJuice',
        RockBook: 'ItemRockBook',
        Grass: 'ItemGrass',
        Diamond: 'ItemDiamond'
    }
    */
    //根据顺序表示哪一种类型 Gold   Diamond   Stone   LuckyBox  Sheep   BombBox
    // 钻石,随机袋,BombBox也是没有的 Type
    itemInitialize: function (index, missionContent) {
        let itemType;
        let config = null;
        let itemNode;
        let parentName;
        let itemName;
        config = missionContent.Type;
        if (index == 0) {
            itemType = this.goldPrefab;
            parentName = this.goldAll
            itemName = 'Gold'
        }
        else if (index == 1) {
            itemType = this.diamondPrefab;
            parentName = this.diamondAll
            itemName = 'Diamond'
        }
        else if (index == 2) {
            if (missionContent.Type == 1) {
                itemType = this.smallStonePrefab
                itemName = 'SmallStone'
            } else {
                itemType = this.stonePrefab;
                itemName = 'Stone'
            }
            parentName = this.stoneAll
        }
        else if (index == 3) {
            itemType = this.luckyBoxPrefab;
            parentName = this.luckyBoxAll
            itemName = 'LuckyBox'
        }
        else if (index == 4) {
            if (missionContent.Type == 1) {
                itemType = this.sheepGetDiamondPrefab;
                itemName = 'SheepGetDiamond'
            } else {
                itemType = this.sheepPrefab;
                itemName = 'Sheep'
            }
            parentName = this.sheepAll
        }
        else if (index == 5) {

            itemType = this.bombBoxPrefab;
            parentName = this.bombBoxAll
            itemName = 'Bomb'
        }
        for (let i = 0; i < missionContent.Num; i++) {
            itemNode = cc.instantiate(itemType)
            itemNode.name = itemName
            let temp = itemNode.name
            itemNode.parent = parentName
            if (temp == 'SheepGetDiamond') {
                temp = 'Sheep'
            } else if (temp == 'SmallStone') {
                temp = 'Stone'
            }
            let script = itemNode.getComponent(temp)
            // console.log(`Game:itemInitialize  ${script}  ${temp}  ${itemNode.name} ${missionContent}`)
            if (script != null) {
                if (config != null) {
                    script.init(this, config)
                } else {
                    script.init(this)
                }
                // console.log(`Game:itemInitialize  ${missionContent.Position}  ${temp}  ${script.scale}`)
                itemNode.x = missionContent.Position[i].X
                itemNode.y = missionContent.Position[i].Y
            }
            // console.log(`Game:itemInitialize  ${itemNode.x}  ${itemNode.y}`)
        }
    },

    // console.log(`Game:itemInitialize ${index}  ${missionContent.Num}`)
    // console.log(`Game:itemInitialize  ${index}  ${missionContent}`)
    // var itemNum = this.random(randNum);
    // for (let i = 0; i < itemNum; i++) {
    //     this.nodeDealWith(prefab, All, script);
    // }
    // },
    // 对绵阳进行初始化
    // sheepInitialize:function(){
    //     var sheepNum = this.random(5)
    //     for(let i = 0;i < sheepNum;i++){
    //         this.nodeDealWith(this.sheepPrefab,this.sheepAll,Sheep);  
    //     }
    // },

    // 对位置进行处理，物质的都在挖矿人的下面
    // getNewPostion: function () {
    //     var peoplePos = cc.v2(100, 100);
    //     var randX = peoplePos.x - Math.random() * 280;
    //     var randY = peoplePos.y - Math.random() * 280;
    //     return cc.v2(randX, randY)
    // },

    onLoad() {

        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true; // 开启碰撞
        //   cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        // //开启绘制区域
        // manager.enabledDebugDraw = true;
    },
    showGrenade(){
        //localStorage.setItem(Item.Grenade, parseInt(localStorage.getItem(Item.Grenade)) + 1)
        // let grenadeNode = script.getGrenadeSprite()
        // console.log(`Rope RBWT :  this.game : ${this.game}`)
        // console.log(`Rope RBWT :  ${grenadeNode}    ${grenadeNode.name}`)
        //这里需要修改
        let grenade = JSON.parse(localStorage.getItem(Item.Grenade))
        let temp = grenade;
        //let countX = this.grenadeAll.childrenCount;
        for(let i = 1;i <= grenade;i++){
            let grenadeNode = cc.instantiate(this.grenadePrefab);
            grenadeNode.parent = this.grenadeAll
            grenadeNode.name = `Grenade${i}`
            let countY = 0;
            if (temp >= 4) {
                countY = parseInt(countX / 4);
                temp -= 4 * countY
            }
            grenadeNode.x = 10 + 20 * (temp - 1);
            grenadeNode.y = 16 + countY * 34;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // 生成父亲节点，便于统一管理
    //初始化，初始化绳索长度和监听键盘
    start() {
        // console.log(`Game:start  mission:${localStorage.getItem('mission')}`)
        // if (JSON.parse(localStorage.getItem('mission')) == null || JSON.parse(localStorage.getItem('mission')) == '0') {
        //     localStorage.setItem('sum', 0)
        //     localStorage.setItem('mission', 1)
        //     localStorage.setItem('desc', 0)
        //     localStorage.setItem('buyed', 0)
        //     localStorage.setItem('missionEasy', 1)
        //     localStorage.setItem(Item.Grenade, 0)
        //     localStorage.setItem(Item.Grass, false)
        //     localStorage.setItem(Item.PowerJuice, false)
        //     localStorage.setItem(Item.RockBook, false)
        //     localStorage.setItem(Item.RockBook, false)
        //     // console.log(`Game:start if`)
        // } else {
        //     localStorage.setItem('mission', parseInt(localStorage.getItem('mission')) + 1);
        // }
        localStorage.setItem('mission', parseInt(localStorage.getItem('mission')) + 1);
        // console.log(`Game:start  ${localStorage.getItem('mission')}`)
        //取消左下角
        cc.debug.setDisplayStats(false);
        //开启碰撞检测
        this.grenade = localStorage.getItem(Item.Grenade);
        this.missionLabel.string = localStorage.getItem('mission');
        this.timeLabel.string = TimeAll;
        this.grenadeAll = cc.find('Canvas/GrenadeAll');
        // this.score = 0;
        // console.log(`Game:start  localStorageGetItemSum : ${localStorage.getItem('sum')}`)
        this.sumLabel.string = `￥${localStorage.getItem('sum')}`;
        // console.log(`Game:start  sumLabelString : ${this.sumLabel.string}`)
        // this.sumLabel.string = `￥${10000}`;
        let desc;
        let buyed = localStorage.getItem('buyed')
        // console.log(`Game:start buyed : ${buyed}  `)
        let res = this.desRandom()
        // console.log(`Game:start buyed :   ${JSON.parse(buyed)}`)
        if (JSON.parse(buyed) != NaN) {
            desc = parseInt(localStorage.getItem('buyed')) + res;
        } else {
            desc = parseInt(this.sumLabel.string.substring(1)) + res;
        }
        localStorage.setItem('desc', desc);
        // console.log(`Game:start  desc ${desc}   sum : ${this.sumLabel.string.substring(1)}  desRandom : ${res}`)
        //后期路径为Canvas/Mission/DiamondAll这样的
        this.desLabel.string = `￥${desc}`
        this.missionPlay = cc.find('Canvas/firstMission')
        this.goldAll = this.missionPlay.getChildByName('GoldAll')
        this.stoneAll = this.missionPlay.getChildByName('StoneAll')
        this.luckyBoxAll = this.missionPlay.getChildByName('LuckyBoxAll')
        this.sheepAll = this.missionPlay.getChildByName('SheepAll')
        this.diamondAll = this.missionPlay.getChildByName('DiamondAll')
        this.bombBoxAll = this.missionPlay.getChildByName('BombBoxAll')
        // console.log(`Game:start  ${this.goldAll} ${this.stoneAll}  ${this.luckyBoxAll}  ${this.sheepAll} ${this.diamondAll}  ${this.bombBoxAll}`)
        // 测试
        if (this.goldAll.childrenCount > 0) {
            this.goldAll.removeAllChildren();
        }
        if (this.stoneAll.childrenCount > 0) {
            this.stoneAll.removeAllChildren();
        }
        if (this.luckyBoxAll.childrenCount > 0) {
            this.luckyBoxAll.removeAllChildren();
        }
        if (this.sheepAll.childrenCount > 0) {
            this.sheepAll.removeAllChildren();
            // console.log(`Game:start  diamond ${temp}  ${this.sheepAll.childrenCount}`)
        }
        if (this.diamondAll.childrenCount > 0) {
            this.diamondAll.removeAllChildren();
            // console.log(`Game:start  diamond ${temp}  ${this.diamondAll.childrenCount}`)
        }
        if (this.bombBoxAll.childrenCount > 0) {
            this.bombBoxAll.removeAllChildren();
        }
        this.showGrenade();
        //一共7关
        // let missionNow = parseInt(this.missionLabel.string)
        //MissionNow从1开始，然而文件是数组，下标从0开始
        let missionNow = (parseInt(this.missionLabel.string) - 1) % 7

        //从MissionSet.js中读取物品种类，个数，和位置，根据个数随机读取位置，使用Set结构保证位置的下标不一样
        // console.log(`Game:start  before -- `)
        let MissionSetMission = MissionSet.getMission()
        // console.log(`Game:start   after -- ${MissionSetMission}`)
        //MissionNow从1开始，然而文件是数组，下标从0开始
        // let missionContent = MissionSetMission[missionNow - 1];
        let missionContent = MissionSetMission[missionNow];
        // console.log(`Game:start    ${missionNow} ${missionContent} aa`)
        //先遍历类型，在遍历类型的个数
        // console.log(`Game:start test ---- ${missionContent} ${this.missionLabel.string}`)
        if (missionContent && missionContent.length) {
            for (let i = 0; i < missionContent.length; i++) {
                for (let j = 0; j < missionContent[i].length; j++) {
                    // console.log(`Game:start  ${i}  ${missionContent.length}  ${missionContent[i].length}`)
                    this.itemInitialize(i, missionContent[i][j])
                    // console.log(`Game:start  ${i}  ${j}`)
                }

            }
        }

        //为了方便测试，修改成3秒，记得修改成59
        this.schedule(function () {
            this.timeLabel.string--;
            // },1,3)
        }, 1, TimeAll - 1)
    },

    update(dt) {
        //计时完毕
        if (this.timeLabel.string == 0) {
            let sum = parseInt(this.sumLabel.string.substring(1))
            localStorage.setItem('sum', sum);
            let des = parseInt(this.desLabel.string.substring(1))
            // console.log(sum,des)
            if (sum >= des) {
                cc.director.loadScene('store')
            } else {
                cc.director.loadScene('overGame')
            }
            //根据分数进行判断
            // if(this.)
            // cc.director.loadScene('')
        }
    },
});