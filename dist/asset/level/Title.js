/**
 * @file 标题
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Title = function (game) {
        this.game = game;
        this.image = null;

        this._init();
    };

    Title.prototype._init = function () {
        var game = this.game;

        var image = game.add.image(game.width / 2, 100, 'title');
        image.scale.set(0.9);
        image.anchor.set(0.5, 0);
        image.alpha = 0.75;
        this.image = image;
    };


    Title.prototype.destroy = function () {
        this.image.destroy();
    };

    return Title;

});
