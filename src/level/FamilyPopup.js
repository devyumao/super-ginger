/**
 * @file 英雄家族 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var util = require('common/util');
    var Popup = require('common/Popup');

    var FamilyPopup = function (game, options) {
        Popup.call(this, game, options);
    };
    util.inherits(FamilyPopup, Popup);

    FamilyPopup.prototype._initContent = function () {
        var game = this.game;
        var container = this.container;

        var test = game.add.image(0, 40, 'stage-1');
        test.anchor.set(0.5, 0);
        // test.scale.set(150, 300);
        container.addChild(test);

        var cropRect = new Phaser.Rectangle(0, 0, 100, 100);
        test.crop(cropRect);
    };

    return FamilyPopup;

});
