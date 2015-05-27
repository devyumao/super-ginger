/**
 * @file 颜色
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var colors = {
        'bg': '#FFE6CD'
    };

    function get(color) {
        return colors[color];
    }

    return {
        get: get
    };

});
