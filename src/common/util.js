/**
 * @file 工具
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var util = {};

    util.isArray = function (item) {
        return Object.prototype.toString.call(item).slice(8, -1) === 'Array';
    };

    util.proba = function (p) {
        p = p * 10 || 1;
        var odds = Math.floor(Math.random() * 10);
        return p === 1 || odds < p;
    };

    /**
     * 设置继承关系
     *
     * @param {function} type 子类
     * @param {function} superType 父类
     * @return {function} 子类
     */
    util.inherits = function (type, superType) {
        var Empty = function () {};
        Empty.prototype = superType.prototype;
        var proto = new Empty();

        var originalPrototype = type.prototype;
        type.prototype = proto;

        for (var key in originalPrototype) {
            proto[key] = originalPrototype[key];
        }
        type.prototype.constructor = type;

        return type;
    };

    util.addHover = function (btn, target) {
        var events = btn.events;
        target = target ? target : btn;
        var originAlpha = target.alpha;

        events.onInputDown.add(function () {
            target.alpha = originAlpha * 0.8;
        });
        events.onInputUp.add(function () {
            target.alpha = originAlpha;
        });
    };

    return util;

});
