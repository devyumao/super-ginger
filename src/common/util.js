/**
 * @file 工具
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    function isArray(item) {
        return Object.prototype.toString.call(item).slice(8, -1) === 'Array';
    }

    function proba(p) {
        p = p * 10 || 1;
        var odds = Math.floor(Math.random() * 10);
        return p === 1 || odds < p;
    }

    return {
        isArray: isArray,
        proba: proba
    };

});
