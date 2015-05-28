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

        game.load.spritesheet('boy-down', path + 'boy-down.png', 76, 103);
        game.load.spritesheet('boy-up', path + 'boy-up.png', 76, 106);
        game.load.spritesheet('boy-walk', path + 'boy-walk.png', 76, 106);
        game.load.spritesheet('boy-kick', path + 'boy-kick.png', 76, 103);

        game.load.spritesheet('stick', path + 'stick.png', 5, 24);

        game.load.spritesheet('bg-1', path + 'bg-1.png', 1582, 800);
        game.load.spritesheet('bg-2', path + 'bg-2.png', 1783, 800);

        game.load.spritesheet('stage-1', path + 'stage-1.png', 300, 266);
        game.load.spritesheet('stage-2', path + 'stage-2.png', 300, 243);
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
