cc.Class({
    extends: cc.Component,

    properties: {
        is_enable: true,    //是否开启碰撞检测系统
        is_debug: false     //是否显示碰撞检测区域
    },
    
    onLoad() {
        if (this.is_enable) {
            let manager = cc.director.getCollisionManager();
            manager.enabled = true;     //开启碰撞检测
            if (this.is_debug) {
                manager.enabledDebugDraw = true;   //显示碰撞检测区域
            }
        }
    }
});