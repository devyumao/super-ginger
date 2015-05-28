/**
 * @file 棍子
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Stick = function (game) {
        this.game = game;
        this.image = null;
        this.trash = null;

        this._init();
    };

    Stick.prototype._init = function () {
        this.update();
    };

    Stick.prototype.update = function () {
        var game = this.game;

        if (this.image) {
            this.trash && this.trash.destroy(false);
            this.trash = this.image;
        }

        var image = game.add.tileSprite(110, game.height - 235, 5, 0.001, 'stick');
        image.anchor.set(0.5, 1);
        this.image = image;
    };

    Stick.prototype.lengthen = function () {
        if (this.image.height < this.game.height - 235) {
            this.image.height += 6;
        }
    };

    // Stick.prototype._rotate = function (angle, delay, cb) {
    //     var game = this.game;

    //     var rotate = game.add.tween(this.image)
    //         .to({angle: angle}, 400, Phaser.Easing.Quadratic.Out, false, delay);
    //     cb && rotate.onComplete.add(cb);
    //     rotate.start();
    // };

    Stick.prototype.layDown = function (cb) {
        var game = this.game;

        var rotate = game.add.tween(this.image)
            .to({angle: 90}, 400, Phaser.Easing.Quadratic.Out);
        cb && rotate.onComplete.add(cb);
        rotate.start();
    };

    Stick.prototype.fall = function (cb) {
        var game = this.game;

        var rotate = game.add.tween(this.image)
            .to({angle: 180}, 250, Phaser.Easing.Quadratic.Out, false, 100);
        cb && rotate.onComplete.add(cb);
        rotate.start();
    };

    Stick.prototype.getEl = function () {
        return [this.image, this.trash];
    };

    Stick.prototype.getLength = function () {
        return this.image.height;
    };

    Stick.prototype.isBetween = function (lower, upper) {
        var length = this.getLength();
        return length > lower && length < upper;
    };

    Stick.prototype.isInStage = function (stage) {
        return this.isBetween(stage.getInterval(), stage.getNextEdgeX() - stage.getCurrEdgeX());
    };

    Stick.prototype.isInSpot = function (stage) {
        var spotRange = stage.getSpotRange();
        return this.isBetween(spotRange.lower, spotRange.upper);
    };

    return Stick;

});
