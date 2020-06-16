const Item = {
    Grenade: 'ItemGrenade',
    PowerJuice: 'ItemPowerJuice',
    RockBook: 'ItemRockBook',
    Grass: 'ItemGrass',
    Diamond: 'ItemDiamond'
}

cc.Class({
    extends: cc.Component,

    properties: {

    },
    //点击按钮，从开始界面跳转到捕捉界面
    /*
    btnStart:function(event, customEventData){
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        //var node = event.target;
        //var button = node.getComponent(cc.Button);
        //这里的 customEventData 参数就等于你之前设置的 "click1 user data"
        //console.log("node=", node.name, " event=", event.type, " data=", customEventData);
    },
    */
    //游戏结束，或为分数不够，或主动退出
    btnExit: function (event, customEventData) {
        cc.director.loadScene('overGame');
    },
    /*
    跳转到商店
    （1）从关卡主动店家下一关的，
    （2）时间计时完毕被动跳转
    这些情况可能出现分数与目标分数的大小问题
    */
    btnStore: function (event, customEventData) {

        cc.director.loadScene(customEventData);
    },
    //从商店跳转到下一关，可能是点击开始按钮进入的
    //测试的时候设置开始为1
    btnNext: function (event, customEventData) {
        console.log(`startButton:btnNext  mission ${localStorage.getItem('mission')}`)
        let now = parseInt(localStorage.getItem('sum'))
        let desc = parseInt(localStorage.getItem('desc'))
        console.log(`startButton:btnNext  money ${now}  ${desc}`)
        // console.log(`startButton:btnNext  ${now}  ${desc}`)
        if (now < desc || now == 0 || desc == 0) {
            customEventData = 'overGame';
        }
        console.log(`startButton btnNext  now ${now}  desc ${desc}  ${customEventData}`)

        cc.director.loadScene(customEventData);
        // if(localStorage.getItem('mission') == null){
        //     localStorage.setItem('mission',0);
        // }else{
        //     localStorage.setItem('mission', parseInt(localStorage.getItem('mission')) + 1)
        // }
        // localStorage.setItem('mission', 1)
        // cc.director.loadScene(customEventData);
        // cc.director.loadScene('playGame');
    },

    btnStart: function (event, customEventData) {
        localStorage.setItem('sum', 0)
        localStorage.setItem('mission', 1)
        localStorage.setItem('desc', 0)
        localStorage.setItem('buyed', 0)
        localStorage.setItem('missionEasy', 1)
        localStorage.setItem(Item.Grenade, 0)
        localStorage.setItem(Item.Grass, false)
        localStorage.setItem(Item.PowerJuice, false)
        localStorage.setItem(Item.RockBook, false)
        localStorage.setItem(Item.RockBook, false)
        cc.director.loadScene(customEventData);
    },
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
