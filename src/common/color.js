/**
 * @file 颜色
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var colors = {
        bg: '#fff',
        white: '#fff',
        black: '#000',
        chocolate: '#a45d35'
    };

    function get(color) {
        return colors[color];
    }

    return {
        get: get
    };

});
