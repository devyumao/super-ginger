/**
 * @file 商店 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/ui/Popup');

    var StorePopup = function (game, options) {
        Popup.call(
            this, game,
            {
                hasHeader: true,
                headerType: 'food',
                title: '商店',
                height: 382
            }
        );

        this._init();
    };
    util.inherits(StorePopup, Popup);

    StorePopup.prototype._initContent = function () {
        var game = this.game;
        var container = this.container;
        var panel = {
            edgeHeight: game.cache.getImage('panel-edge').height,
            mainHeight: 60,
            width: game.cache.getImage('panel-edge').width,
            marginTop: 20
        };
        panel.height = panel.mainHeight + panel.edgeHeight * 2;

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
                0, (panel.marginTop + panel.height) * index + panel.marginTop,
                'transparent',
                function () {
                    window.open(
                        'http://pay.yiluwan.org/pay-center/index.php?'
                        + 'item=000' + (index + 6) // 商品 index 从6开始
                        + '&redirect=' + href
                    );
                }
            );
            util.addHover(btn);
            container.addChild(btn);

            var topEdge = game.add.image(0, 0, 'panel-edge');
            btn.addChild(topEdge);

            var main = game.add.image(0, topEdge.y + panel.edgeHeight, 'pixel-dark-beige');
            main.scale.set(panel.width, panel.mainHeight);
            btn.addChild(main);

            var bottomEdge = game.add.image(0, main.y + panel.mainHeight + panel.edgeHeight, 'panel-edge');
            bottomEdge.scale.y = -1;
            btn.addChild(bottomEdge);

            var food = game.add.image(30, panel.height / 2 - 4, 'food');
            food.scale.set(0.9);
            food.anchor.set(0, 0.5);
            btn.addChild(food);

            var numberText = game.add.text(
                210, panel.height / 2,
                '+' + data.food,
                {
                    font: 'bold 30px ' + global.fontFamily,
                    fill: color.get('cherry'),
                    strokeThickness: 5,
                    stroke: color.get('beige')
                }
            );
            numberText.anchor.set(1, 0.5);
            btn.addChild(numberText);

            var moneyText = game.add.text(
                panel.width - 30, panel.height / 2,
                '￥ ' + data.money,
                {
                    font: 'bold 26px ' + global.fontFamily,
                    fill: color.get('coffee'),
                }
            );
            moneyText.anchor.set(1, 0.5);
            btn.addChild(moneyText);
        });
    };

    return StorePopup;

});
