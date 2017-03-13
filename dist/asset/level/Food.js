/**
 * @file 食物
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var config = require('level/config');

    var Food = function (game, options) {
        this.game = game;
        this.image = null;
        this.isEaten = false;
        this.shaking = null;

        this._init(options);
    };

    Food.prototype._init = function (options) {
        var game = this.game;
        var imageName = 'food-with-halo';

        var padding = (game.cache.getImage(imageName).width - config.foodWidth) / 2;
        this.image = game.add.image(options.x - padding, options.y - padding, 'food-with-halo');
        this._shake();
    };

    Food.prototype._shake = function () {
        this.shaking = this.game.add.tween(this.image)
            .to({y: '8'}, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    };

    Food.prototype._stopShaking = function () {
        this.shaking.stop();
    };

    Food.prototype.destroy = function () {
        this.image.destroy();
    };

    Food.prototype.getEl = function () {
        return this.image;
    };

    Food.prototype.isStartingBeingEaten = function (hero) {
        if (this.isEaten || !hero.isUpsideDown()) {
        // if (this.isEaten) {
            return false;
        }

        var image = this.image;

        var foodLeft = image.x;
        var foodRight = image.x + image.width;
        var heroRight = hero.getX(); // XXX: 注意 hero 的 anchor x 是 1 (右侧)
        var heroLeft = heroRight - hero.getWidth();

        if (foodLeft < heroRight && foodRight > heroLeft) {
            this.beEaten();
            return true;
        }

        return false;
    };

    Food.prototype.beEaten = function () {
        this.isEaten = true;

        this._stopShaking();

        var image = this.image;
        // 调整中心及位置以适应动画
        image.anchor.set(0.5);
        image.x += image.width / 2;
        image.y += image.height / 2;

        // 消失动画
        var vanish = this.game.add.tween(image.scale)
            .to({x: 0, y: 0}, 100, Phaser.Easing.Quadratic.In);
        vanish.onComplete.add(
            function () {
                this.destroy();
            },
            this
        );
        vanish.start();
    };

    return Food;

});
