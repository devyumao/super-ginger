/**
 * @file 预加载
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');

    function preload() {
        var game = this.game;

        var path = 'src/img/';

        // TODO: 组织 img 目录
        game.load.image('spot', path + 'spot.png');
        game.load.image('food', path + 'food.png');

        ['black', 'white', 'beige'].forEach(function (color) {
            game.load.image('pixel-' + color, path + 'pixel/' + color +'.png');
        });

        game.load.image('title', path + 'title.png');
        game.load.image('start', path + 'start.png');

        game.load.image('menu-btn', path + 'menu-btn.png');
        game.load.image('icon-heart', path + 'icon-heart.png');
        game.load.image('icon-hero', path + 'icon-hero.png');

        game.load.image('scoreboard', path + 'scoreboard.png');
        game.load.image('popup-edge', path + 'popup-edge.png');

        game.load.image('end-board', path + 'end-board.png');
        game.load.image('end-btn', path + 'end-btn.png');
        game.load.image('end-btn-share', path + 'end-btn-share.png');

        game.load.spritesheet('boy-down', path + 'boy-down.png', 76, 103);
        game.load.spritesheet('boy-up', path + 'boy-up.png', 76, 106);
        game.load.spritesheet('boy-walk', path + 'boy-walk.png', 76, 106);
        game.load.spritesheet('boy-kick', path + 'boy-kick.png', 76, 103);

        game.load.spritesheet('girl-down', path + 'girl-down.png', 80, 109);

        game.load.spritesheet('stick', path + 'stick.png', 5, 24);

        [1582, 1783, 1311].forEach(function (width, index) {
            var no = index + 1;
            var dir = path + 'view-' + no + '/';
            game.load.spritesheet('bg-' + no, dir + 'bg.png', width, 800);
            game.load.spritesheet('mg-far-' + no, dir + 'mg-far.png', width, 800);
            game.load.spritesheet('mg-near-' + no, dir + 'mg-near.png', width, 800);
        });

        game.load.spritesheet('stage-1', path + 'stage-1.png', 300, 266);
        game.load.spritesheet('stage-2', path + 'stage-2.png', 300, 243);
        game.load.spritesheet('stage-3', path + 'stage-3.png', 300, 247);

        game.load.image('thanks', path + 'thanks.png');
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
