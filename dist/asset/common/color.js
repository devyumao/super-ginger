/**
 * @file 颜色
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var colors = {
        'bg': '#000',
        'white': '#fff',
        'black': '#000',
        'dark-grey': '#555',
        'darker-grey': '#333',
        'chocolate': '#a45d35',
        'beige': '#ffecb8',
        'dark-beige': '#e1d0a1',
        'coffee': '#554d36',
        'yellow': '#ffcd43',
        'cherry': '#ef6c65',
        'orange': '#ffad5d'
    };

    function get(color) {
        return colors[color];
    }

    return {
        get: get
    };

});
