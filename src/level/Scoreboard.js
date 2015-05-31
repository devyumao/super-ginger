/**
 * @file 记分牌
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    var Scoreboard = function (game) {
        this.game = game;
        this.score = 0;
        this.text = null;
        this.board = null;

        this._init();
    };

    Scoreboard.prototype._init = function () {
        var game = this.game;

        var board = game.add.image(game.width / 2, 85, 'scoreboard');
        board.anchor.set(0.5);
        this.board = board;

        var text = game.add.text(
            0, 2,
            this.score + '',
            {
                font: 'bold 48px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        text.anchor.set(0.5);
        board.addChild(text);
        this.text = text;
    };

    Scoreboard.prototype.getScore = function () {
        return this.score;
    };

    Scoreboard.prototype.addScore = function (value) {
        this.score += value;
        this.text.text = this.score + '';
        // TODO: 动画
    };

    return Scoreboard;

});
