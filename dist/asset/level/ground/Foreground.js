/**
 * @file 前景
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var util = require('common/util');

    var Foreground = function (game, options) {
        this.game = game;
        this.objects = options.objects;
        this.elements = [];

        this._init();
    };

    Foreground.prototype._init = function () {
        this.update();
    };

    Foreground.prototype.update = function () {
        var elements = [];

        this.objects.forEach(function (obj) {
            var el = obj.getEl();
            if (!el) {
                return;
            }

            if (util.isArray(el)) { // TODO: util
                el.forEach(function (item) {
                    if (!item) {
                        return;
                    }

                    elements.push(item);
                });
            }
            else {
                elements.push(el);
            }
        });

        this.elements = elements;
    };

    Foreground.prototype.move = function (offsetX, cb) {
        var game = this.game;
        var elements = this.elements;

        offsetX += '';
        var len = elements.length;
        elements.forEach(function (el, index) {
            var move = game.add.tween(el)
                .to({x: offsetX}, 300, Phaser.Easing.Linear.None);
            if (cb && index === len - 1) {
                move.onComplete.add(cb);
            }
            move.start();
        });
    };

    return Foreground;

});
