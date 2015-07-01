/**
 * @file level 配置
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    return {
        themes: {
            1: {
                offset: -80
            },
            2: {
                offset: 200
            },
            3: {
                offset: 100
            }
        },

        initialHorizon: 150,
        horizon: 235,
        currEdgeX: 110,

        foodWidth: 25,

        tips: {
            play: '按住屏幕\n使棒棒变长',
            food: '行走时点击屏幕\n可翻转角色吃果果'
        }
    };

});
