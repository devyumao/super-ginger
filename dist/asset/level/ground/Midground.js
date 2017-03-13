/**
 * @file 中景
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var config = require('level/config');

    var Midground = function (game, options) {
        this.game = game;
        this.image = null;
        this.imagePrefix = options.imagePrefix;
        this.index = options.index;

        this._init();
    };

    Midground.prototype._init = function () {
        var game = this.game;

        var imageName = this.imagePrefix + '-' + this.index;
        var image = game.add.tileSprite(
            0, 0,
            game.cache.getImage(imageName).width, game.height,
            imageName
        );
        this.image = image;
        image.tilePosition.x -= config.themes[this.index].offset;
        // image.alpha = 0.8;
    };

    Midground.prototype.scroll = function (offset) {
        this.image.tilePosition.x -= offset;
    };

    return Midground;

});
