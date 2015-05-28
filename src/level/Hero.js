/**
 * @file 英雄
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Hero = function (game) {
        this.game = game;
        this.index = 0;
        this.sprite = null;
        this.upsideDown = false;

        this._init();
    };

    Hero.prototype._init = function () {
        var game = this.game;

        var sprite = game.add.sprite((game.width + 76 / 2) / 2, game.height - 150, 'boy-down');
        sprite.scale.set(0.5);
        sprite.anchor.set(1, 1);
        this.sprite = sprite;

        this.down();
        // this.up();
    };

    Hero.prototype.setForPlay = function (useAnim, cb) {
        var game = this.game;

        var x = 110;
        var y = game.height - 235;

        if (useAnim) {
            var move = game.add.tween(this.sprite)
                .to({x: x, y: y}, 200, Phaser.Easing.Linear.None);
            cb && move.onComplete.add(cb);
            move.start();
        }
        else {
            var sprite = this.sprite;
            sprite.x = x;
            sprite.y = y;
        }
    };

    Hero.prototype._act = function (action, frameRate, loop) {
        var sprite = this.sprite;
        var key = 'boy-' + action;
        sprite.key !== key && sprite.loadTexture(key); // 避免重载（loadTexture 较耗内存）
        !sprite.animations.getAnimation(action) && sprite.animations.add(action);
        sprite.animations.play(action, frameRate, !!loop);
        console.log(action);
    };

    Hero.prototype.down = function () {
        this._act('down', 6, true);
    };

    Hero.prototype.up = function () {
        this._act('up', 10, true);
    };

    Hero.prototype.kick = function () {
        this._act('kick', 24);
    };

    Hero.prototype.walk = function (targetX, cb) {
        var game = this.game;
        var sprite = this.sprite;

        sprite.bringToTop(); // 置顶

        // 不越过屏幕
        var maxX = game.width;
        if (targetX > maxX) {
            targetX = maxX;
        }

        var duration = (targetX - sprite.x) * 3;

        var move = game.add.tween(sprite)
            .to({x: targetX}, duration, Phaser.Easing.Linear.None);
        move.onComplete.add(
            function () {
                this.down();
                cb && cb();
            },
            this
        );

        this._act('walk', 28, true);

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

    Hero.prototype.flip = function () {
        this.sprite.scale.y *= -1;
        this.upsideDown = !this.upsideDown;
    };

    Hero.prototype.isUpsideDown = function () {
        return this.upsideDown;
    };

    Hero.prototype.getX = function () {
        return this.sprite.x;
    };

    Hero.prototype.getWidth = function () {
        return this.sprite.width;
    };

    return Hero;

});
