/**
 * @file 开始按钮
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    var Start = function (game, options) {
        this.game = game;
        this.button = null;

        this._init(options);
    };

    Start.prototype._init = function (options) {
        var game = this.game;

        var button = game.add.button(
            game.width / 2, 400,
            'start',
            options.callback,
            options.context
        );
        button.anchor.set(0.5);

        var text = game.add.text(
            0, 0,
            '走 起',
            {
                font: 'bold 48px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        text.anchor.set(0.5);
        button.addChild(text);

        this.button = button;

        this._shake();
    };

    Start.prototype._shake = function () {
        this.game.add.tween(this.button)
            .to({y: '-15'}, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    };

    Start.prototype.destroy = function () {
        this.button.destroy();
    };

    return Start;

});
