/**
 * @file 记分牌
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Scoreboard = function (game) {
        this.game = game;
        this.score = 0;
        this.text = null;

        this._init();
    };

    Scoreboard.prototype._init = function () {
        var game = this.game;

        var text = game.add.text(
            game.width / 2, 60,
            this.score + '',
            {
                fill: '#999'
            }
        );
        text.anchor.set(0.5, 0);
        text.fontSize = 40;

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
