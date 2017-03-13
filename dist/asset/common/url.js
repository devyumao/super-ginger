/**
 * @file AJAX URL
 * @author yumao [zhangyu38@baidu.com]
 */

define(function () {

    var workSpace = 'http://farm.yiluwan.org/super-gingerbread/';

    return {
        GET_SIGNATURE: 'http://www.yiluwan.org/ecomui/xiaoyouxi?controller=ajax&action=gettoken',

        USE_FOOD: workSpace + 'food.php?type=minus',
        ADD_FOOD: workSpace + 'food.php?type=plus',
        LOAD_DATA: workSpace + 'storage.php',
        SAVE_DATA: workSpace + 'storage.php',
        GET_RANK: workSpace + 'rank.php'
    };
});
