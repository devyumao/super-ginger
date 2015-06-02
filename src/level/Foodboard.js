/**
 * @file 食物栏
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    var Foodboard = function (game) {
        this.game = game;
        this.text = null;
        this.legend = null;

        this._init();
    };

    Foodboard.prototype._init = function () {
        var game = this.game;

        var text = game.add.text(
            game.width - 63, 20,
            global.getFoodCount() + '',
            {
                font: 'bold 30px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        text.anchor.set(1, 0);
        this.text = text;

        var legend = game.add.image(game.width - 20, 18, 'food');
        legend.width = 35;
        legend.height = legend.width;
        legend.anchor.set(1, 0);
        this.legend = legend;
    };

    Foodboard.prototype.update = function () {
        this.text.text = global.getFoodCount() + '';
    };

    return Foodboard;

});
