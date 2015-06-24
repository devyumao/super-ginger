/**
 * @file 英雄
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var config = require('level/config');

    var Hero = function (game, options) {
        this.game = game;
        this.index = options.index;
        this.sprite = null;
        this.upsideDown = false;

        this._init();
    };

    Hero.prototype._init = function () {
        this._initConfig();
        this._initSprite();
    };

    Hero.prototype._initConfig = function () {
        var heroConfig = require('common/global').herosConfig[this.index];
        for (var key in heroConfig) {
            if (heroConfig.hasOwnProperty(key)) {
                this[key] = heroConfig[key];
            }
        }
    };

    Hero.prototype._initSprite = function () {
        var game = this.game;

        var sprite = game.add.sprite(
            (game.width + this.width * this.scale) / 2,
            game.height - config.initialHorizon
        );
        sprite.scale.set(this.scale);
        sprite.anchor.set(1, 1);
        this.sprite = sprite;

        this.down();
    };

    Hero.prototype.setForPlay = function (useAnim, cb) {
        var game = this.game;

        var x = 110 + this.paddingRight; // TODO: config
        var y = game.height - config.horizon;

        if (useAnim) {
            var move = game.add.tween(this.sprite)
                .to({x: x, y: y}, 200, Phaser.Easing.Linear.None);
            move.onComplete.add(
                function () {
                    this.down();
                    cb && cb();
                },
                this
            );
            this._act('walk', true);
            move.start();
        }
        else {
            var sprite = this.sprite;
            sprite.x = x;
            sprite.y = y;
        }
    };

    Hero.prototype._act = function (action, loop) {
        var sprite = this.sprite;
        var key = [this.name, action].join('-');
        if (sprite.key === key) {
            return;
        }
        sprite.loadTexture(key);
        !sprite.animations.getAnimation(action) && sprite.animations.add(action);
        sprite.animations.play(action, this.actions[action].fps, !!loop);
    };

    Hero.prototype.down = function () {
        this._act('down', true);
    };

    Hero.prototype.up = function () {
        this._act('up', true);
    };

    Hero.prototype.kick = function () {
        this._act('kick');
    };

    Hero.prototype.walk = function (targetX, cb) {
        var game = this.game;
        var sprite = this.sprite;

        sprite.bringToTop(); // 置顶

        // 不越过屏幕
        var maxX = game.width;
        targetX += this.paddingRight;
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

        var fall = game.add.tween(this.sprite)
            .to(
                {
                    y: game.height + (!this.upsideDown ? this.height : 0)
                },
                300, Phaser.Easing.Quadratic.In, false, 100
            );
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

    Hero.prototype.change = function (index, temporary) {
        global.setSelected(index, !temporary);

        this.index = index;
        this._initConfig();

        var game = this.game;
        var sprite = this.sprite;
        sprite.x = (game.width + this.width * this.scale) / 2;
        sprite.y = game.height - config.initialHorizon;
        sprite.scale.set(this.scale);

        this.down();

        var level = game.state.states.level;
        var stick = level.stick;
        if (stick) {
            // 棒棒速度
            stick.updateSpeed();
            // 棒棒材质
            stick.updateTexture();
            // 额外棒长
            stick.updateExtraLength();
        }
        stage = level.stage;
        // 食物几率
        stage.updateFoodProba();
        // 最小柱宽
        stage.updateMinWidth();
        // 糖浆乘数
        stage.updateSpotMultiple();
        // 糖浆宽度
        stage.updateSpotWidth();

        // 还原 selected index
        if (temporary) {
            global.setSelected(this.power.previousLife, false);
        }
    };

    // 续命大法好
    Hero.prototype.sustainLife = function () {
        this.change(this.power.nextLife, true);
        this.setForPlay(false);
    };

    Hero.prototype.twinkle = function (cb) {
        var twinkle = this.game.add.tween(this.sprite)
            .from({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 0, 1, true);
        cb && twinkle.onComplete.add(cb);
        twinkle.start();
    };

    return Hero;

});
