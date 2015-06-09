/**
 * @file 预加载
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');

    function preload() {
        var game = this.game;

        var path = global.getBasePath() +'/img/';

        // TODO: 组织 img 目录
        game.load.image('transparent', path + 'transparent.png');

        ['black', 'white', 'beige', 'orange', 'dark-beige'].forEach(function (color) {
            game.load.image('pixel-' + color, path + 'pixel/' + color +'.png');
        });

        game.load.image('spot', path + 'spot.png');

        game.load.image('food', path + 'food.png');
        game.load.image('food-with-halo', path + 'food-with-halo.png');

        game.load.image('title', path + 'title.png');
        game.load.image('start', path + 'start.png');

        game.load.image('menu-btn', path + 'menu-btn.png');
        game.load.image('icon-heart', path + 'icon-heart.png');
        game.load.image('icon-hero', path + 'icon-hero.png');

        game.load.image('scoreboard', path + 'scoreboard.png');

        game.load.image('popup-edge', path + 'popup-edge.png');
        game.load.image('popup-header', path + 'popup-header.png');
        game.load.image('popup-container', path + 'popup-container.png');
        game.load.image('panel-edge', path + 'panel-edge.png');
        game.load.image('btn-up', path + 'btn-up.png');
        game.load.image('btn-down', path + 'btn-down.png');
        game.load.image('btn-unlock', path + 'btn-unlock.png');

        game.load.image('end-board', path + 'end-board.png');
        game.load.image('end-btn', path + 'end-btn.png');
        game.load.image('end-btn-share', path + 'end-btn-share.png');

        global.herosConfig.forEach(function (hero) {
            var name = hero.name;
            var actions = hero.actions;
            for (var action in actions) {
                if (actions.hasOwnProperty(action)) {
                    game.load.spritesheet(
                        [name, action].join('-'),
                        path + name + '/' + action + '.png',
                        hero.width, hero.height
                    );
                }
            }
        });

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

        global.getBasePath() === 'src' && global.initFoodCount(); // TODO: dev or prod
        // FIX: 并发请求
        global.initHighest(function () {
            // 与以往不同，menu -> level 是连贯场景，所以实际是同一 state
            me.state.start('level', true, false, 'menu');
        });
    }

    return {
        preload: preload,
        create: create
    };

});
