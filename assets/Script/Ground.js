cc.Class({
  extends: cc.Component,

  properties: {
    xSpeed: 0,  // 背景滚动速度
    xWidth: 0   // 背景切换的距离
  },

  // called every frame, uncomment this function to activate update callback
  update: function (dt) { // 背景无限滚动逻辑
    if (this.node.x <= this.xWidth) {
        this.node.x = 0;
    } else {
        this.node.x += dt * this.xSpeed;
    }
  }
});
