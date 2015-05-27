/**
 * @file 食物
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Food = function (game, options) {
        this.game = game;
        this.image = null;
        this.isEaten = false;

        this._init(options);
    };

    Food.prototype._init = function (options) {
        var image = this.game.add.image(options.x, options.y, 'food');
        image.scale.set(20);
        this.image = image;
        this._shake();
    };

    Food.prototype._shake = function () {
        this.game.add.tween(this.image)
            .to({y: '8'}, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
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
        // TODO: 动画
        this.destroy();
        this.isEaten = true;
    };

    return Food;

});
