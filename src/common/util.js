/**
 * @file 工具
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    function random(lower, upper) {
        return Math.floor(lower + Math.random() * (upper - lower + 1));
    }

    function isArray(item) {
        return Object.prototype.toString.call(item).slice(8, -1) === 'Array';
    }

    return {
        random: random,
        isArray: isArray
    };

});
