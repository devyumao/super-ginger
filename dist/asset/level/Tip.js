/**
 * @file 提示
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    var Tip = function (game, options) {
        this.game = game;
        this.text = options.text;
        this.textText = null;

        this._init();
    };

    Tip.prototype._init = function () {
        var game = this.game;

        var textText = game.add.text(
            game.width / 2, 135,
            this.text,
            {
                font: 'bold 26px ' + global.fontFamily,
                fill: color.get('dark-grey'),
                align: 'center'
            }
        );
        textText.alpha = 0.8;
        textText.anchor.set(0.5, 0);
        this.textText = textText;

        this._show();
    };

    Tip.prototype._show = function () {
        this.game.add.tween(this.textText)
            .from({alpha: 0}, 300, Phaser.Easing.Quadratic.Out, true);
    };

    Tip.prototype.hide = function () {
        var hide = this.game.add.tween(this.textText)
            .to({alpha: 0}, 300, Phaser.Easing.Quadratic.In);
        hide.onComplete.add(
            function () {
                this._destroy();
            },
            this
        );
        hide.start();
    };

    Tip.prototype._destroy = function () {
        this.textText.destroy();
    };

    return Tip;

});
