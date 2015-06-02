/**
 * @file 商店 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/Popup');

    var StorePopup = function (game, options) {
        Popup.call(this, game, options);
    };
    util.inherits(StorePopup, Popup);

    StorePopup.prototype._initContent = function () {
        // for text
        var game = this.game;
        var body = this.body;

        var title = game.add.text(0, 60, '测试用');
        title.anchor.set(0.5, 0);
        body.addChild(title);

        var storeData = [
            {
                food: 100,
                money: 0.99
            },
            {
                food: 250,
                money: 1.99
            },
            {
                food: 700,
                money: 4.99
            }
        ];

        var href = encodeURIComponent(location.href.split('#')[0]);
        storeData.forEach(function (data, index) {
            var btn = game.add.button(
                0, 170 + 100 * index,
                'pixel-orange',
                function () {
                    console.log('haha');
                    window.open(
                        'http://pay.yiluwan.org/pay-center/index.php?'
                        + 'item=000' + (index + 6) // 商品 index 从6开始
                        + '&redirect=' + href
                    );
                }
            );
            btn.scale.set(300, 60);
            btn.anchor.set(0.5);
            body.addChild(btn);

            var text = game.add.text(
                0, 155 + 100 * index,
                data.food + ' 果子    ' + data.money
            );
            text.anchor.set(0.5, 0);
            body.addChild(text);
        });
    };

    return StorePopup;

});
