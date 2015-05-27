/**
 * @file 预加载
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');

    function preload() {
        var game = this.game;

        var path = 'src/img/';

        game.load.image('stage', path + 'stage.png');
        game.load.image('spot', path + 'spot.png');
        game.load.image('food', path + 'food.png');
        game.load.image('start', path + 'start.png');

        game.load.image('boy', path + 'boy.png');
    }

    function create() {
        var me = this;

        // FIX: 并发请求
        global.initFoodCount(function () {
            global.initHighest(function () {
                // 与以往不同，menu -> level 是连贯场景，所以实际是同一 state
                me.state.start('level', true, false, 'menu');
            });
        });
    }

    return {
        preload: preload,
        create: create
    };

});
