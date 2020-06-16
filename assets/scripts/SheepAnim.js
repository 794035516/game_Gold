cc.Class({
    extends: cc.Component,

    properties: {
        
        test:{
            type:cc.Integer,
            default:123,
        }
    },

    // use this for initialization
    onLoad: function () {
        // this.getArmature();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    getArmature:function(){
        //获取 ArmatureDisplay
        // this.armatureDisPlay = this.getComponent(dragonBones.ArmatureDisplay)
        // console.log(`getArmature  :!!!!  `,this.armatureDisPlay)
        //获取 Armatrue
        // this._armature = this._armatureDisPlay.armature()
        //添加动画监听
        // this._armatureDisPlay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this.animationEventHandler, this)
        // this._armatureDisPlay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this.animationEventHandler, this)
        // this.wait();
    },
    walk: function () {
        //动画执行方式二
        // let flag = this.armatureDisPlay.playAnimation('walk', 100);
        // console.log(`walk222222!!!   ${flag} ${this.armatureDisPlay.animationName}`);
    },
    wait: function () {
        // this.armatureDisPlay.playAnimation('wait', 100);
        // console.log(`walk222222!!!    ${this.armatureDisPlay.animationName}`);
    },
    // animationEventHandler: function animationEventHandler(event) {
    //     if (event.type == dragonBones.EventObject.FADE_IN_COMPLETE) {
    //         cc.log(event.detail.animationName + ' fade in complete');
    //     } else if (event.type == dragonBones.EventObject.FADE_OUT_COMPLETE) {
    //         cc.log(event.detail.animationName + ' fade out complete');
    //     }
    // }
    start:function(){
        // console.log(`sheepAnim  `,this.test)
    }
});