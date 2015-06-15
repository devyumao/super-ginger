/**
 * @file 鸣谢 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/ui/Popup');

    var ThankPopup = function (game, options) {
        Popup.call(
            this, game,
            {
                hasHeader: false,
                height: 450
            }
        );
        this._init();
    };
    util.inherits(ThankPopup, Popup);

    ThankPopup.prototype._initContent = function () {
        // 后门: 上线前注释掉
        global.clearStorage();

        var game = this.game;
        var container = this.container;
        var x = this.containerWidth / 2;

        var picture = game.add.image(x, 50, 'thanks');
        picture.anchor.set(0.5, 0);
        container.addChild(picture);

        var panelWidth = 300;

        var topEdge = game.add.image(x, picture.y + picture.height + 25, 'panel-edge');
        topEdge.anchor.set(0.5, 0);
        topEdge.width = panelWidth;
        container.addChild(topEdge);

        var main = game.add.image(x, topEdge.y + topEdge.height, 'pixel-dark-beige');
        main.anchor.set(0.5, 0);
        main.scale.set(panelWidth, 50);
        container.addChild(main);

        var bottomEdge = game.add.image(x, main.y + main.height + topEdge.height, 'panel-edge');
        bottomEdge.anchor.set(0.5, 0);
        bottomEdge.scale.y = -1;
        bottomEdge.width = panelWidth;
        container.addChild(bottomEdge);

        var text = game.add.text(
            x, main.y + main.height / 2,
            '献给爱吃甜点的你',
            {
                font: 'bold 30px ' + global.fontFamily,
                fill: color.get('chocolate'),
                strokeThickness: 7,
                stroke: color.get('beige')
            }
        );
        text.anchor.set(0.5);
        container.addChild(text);
    };

    return ThankPopup;

});
