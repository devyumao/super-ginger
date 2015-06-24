/**
 * @file 棒棒
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var config = require('level/config');

    var Stick = function (game) {
        this.game = game;
        this.image = null;
        this.trash = null;

        this.updateSpeed();
        this.updateTexture();
        this.updateExtraLength();

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

        var image = game.add.tileSprite(110, game.height - config.horizon, 5, 0.001, this.texture);
        image.anchor.set(0.5, 1);
        this.image = image;
    };

    Stick.prototype.setForPlay = function () {
        var image = this.image;
        image.height = 0;
        image.angle = 0;
    };

    Stick.prototype.lengthen = function () {
        if (this.image.height < this.game.height - config.horizon) {
            this.image.height += this.speed;
        }
    };

    Stick.prototype.layDown = function (cb) {
        var game = this.game;

        var rotate = game.add.tween(this.image)
            .to({angle: 90}, 400, Phaser.Easing.Quadratic.In, false, 150);
        cb && rotate.onComplete.add(cb);
        rotate.start();
    };

    Stick.prototype.fall = function (cb) {
        var game = this.game;

        var rotate = game.add.tween(this.image)
            .to({angle: 180}, 250, Phaser.Easing.Quadratic.In, false, 100);
        cb && rotate.onComplete.add(cb);
        rotate.start();
    };

    Stick.prototype.getEl = function () {
        return [this.image, this.trash];
    };

    Stick.prototype.getLength = function () {
        return this.image.height;
    };

    Stick.prototype.getFullLength = function () {
        return this.image.height + this.extraLength;
    };

    Stick.prototype.isBetween = function (lower, upper) {
        var length = this.getLength();
        return length > lower && length < upper;
    };

    Stick.prototype.isInStage = function (stage) {
        return this.isBetween(stage.getInterval() - this.extraLength, stage.getNextEdgeX() - stage.getCurrEdgeX());
    };

    Stick.prototype.isInSpot = function (stage) {
        var spotRange = stage.getSpotRange();
        return this.isBetween(spotRange.lower, spotRange.upper);
    };

    Stick.prototype.updateSpeed = function () {
        var speed = global.getHeroConfig().power.stickSpeed;
        this.speed = speed ? speed : 8;
    };

    Stick.prototype.updateTexture = function () {
        var texture = global.getHeroConfig().power.stickTexture;
        this.texture = texture ? texture : 'stick';
    };

    Stick.prototype.updateExtraLength = function () {
        var extraLength = global.getHeroConfig().power.stickExtraLength;
        this.extraLength = extraLength ? extraLength : 0;
    };

    return Stick;

});
