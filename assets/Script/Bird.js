cc.Class({
  extends: cc.Component,

  properties: {
    gravity: 0,           // 重力加速度
    jumpSpeed: 0,         // 跳跃速度
    position: cc.Vec2     // 小鸟初始化的位置
  },

  init: function (game) {
    this.game = game;
  },

  /**
   * 开始
   */
  onStart: function () {
    this.node.setPosition(this.position);
    this.currV = 0;
  },

  /**
   * 跳跃
   */
  onJump: function () {
    this.currV = this.jumpSpeed;
  },

  /**
   * 下落
   * @param dt
   */
  onDrop: function (dt) {
    this.currV = this.currV + dt * this.gravity;
    this.node.y -= this.currV;
  }
});
