/**
 * @file 背景
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var config = require('level/config');

    var Background = function (game, options) {
        this.game = game;
        this.image = null;
        this.index = options.index;

        this._init();
    };

    Background.prototype._init = function () {
        var game = this.game;

        var imageName = 'bg-' + this.index;
        var image = game.add.tileSprite(
            0, 0,
            game.cache.getImage(imageName).width, game.height,
            imageName
        );
        this.image = image;
        image.tilePosition.x -= config.themes[this.index].offset;
        // image.alpha = 0.8;
    };

    Background.prototype.scroll = function () {
        this.image.tilePosition.x -= 0.3;
    };

    return Background;

});
