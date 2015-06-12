/**
 * @file 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    var Popup = function (game, options) {
        if (!options) {
            options = {};
        }

        this.game = game;

        this.mask = null;
        this.body = null;
        this.header = null;
        this.container = null;

        this.main = null;
        this.topEdge = null;
        this.bottomEdge = null;

        this.elements = [];

        this.hasHeader = !!options.hasHeader;
        this.headerType = options.headerType ? options.headerType : '';
        this.headerIcon = options.headerIcon ? options.headerIcon : '';

        this.width = game.cache.getImage('popup-edge').width;
        this.height = options.height ? options.height : 520;
        this.y = options.y ? options.y : 120;
        this.paddingHorz = 12;
        this.paddingTop = 30;
        this.paddingBottom = options.paddingBottom ? options.paddingBottom : 30;

        this.containerWidth = this.width - 2 * this.paddingHorz;
        this.containerHeight = 0;

        this.title = options.title ? options.title : '';

        // this._init();
    };

    Popup.prototype._init = function () {
        this._initMask();
        this._initBody();
        this.hasHeader && this._initHeader();
        this._initContainer();
        this._initContent();
        // this._initCover();

        this._show();
    };

    Popup.prototype._initMask = function () {
        var me = this;
        var Mask = require('common/ui/Mask');

        this.mask = new Mask(
            this.game,
            {
                alpha: 0.3,
                onTouch: function () {
                    me._hide();
                }
            }
        );
    };

    Popup.prototype._initBody = function () {
        var game = this.game;

        var body = game.add.image(game.width / 2, game.height);
        body.anchor.set(0.5, 0);
        body.inputEnabled = true;
        this.body = body;
        this.elements.push(body);

        var topEdge = game.add.image(0, 0, 'popup-edge');
        topEdge.anchor.set(0.5, 0);
        body.addChild(topEdge);
        this.topEdge = topEdge;

        var edgeHeight = topEdge.height;

        var main = game.add.image(0, edgeHeight, 'pixel-beige');
        main.scale.set(this.width, this.height - edgeHeight * 2);
        main.anchor.set(0.5, 0);
        body.addChild(main);
        this.main = main;

        var bottomEdge = game.add.image(0, edgeHeight * 2 + main.height, 'popup-edge');
        bottomEdge.scale.y = -1;
        bottomEdge.anchor.set(0.5, 0);
        body.addChild(bottomEdge);
        this.bottomEdge = bottomEdge;
    };

    Popup.prototype._initHeader = function () {
        var game = this.game;

        var header = game.add.image(
            -this.width / 2,
            game.cache.getImage('popup-header').height / 2,
            'popup-header'
        );
        header.anchor.set(0, 0.5);
        this.body.addChild(header);
        this.header = header;

        var padding = 12;

        var titleText = game.add.text(
            padding, 3,
            this.title,
            {
                font: 'bold 30px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        titleText.anchor.set(0, 0.5);
        header.addChild(titleText);

        switch (this.headerType) {
            case 'icon':
                var icon = game.add.image(this.width - padding, 0, this.headerIcon);
                icon.width = 35;
                icon.height = icon.width;
                icon.anchor.set(1, 0.5);
                header.addChild(icon);
                break;
            case 'food':
                var food = game.add.image(this.width - padding, 0, 'food');
                food.width = 30;
                food.height = food.width;
                food.anchor.set(1, 0.5);
                header.addChild(food);

                var foodCountText = game.add.text(
                    food.x - food.width - 10, 3,
                    global.getFoodCount() + '',
                    {
                        font: 'bold 24px ' + global.fontFamily,
                        fill: color.get('dark-grey')
                    }
                );
                foodCountText.anchor.set(1, 0.5);
                header.addChild(foodCountText);
                break;
        }
    };

    Popup.prototype._initContainer = function () {
        var game = this.game;
        var margin = this.paddingHorz;

        if (this.hasHeader) {
            this.paddingTop = this.header.height;
        }

        var container = game.add.image(
            (game.width - this.width) / 2 + margin,
            game.height + this.paddingTop
        );
        this.containerHeight = this.height - this.paddingTop - this.paddingBottom;
        this.container = container;
        this.elements.push(container);

        this._initCrop();
    };

    Popup.prototype._initCrop = function () {
        var game = this.game;
        var margin = this.paddingHorz;
        var container = this.container;

        // 框定可视区域
        var crop = this.game.add.graphics(0, 0);
        crop.beginFill(0xffffff);
        crop.drawRect(
            container.x, game.height + this.paddingTop,
            this.width - margin * 2, this.containerHeight
        );
        crop.endFill();
        container.mask = crop;
        this.elements.push(crop);
    };

    Popup.prototype._initContent = function () {

    };

    Popup.prototype._setHeight = function (height) {
        var originHeight = this.height;
        this.height = height;
        var heightDiff = height - originHeight;

        this.main.height += heightDiff;
        this.bottomEdge.y += heightDiff;

        this.container.mask.destroy();
        this.containerHeight += heightDiff;
        this._initCrop();
    };

    Popup.prototype._show = function () {
        this.mask.show(500);

        var game = this.game;
        var y = this.y;
        this.elements.forEach(function (el) {
            game.add.tween(el)
                .to({y: y - game.height + ''}, 600, Phaser.Easing.Back.Out, true);
        });
    };

    Popup.prototype._hide = function (tweenEnabled) {
        this.mask.hide(500);

        var game = this.game;
        var y = this.y;

        if (typeof tweenEnabled === 'undefined') {
            tweenEnabled = true;
        }

        if (tweenEnabled) {
            this.elements.forEach(function (el) {
                var move = game.add.tween(el)
                    .to({y: game.height - y + ''}, 600, Phaser.Easing.Back.In);
                move.onComplete.add(function () {
                    el.destroy();
                });
                move.start();
            });
        }
        else {
            this.elements.forEach(function (el) {
                el.destroy();
            });
        }
    };

    return Popup;

});
