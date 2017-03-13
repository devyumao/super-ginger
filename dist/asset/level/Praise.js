/**
 * @file 赞美
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var config = require('level/config');

    var Praise = function (game, options) {
        this.game = game;
        this.pointsText = null;
        this.praiseText = null;
        this.points = options.points;
        this.pointsX = options.pointsX;

        this._init();
    };

    Praise.prototype._init = function () {
        var game = this.game;

        var pointsText = game.add.text(
            this.pointsX, game.height - config.horizon,
            '+' + this.points,
            {
                font: 'bold 20px ' + global.fontFamily,
                fill: color.get('dark-grey')
            }
        );
        pointsText.anchor.set(0.5, 1);
        pointsText.alpha = 0;
        this.pointsText = pointsText;

        var sentences = ['赞 哟 !', '好 棒 !', '└(^o^)┘'];
        var praiseText = game.add.text(
            game.width / 2, 230,
            sentences[game.rnd.between(0, sentences.length - 1)],
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('dark-grey')
            }
        );
        praiseText.anchor.set(0.5, 0);
        praiseText.alpha = 0;
        this.praiseText = praiseText;

        this._tween();
    };

    Praise.prototype._tween = function () {
        var game = this.game;
        var duration = 700;

        var pointsText = this.pointsText;
        var showPoints = game.add.tween(pointsText)
            .to({alpha: 0.8}, duration * 0.5, Phaser.Easing.Quadratic.Out, false);
        var hidePoints = game.add.tween(pointsText)
            .to({alpha: 0}, duration * 0.5, Phaser.Easing.Quadratic.In, false);
        var risePoints = game.add.tween(pointsText)
            .to({y: '-20'}, duration, Phaser.Easing.Linear.None, false);
        risePoints.onComplete.add(function () {
            pointsText.destroy();
        });
        showPoints.chain(hidePoints);
        showPoints.start();
        risePoints.start();

        var praiseText = this.praiseText;
        var showPraise = game.add.tween(praiseText)
            .to({alpha: 0.8}, 400, Phaser.Easing.Quadratic.Out, false);
        var hidePraise = game.add.tween(praiseText)
            .to({alpha: 0}, 400, Phaser.Easing.Quadratic.In, false, 300);
        hidePraise.onComplete.add(function () {
            praiseText.destroy();
        });
        showPraise.chain(hidePraise);
        showPraise.start();
    };

    return Praise;

});
