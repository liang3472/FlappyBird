var Gloable = require('Gloable');

cc.Class({
  extends: cc.Component,

  properties: {
    pipeUp: cc.Node,    // 上管道
    pipeDown: cc.Node   // 下管道
  },

  init: function (game) {
    this.game = game;
    this._isPass = false;
  },

  /**
   * 设置管道高度
   * @param hight
   */
  setHight: function (hight) {
    this.node.y = hight;
  },

  /**
   * 设置管道移动速度
   * @param speed
   */
  setSpeed: function (speed) {
    this._speed = speed;
  },

  /**
   * 管道停止移动
   */
  stopMove: function () {
    this._isStop = true;
  },

  /**
   * 检测管道和小鸟的碰撞
   */
  checkHit: function () {
    if (this.node.parent) {
      var isHit = false;
      var pipeWidth = this.node.width;
      var birdWidth = this.game.bird.node.width;
      var birdHeight = this.game.bird.node.height;

      // 水管左右边界
      var pipeLeft = this.node.x - pipeWidth / 2;
      var pipeRight = this.node.x + pipeWidth / 2;

      // 水管上下边界
      var pipeTop = this.node.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.pipeUp.getPosition())).y;
      var pipeBottom = this.node.parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this.pipeDown.getPosition())).y;

      var birdPot = this.node.parent.convertToNodeSpaceAR(this.game.node.convertToWorldSpaceAR(this.game.bird.node.getPosition()));
      var birdLeft = birdPot.x - birdWidth / 2;
      var birdRight = birdPot.x + birdWidth / 2;
      var birdTop = birdPot.y + birdHeight;
      var birdBottom = birdPot.y;

      // 上水管检测
      if (birdTop >= pipeTop && birdRight >= pipeLeft && birdLeft <= pipeRight) {
        isHit = true;
      }
      // 下水管检测
      if (birdBottom <= pipeBottom && birdRight >= pipeLeft && birdLeft <= pipeRight) {
        isHit = true;
      }

      if(birdLeft > pipeRight && !this._isPass){
        this._isPass = true;
      }

      if (isHit) {
        this.game.onGameOver();
      }
    }
  },

  /**
   * 检测管道是否在屏幕之外
   */
  checkOutSide: function () {
    var left = -this.node.parent.width / 2; // 左边界
    if (this.node.x < left - this.node.width) {
      var pipe = Gloable.pipes.shift();
      this.game.pipeMng.put(pipe.node);
    }
  },

  update: function (dt) {
    this.checkOutSide();
    this.checkHit();
    if (!this._isStop) {
      this.node.x += dt * this._speed;
    }
  }

});