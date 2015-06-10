/**
 * @file 全屏遮掩
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Mask = function (game, options) {
        this.game = game;
        this.image = null;
        this.alpha = options.alpha ? options.alpha : 1;
        this.ease = Phaser.Easing.Quadratic.InOut;
        this.onTouch = options.onTouch ? options.onTouch : null;

        this._init();
    };

    Mask.prototype._init = function () {
        var game = this.game;

        var image = game.add.image(0, 0, 'pixel-black');
        image.scale.set(game.width / image.width, game.height / image.height);
        image.alpha = this.alpha;
        image.inputEnabled = true; // 屏蔽被遮掩层的交互
        this.image = image;

        this.onTouch && this._bindTouch(this.onTouch);
    };

    Mask.prototype.show = function (duration, cb) {
        var show = this.game.add.tween(this.image)
            .from({alpha: 0}, duration, this.ease);
        cb && show.onComplete.add(cb);
        show.start();
    };

    Mask.prototype.hide = function (duration, cb) {
        var hide = this.game.add.tween(this.image)
            .to({alpha: 0}, duration, this.ease);
        hide.onComplete.add(
            function () {
                this._destroy();
                cb && cb();
            },
            this
        );
        hide.start();
    };

    Mask.prototype._bindTouch = function (onTouch) {
        this.image.events.onInputUp.add(onTouch);
    };

    Mask.prototype._destroy = function () {
        this.image.destroy();
    };

    return Mask;

});
