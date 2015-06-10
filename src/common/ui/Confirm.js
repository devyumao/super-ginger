/**
 * @file 排行榜 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/ui/Popup');

    var Confirm = function (game, options) {
        Popup.call(
            this, game,
            {
                hasHeader: false,
                height: 280,
                y: 200
            }
        );

        this.text = options.text ? options.text : '';
        this.onConfirm = options.onConfirm;

        this._init();
    };
    util.inherits(Confirm, Popup);

    Confirm.prototype._initContent = function () {
        this._initText();
        this._initBtns();
    };

    Confirm.prototype._initText = function () {
        var game = this.game;
        var container = this.container;

        // TODO: 文字中 icon 定制化
        var textText = game.add.text(
            this.containerWidth / 2, 40,
            this.text,
            {
                font: '28px ' + global.fontFamily,
                fill: color.get('coffee'),
                align: 'center'
            }
        );
        textText.anchor.set(0.5, 0);
        textText.lineSpacing = 10;
        container.addChild(textText);
    };

    Confirm.prototype._initBtns = function () {
        var game = this.game;
        var container = this.container;
        var margin = 25;

        var btnConfirm = game.add.button(
            this.containerWidth / 2 + margin, this.containerHeight,
            'btn-confirm',
            function () {
                this.onConfirm();
                this._hide();
            },
            this
        );
        btnConfirm.anchor.set(0, 1);
        container.addChild(btnConfirm);

        var btnCancel = game.add.button(
            this.containerWidth / 2 - margin - btnConfirm.width, this.containerHeight,
            'btn-confirm',
            function () {
                this._hide();
            },
            this
        );
        btnCancel.anchor.set(0, 1);
        container.addChild(btnCancel);

        var fontStyle = {
            font: 'bold 30px ' + global.fontFamily,
            fill: color.get('coffee')
        };

        var confirmText = game.add.text(
            btnConfirm.width / 2, - btnConfirm.height / 2,
            '是',
            fontStyle
        );
        confirmText.anchor.set(0.5);
        btnConfirm.addChild(confirmText);

        var cancelText = game.add.text(
            btnCancel.width / 2, - btnCancel.height / 2,
            '否',
            fontStyle
        );
        cancelText.anchor.set(0.5);
        btnCancel.addChild(cancelText);
    };

    return Confirm;

});
