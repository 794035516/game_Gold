// const bomb = '炸药。你买了它以后，当你抓到较重而且钱不多的物品时，按下"上"方向键即可将它炸毁(一次性道具)，以便节省时间。';
// const luckyGrass = '幸运草。它将增强你在下一关从幸运袋中取得好东西的机遇，其效用为一关。';
// const tonebook = '石头收藏书。石头将有三次机遇会变成相当有价值的物品，其功效为一关。';
// const diamondBook = '优质钻石鉴赏书。钻石将变得相当值钱，其效用为一关。';
// const strength = '生力水。你的力气将会增加，抓东西的速度会增加，其功效为一关。';
// const item = new Array(bomb, luckyGrass, tonebook, diamondBook, strength);
const StoreItem = {
    ItemGrenade: '炸药。你买了它以后，当你抓到较重而且钱不多的物品时，按下"上"方向键即可将它炸毁(一次性道具)，以便节省时间。',
    ItemPowerJuice: '生力水。你的力气将会增加，抓东西的速度会增加，其功效为一关。',
    ItemRockBook: '石头收藏书。石头将有三次机遇会变成相当有价值的物品，其功效为一关。',
    ItemGrass: '幸运草。它将增强你在下一关从幸运袋中取得好东西的机遇，其功效为一关。',
    ItemDiamond: '优质钻石鉴赏书。钻石将变得相当值钱，其功效为一关。',
}

const Item = {
    ItemGrenade: 'ItemGrenade',
    ItemPowerJuice: 'ItemPowerJuice',
    ItemRockBook: 'ItemRockBook',
    ItemGrass: 'ItemGrass',
    ItemDiamond: 'ItemDiamond'
}

const ItemScore = {
    ItemGrenade: {
        left: 10,
        right: 500,
    },
    ItemPowerJuice: {
        left: 250,
        right: 300,
    },
    ItemRockBook: {
        left: 50,
        right: 60,
    },
    ItemGrass: {
        left: 30,
        right: 300
    },
    ItemDiamond: {
        left: 250,
        right: 600,
    }

}

const PrologueText = '点击下面的物品即可进行购买，买好物品后点击下一关继续游戏。'
const EndText = '欢迎下次光临！！！。'

cc.Class({
    extends: cc.Component,

    properties: {
        text: {
            type: cc.Label,
            default: null,
            tooltip: '道具文字展示',
        },
        prologue: {
            type: cc.Label,
            default: null,
            tooltip: '商人开场白'
        },
        itemsAll: {
            type: cc.Node,
            default: null,
            tooltip: '可购买的道具栏',
        },
        ItemGrenade: {
            type: cc.Prefab,
            default: null,
            tooltip: '手雷的预制体',
        },
        ItemPowerJuice: {
            type: cc.Prefab,
            default: null,
            tooltip: '力量药水的预制体',
        },
        ItemRockBook: {
            type: cc.Prefab,
            default: null,
            tooltip: '岩石书的预制体',
        },
        ItemGrass: {
            type: cc.Prefab,
            default: null,
            tooltip: '幸运草的预制体',
        },
        ItemDiamond: {
            type: cc.Prefab,
            default: null,
            tooltip: '小黄金的预制体',
        },
        scoreCostLabel: {
            type: cc.Prefab,
            default: null,
            tooltip: '提示价格的预制体',
        },

    },

    setTextOneByOne(j) {
        this.prologue.string += PrologueText[this.prologue.string.length];
    },

    //设置监听事件的时候，this已经改变
    //进入商店，商人说的话实现逐个显式效果
    //监听函数，this已经改变
    setText() {
        this.schedule(this.setTextOneByOne, 0.05, PrologueText.length - 1);
    },


    //监听函数，this已经改变
    deleteText() {
        let text = cc.find('Canvas/Text').getComponent(cc.Label)
        text.string = ''
    },
    //在this.item有效后并且松开鼠标时购买道具
    //通过ClickEvents的CustomEventData传递道具名
    //预制体记录的如果不是当前节点的信息，就会丢失掉（底层引擎是记录的节点信息而不是路径信息）
    //我这里预制体的button组件引用了Canvas的函数，所以既不报错又不执行
    //监听函数，this已经改变
    buyItem: function () {

        let self = this.parent.parent.getComponent('Store')

        //在购买物品的时候需要先判断金钱够不够
        // console.log(`Store:buyIten  want to buy !!! scoreCost: ${localStorage.getItem('sum')} ${self.itemsAll.childrenCount}`)
        let itemBuyed = cc.find(`Canvas/items/${this.name}`)
        let money = parseInt(localStorage.getItem('sum'))
        // let money = (localStorage.getItem('sum'))
        //不仅要消除道具，还要消除道具的花费
        let scoreCostLabel = cc.find(`Canvas/items/${this.name}ScoreCost`)
        // console.log(`Store:buyIten  succeed to buy !!! scoreCost: ${scoreCost.name} `)
        let scoreCost = parseInt(scoreCostLabel.getComponent(cc.Label).string.substring(1))
        if (money > scoreCost) {
            money -= scoreCost;
            localStorage.setItem('sum', money);
            itemBuyed.destroy();
            scoreCostLabel.destroy();
            // console.log(`Store:buyItem  succeed to buy !!! scoreCost: ${scoreCost} 
            //     ,moneyaaa :  ${money} ,restMoney: ${money - scoreCost}`)
        }
        console.log(`Store:buyItem  unable to buy !!! scoreCost: ${scoreCost} 
                ,moneyaaa :  ${money} ,restMoney: ${money - scoreCost}   parseInt(scoreCost) : ${parseInt(scoreCost)}`)
        switch (this.name) {
            case Item.ItemGrenade:
                self.getGrenade()
                break;
            case Item.ItemPowerJuice:
                self.getPowerJuice()
                break;
            case Item.ItemRockBook:
                self.getRockBook()
                break;
            case Item.ItemGrass:
                self.getGrass()
                break;
            case Item.ItemDiamond:
                self.getDiamondBook()
                break;
        }

        // console.log(`Store:buyItem  ${self.itemsAll.childrenCount}  ${localStorage.getItem(this.name)}  ${this.name}`)
    },

    //鼠标hover效果，显式道具的效果
    showText() {
        // console.log(`Store:showText !!!  ${this.name}   ${item}`)
        let tempStr = '';
        switch (this.name) {
            case Item.ItemDiamond:
                tempStr = StoreItem.ItemDiamond
                break;
            case Item.ItemGrass:
                tempStr = StoreItem.ItemGrass
                break;
            case Item.ItemGrenade:
                tempStr = StoreItem.ItemGrenade
                break;
            case Item.ItemRockBook:
                tempStr = StoreItem.ItemRockBook
                break;
            case Item.ItemPowerJuice:
                tempStr = StoreItem.ItemPowerJuice
                break;
            //对
            default: return
        }
        // console.log(`Store:showText  ${this.name}  aaa  ${tempStr}`)
        let textNode = cc.find('Canvas/Text')
        let label = textNode.getComponent(cc.Label)
        label.string = tempStr
        // console.log(`Store:showText  ${this.name}  aaa  ${tempStr}`)

    },


    getRockBook() {
        localStorage.setItem(Item.ItemRockBook, true)
        console.log(`Store:getRockBook ${this.node.name} `)
    },

    getPowerJuice() {
        localStorage.setItem(Item.ItemPowerJuice, true)
        console.log(`Store:getPowerJuice  ${this.node.name}`)
    },

    getGrass() {
        localStorage.setItem(Item.ItemGrass, true)
        console.log(`Store:getGrass  ${this.node.name}`)
    },

    getGrenade() {
        console.log(`Store:getGrenade   ${this.node.name}  ${localStorage.getItem(Item.ItemGrenade)}`)
        //测试时无数据，为空
        if (localStorage.getItem(Item.ItemGrenade) == null) {
            localStorage.setItem(Item.ItemGrenade, 0);
        }
        localStorage.setItem(Item.ItemGrenade, JSON.parse(localStorage.getItem(Item.ItemGrenade)) + 1)
        // console.log(`Store:getGrenade   ${this.node.name}`)

    },

    getDiamondBook() {
        localStorage.setItem(Item.ItemDiamond, true)
        console.log(`Store:getDiamond    ${this.node.name}`)
    },

    //如果开场白还没有展示，一次性展示出来并取消计时器
    btnNext: function (event, customEventData) {
        this.itemsAll.removeAllChildren();
        if (this.prologue.string != PrologueText) {
            this.unschedule(this.setTextOneByOne)
            // this.prologue.string = PrologueText
        }
        this.prologue.string = EndText;
        this.scheduleOnce(function () {
            cc.director.loadScene(customEventData);
        }, 3)
    },


    //实例化一个道具,一次性添加两个节点，分别是道具和分数
    instantiateItem(item) {
        let itemNode = cc.instantiate(item)
        let itemCost = cc.instantiate(this.scoreCostLabel);
        itemNode.on('click', this.buyItem, itemNode)
        let count = this.itemsAll.childrenCount;
        itemNode.x = 100 + parseInt(count / 2) * 120;
        itemCost.x = 100 + parseInt(count / 2) * 120;
        itemNode.parent = this.itemsAll
        itemCost.parent = this.itemsAll
        itemNode.y = 0;
        itemCost.y = -15;
        itemCost.name = `${itemNode.name}ScoreCost`
        let label = itemCost.getComponent(cc.Label)
        label.string = `￥${this.getRandomScore(item.name)}`;
        // console.log(`Store:instantiateItem  ${itemNode.name}   ${itemCost.name}`);
    },

    /*
const Item = {
    ItemGrenade: 'ItemGrenade',
    ItemPowerJuice: 'ItemPowerJuice',
    ItemRockBook: 'ItemRockBook',
    ItemGrass: 'ItemGrass',
    ItemDiamond: 'ItemDiamond'
}
    */

    getRandomNum(left, right) {
        return left + parseInt(Math.random() * right);
    },

    //根据ItemScore对象的left和right随机生成整数赋值给道具作为花费
    getRandomScore(itemName) {
        let scoreTemp = 0;
        let numType = null;
        switch (itemName) {
            case Item.ItemGrenade:
                numType = ItemScore.ItemGrenade;
                break;
            case Item.ItemPowerJuice:
                numType = ItemScore.ItemPowerJuice;
                break;
            case Item.ItemRockBook:
                numType = ItemScore.ItemRockBook;
                break;
            case Item.ItemGrass:
                numType = ItemScore.ItemGrass;
                break;
            case Item.ItemDiamond:
                numType = ItemScore.ItemDiamond;
                break;
        }
        scoreTemp = this.getRandomNum(numType.left, numType.right);
        // console.log(`Store:getRandomScore  ${scoreTemp}`)
        return scoreTemp
    },

    //生成道具的类型
    getRandomType() {
        let num = Math.round(Math.random())
        // console.log(`Store:getRandomType  ${num}`)
        return num

    },

    onLoad() {
        //取消左下角
        cc.debug.setDisplayStats(false);
    },

    //给道具添加hover事件，初始化两个label框的字符串
    start() {
        //初始化道具效果，防止一劳永逸
        localStorage.setItem(Item.ItemDiamond,false);
        localStorage.setItem(Item.ItemGrass,false);
        localStorage.setItem(Item.ItemPowerJuice,false);
        localStorage.setItem(Item.ItemRockBook,false);
        //鼠标选中，但未购买，配合mouseDown和mouseUp使用
        //测试使用功能
        // let count = this.itemsAll.childrenCount
        //初始化节点
        //测试，修改本地金钱,this.money是为了记录在花钱的情况下的下一关目标分数设置
        this.money = parseInt(localStorage.getItem('sum'));
        if (this.money == NaN) {
            localStorage.setItem('sum', 10000)
        }
        this.text.string = '';
        this.prologue.string = '';
        if (this.itemsAll.childrenCount != 0) {
            this.itemsAll.removeAllChildren();
        }
        //随机生成不超过5种的不一样的道具
        for (let i = 0; i < 5; i++) {
            let flag = this.getRandomType()
            if (flag) {
                let item = null;
                switch (i) {
                    case 0:
                        item = this.ItemGrenade
                        break;
                    case 1:
                        item = this.ItemPowerJuice
                        break;
                    case 2:
                        item = this.ItemRockBook;
                        break;
                    case 3:
                        item = this.ItemGrass;
                        break;
                    case 4:
                        item = this.ItemDiamond;
                        break;
                }
                // console.log(`Store:start   ${i}  ${item.name}`)
                this.instantiateItem(item);
            }
            // console.log(`Store:start   ${flag}`)
        }
        //给子节点监听hover事件，触发文字介绍函数
        //给子节点监听鼠标移出事件，清空文字介绍
        /*
  cc.Node.EventType.MOUSE_LEAVE   当鼠标移出目标节点区域时，不论是否按下
  cc.Node.EventType.MOUSE_DOWN    当鼠标在目标节点区域按下时触发一次
  cc.Node.EventType.MOUSE_UP      当鼠标从按下状态松开时触发一次
  cc.Node.EventType.MOUSE_ENTER  当鼠标移入目标节点区域时，不论是否按下
  */
        let count = this.itemsAll.childrenCount
        for (let i = 0; i < count; i++) {
            // console.log(`for  : ${this.itemsAll.children[i].name}`)
            this.itemsAll.children[i].on(cc.Node.EventType.MOUSE_ENTER, this.showText, this.itemsAll.children[i]);
            this.itemsAll.children[i].on(cc.Node.EventType.MOUSE_LEAVE, this.deleteText, this.itemsAll.children[i]);
        }
        this.text.string = '';
        this.prologue.string = '';
        // console.log(`Store:start ${count}`)
        // console.log(`Store:start  ${this.node.name}. ${this.itemsAll.children}  ${this.itemsAll.childrenCount}`) ;
        this.setText()
        //预加载提高加载的速度
        localStorage.setItem('buyed', this.money);
        cc.director.preloadScene('playGame', function () {
            // cc.log('Next scene preloaded');
        });
    },

    // update() {

    // }

});
