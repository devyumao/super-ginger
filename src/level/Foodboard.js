/**
 * @file 食物栏
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');

    var Foodboard = function (game) {
        this.game = game;
        this.text = null;
        this.legend = null;

        this._init();
    };

    Foodboard.prototype._init = function () {
        var game = this.game;

        var text = game.add.text(
            game.width - 50, 20,
            global.getFoodCount() + '',
            {
                fill: '#999'
            }
        );
        text.anchor.set(1, 0);
        text.fontSize = 20;
        this.text = text;

        var legend = game.add.image(game.width - 20, 20, 'food');
        legend.scale.set(20);
        legend.anchor.set(1, 0);
        this.legend = legend;
    };

    Foodboard.prototype.update = function () {
        this.text.text = global.getFoodCount() + '';
    };

    return Foodboard;

});
