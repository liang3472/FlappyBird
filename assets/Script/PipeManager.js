var Gloable = require('Gloable');

cc.Class({
  extends: cc.Component,

  properties: {
    xSpeed: 0,          // 管道移动速度
    pipeNum: 0,         // 场景里最大管道数量
    pipeLayer: cc.Node, // 管道层
    pipePre: cc.Prefab, // 管道预置对象
    time: 0             // 管道生成时间
  },

  init: function (game) {
    this.game = game;
    Gloable.pipes = [];
    if (this._pipePool) { // 管道池 清理/创建
      this._pipePool.clear();
    } else {
      this._pipePool = new cc.NodePool();
    }
  },

  /**
   * 开启定时器生成管道
   */
  startPipe: function () {
    this._cleanPipes();
    this.schedule(this._createPipe, this.time, cc.macro.REPEAT_FOREVER, 0);
  },

  /**
   * 生成管道
   * @private
   */
  _createPipe: function () {
    var pipe;
    if (this._pipePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
      pipe = this._pipePool.get();
    } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
      pipe = cc.instantiate(this.pipePre);
    }

    pipe.setPosition(cc.p(this.pipeLayer.width / 2 + pipe.width / 2, 0));
    this.pipeLayer.addChild(pipe);
    var pipeCom = pipe.getComponent('Pipe');
    var bottom = this.game.ground.node.y + 100;
    var top = this.game.node.height / 2 - 100;
    pipeCom.init(this.game);
    pipeCom.setHight(bottom + Math.random() * (top - bottom)); //
    pipeCom.setSpeed(this.xSpeed);

    Gloable.pipes.push(pipeCom);
  },

  /**
   * 将管道加入对象池
   * @param pipe
   */
  put: function (pipe) {
    this._pipePool.put(pipe);
  },

  /**
   * 停止所有管道的移动
   */
  stopPipe: function () {
    this.unschedule(this._createPipe);
    Gloable.pipes.map((comp)=> {
      if (cc.isValid(comp)) {
        comp.stopMove();
      }
    });
  },

  /**
   * 清除所有管道
   * @private
   */
  _cleanPipes: function () {
    Gloable.pipes.map((comp)=> {
      if (cc.isValid(comp)) {
        this.pipeLayer.removeChild(comp);
        comp.destroy();
      }
    });

    Gloable.pipes = [];
    this.pipeLayer.removeAllChildren();
  }
});
