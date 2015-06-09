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

        this.elements = [];

        this.hasHeader = !!options.hasHeader;
        this.headerType = options.headerType ? options.headerType : '';
        this.headerIcon = options.headerIcon ? options.headerIcon : '';

        this.width = game.cache.getImage('popup-edge').width;
        this.height = options.height ? options.height : 520;
        this.y = 120;
        this.paddingHorz = 12;
        this.paddingBottom = options.paddingBottom ? options.paddingBottom : 30;

        this.title = options.title ? options.title : '';

        this._init();
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
        var Mask = require('common/Mask');

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

        var edgeHeight = topEdge.height;

        var main = game.add.image(0, edgeHeight, 'pixel-beige');
        main.scale.set(this.width, this.height - edgeHeight * 2);
        main.anchor.set(0.5, 0);
        body.addChild(main);

        var bottomEdge = game.add.image(0, edgeHeight * 2 + main.height, 'popup-edge');
        bottomEdge.scale.y = -1;
        bottomEdge.anchor.set(0.5, 0);
        body.addChild(bottomEdge);
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
                font: '30px ' + global.fontFamily,
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
        var margin = 12;

        var container = game.add.image(
            (game.width - this.width) / 2 + margin,
            game.height + this.header.height
        );
        this.container = container;
        this.elements.push(container);

        // 框定可视区域
        var crop = this.game.add.graphics(0, 0);
        crop.beginFill(0xffffff);
        crop.drawRect(
            container.x, game.height + this.header.height,
            this.width - margin * 2, this.height - this.header.height - this.paddingBottom
        );
        crop.endFill();
        container.mask = crop;
        this.elements.push(crop);
    };

    Popup.prototype._initContent = function () {
    };

    // // HACK
    // Popup.prototype._initCover = function () {
    //     var game = this.game;

    //     var upperCover = game.add.button(
    //         0, 0,
    //         'transparent',
    //         function () {
    //             this._hide();
    //         },
    //         this
    //     );
    //     upperCover.scale.set(game.width, this.y);

    //     var lowerCover = game.add.button(
    //         0, 0,
    //         'transparent',
    //         function () {
    //             this._hide();
    //         },
    //         this
    //     );
    //     upperCover.scale.set(game.width, this.y);
    // };

    Popup.prototype._show = function () {
        this.mask.show(500);

        var game = this.game;
        var y = this.y;
        this.elements.forEach(function (el) {
            game.add.tween(el)
                .to({y: y - game.height + ''}, 600, Phaser.Easing.Back.Out, true);
        });
    };

    Popup.prototype._hide = function () {
        this.mask.hide(500);

        var game = this.game;
        var y = this.y;
        this.elements.forEach(function (el) {
            var move = game.add.tween(el)
                .to({y: game.height - y + ''}, 600, Phaser.Easing.Back.In);
            move.onComplete.add(function () {
                el.destroy();
            });
            move.start();
        });
    };

    return Popup;

});
