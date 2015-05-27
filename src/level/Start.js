/**
 * @file 开始按钮
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

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
            '开始',
            {
                fill: '#fff'
            }
        );
        text.fontSize = 40;
        text.anchor.set(0.5);

        button.addChild(text);

        this.button = button;
    };

    Start.prototype.destroy = function () {
        this.button.destroy();
    };

    return Start;

});
