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
        Popup.call(this, game, options);
    };
    util.inherits(ThankPopup, Popup);

    ThankPopup.prototype._initContent = function () {
        // var game = this.game;

        // var text = game.add.text(
        //     0, 340,
        //     '献给爱吃甜点的你',
        //     {
        //         font: 'bold 38px ' + global.fontFamily,
        //         fill: color.get('white'),
        //         strokeThickness: 7,
        //         stroke: '#ed9c00'
        //     }
        // );
        // text.anchor.set(0.5, 0);
        // this.body.addChild(text);

        // var picture = game.add.image(0, 200, 'thanks');
        // picture.scale.set(0.6);
        // // picture.angle = 30;
        // picture.anchor.set(0.5);
        // this.body.addChild(picture);
    };

    return ThankPopup;

});
