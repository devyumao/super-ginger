/**
 * @file 英雄
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Hero = function (game) {
        this.game = game;
        this.index = 0;
        this.sprite = null;

        this._init();
    };

    Hero.prototype._init = function () {
        var game = this.game;

        var sprite = game.add.image(110 - 5, game.height - 235, 'stage');
        sprite.scale.set(20, 30);
        sprite.anchor.set(1, 1);
        this.sprite = sprite;
    };

    Hero.prototype.walk = function (targetX, cb) {
        var game = this.game;
        var sprite = this.sprite;
        var duration = (targetX - sprite.x) * 3;

        var move = game.add.tween(sprite)
            .to({x: targetX}, duration, Phaser.Easing.Linear.None);
        cb && move.onComplete.add(cb);
        move.start();
    };

    Hero.prototype.getEl = function () {
        return this.sprite;
    };

    Hero.prototype.fall = function (cb) {
        var game = this.game;
        var sprite = this.sprite;

        var fall = game.add.tween(sprite)
            .to({y: game.height + sprite.height}, 250, Phaser.Easing.Linear.None, false, 100);
        cb && fall.onComplete.add(cb);
        fall.start();
    };

    return Hero;

});
