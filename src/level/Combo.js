/**
 * @file 连击显示
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    var Combo = function (game) {
        this.game = game;
        this.count = 0;
        this.body = null;
        this.countText = null;

        this._init();
    };

    Combo.prototype._init = function () {
        var game = this.game;

        var body = game.add.image(20, 168);
        body.alpha = 0;
        this.body = body;

        var label = game.add.text(
            0, 0,
            'COMBO',
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('orange'),
                strokeThickness: 8,
                stroke: color.get('white')
            }
        );
        label.anchor.set(0, 0.5);
        body.addChild(label);
        
        var multipleSign = game.add.text(
            label.width + 5, 0,
            '×',
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        multipleSign.anchor.set(0, 0.5);
        body.addChild(multipleSign);

        var countText = game.add.text(
            multipleSign.x + multipleSign.width + 18, 0,
            this.count + '',
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('cherry'),
                strokeThickness: 8,
                stroke: color.get('white')
            }
        );
        countText.anchor.set(0.5);
        this.countText = countText;
        body.addChild(countText);
    };

    Combo.prototype.get = function () {
        return this.count;
    };

    Combo.prototype._show = function () {
        this.game.add.tween(this.body)
            .to({alpha: 1}, 300, Phaser.Easing.Quadratic.Out, true);
    };

    Combo.prototype._hide = function (cb) {
        this.game.add.tween(this.body)
            .to({alpha: 0}, 300, Phaser.Easing.Quadratic.In, true);
    };

    Combo.prototype.add = function () {
        if (!this.count) {
            this._show();
        }

        var countText = this.countText;
        countText.text = ++this.count + '';

        var game = this.game;
        var duration = 200;
        var easingQuadratic = Phaser.Easing.Quadratic;

        var largen = game.add.tween(countText.scale)
            .to({x: 1.5, y: 1.5}, duration, easingQuadratic.Out);
        var recover = game.add.tween(countText.scale)
            .to({x: 1, y: 1}, duration, easingQuadratic.In);
        largen.chain(recover);
        largen.start();
    };

    Combo.prototype.reset = function () {
        if (this.count) {
            this._hide();
            this.count = 0;
        }
    };

    return Combo;

});
