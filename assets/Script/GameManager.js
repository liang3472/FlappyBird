var Bird = require('Bird');
var Ground = require('Ground');
var Sky = require('Sky');
var PipeManager = require('PipeManager');
var GameState = {
  START: 0,     // 游戏开始前
  PLAYING: 1,   // 游戏进行中
  END: 2        // 游戏结束后
};

cc.Class({
  extends: cc.Component,

  properties: {
    bird: Bird,           // 小鸟
    ground: Ground,       // 地面
    sky: Sky,             // 天空
    menu: cc.Node,        // 菜单节点
    pipeMng: PipeManager, // 管道管理类
    title: cc.Node        // 标题
  },

  initConfig: function () {
    cc.director.setDisplayStats(true); // 显示fps
  },

  onLoad: function () {
    this.initConfig();
    this.pipeMng.init(this);
    this.toggleGameState(GameState.START)
    this.node.on('touchstart', function (event) { // 监听触摸开始事件
      if(this.currState === GameState.PLAYING ){
        this.bird.onJump();
      }
    }, this);
  },

  /**
   * 切换游戏状态
   * @param state
   */
  toggleGameState: function (state) {
    this.currState = state;
    switch (this.currState) {
      case GameState.START:
        this.title.active = true;
        this.menu.active = true;
        break;
      case GameState.END:
        this.title.active = true;
        this.menu.active = true;
        this.pipeMng.stopPipe();
        break;
      default:
        this.title.active = false;
        this.menu.active = false;
        break;
    }
  },

  /**
   * 游戏结束回调
   */
  onGameOver: function () {
    this.toggleGameState(GameState.END);
  },

  /**
   * 点击开始按钮
   */
  clickStart: function () {
    this.toggleGameState(GameState.PLAYING);
    this.bird.onStart();
    this.bird.onJump();
    this.pipeMng.startPipe();
  },

  update: function (dt) {
    if (this.currState === GameState.PLAYING || this.currState === GameState.END) {
      if (this.bird.node.y > this.ground.node.y) { // 当小鸟没有碰到地面
        this.bird.onDrop(dt);
      } else {  // 当小鸟碰到地面，则游戏结束
        this.onGameOver();
      }
    }
  }
});
