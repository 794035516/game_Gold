
cc.Class({
    extends: cc.Component,
 
    properties: {

    },
 
    // LIFE-CYCLE CALLBACKS:
 
    onLoad () {
        this.rope = this.node.parent.getComponent("Rope");
    },
 
    start () {
 
    },
 
    onCollisionEnter: function (other, self) {
        this.rope.onCollisionEnter(other, self);
    },
    // update (dt) {},
});
 
