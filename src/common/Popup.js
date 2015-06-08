/**
 * @file 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Popup = function (game, options) {
        this.game = game;
        this.mask = null;
        this.body = null;
        this.group = game.add.group();
        this.width = game.cache.getImage('popup-edge').width;
        this.height = 520;
        this.hasHeader = true;
        this.title = '标题';

        this._init();
    };

    Popup.prototype._init = function () {
        this._initMask();
        this._initBody();
        this._initContainer();
        this._initContent();
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

        // for test
        body.events.onInputUp.add(function() {
            console.log('body');
        });

        var topEdge = game.add.image(0, 0, 'popup-edge');
        topEdge.anchor.set(0.5, 0);
        body.addChild(topEdge);

        var edgeHeight = topEdge.height;

        var container = game.add.image(0, edgeHeight, 'pixel-beige');
        container.scale.set(this.width, this.height - edgeHeight * 2);
        container.anchor.set(0.5, 0);
        body.addChild(container);

        var bottomEdge = game.add.image(0, edgeHeight * 2 + container.height, 'popup-edge');
        bottomEdge.scale.y *= -1;
        bottomEdge.anchor.set(0.5, 0);
        body.addChild(bottomEdge);
    };

    Popup.prototype._initContainer = function () {
        var game = this.game;

        var container = game.add.image(game.width / 2, game.height, 'transparent');
        container.anchor.set(0.5, 0);
        this.container = container;
    };

    Popup.prototype._initContent = function () {
    };

    Popup.prototype._show = function () {
        this.mask.show(500);

        var game = this.game;
        [this.body, this.container].forEach(function (el) {
            game.add.tween(el)
                .to({y: 150}, 600, Phaser.Easing.Back.Out, true);
        });
    };

    Popup.prototype._hide = function () {
        this.mask.hide(500);

        var game = this.game;
        [this.body, this.container].forEach(function (el) {
            game.add.tween(el)
                .to({y: game.height}, 600, Phaser.Easing.Back.In, true);
        });
        // TODO: destroy
    };

    Popup.prototype._initHeader = function () {
        var game = this.game;
        var header = game.add.image();
        this.body.addChild(header);
    };

    return Popup;

});
