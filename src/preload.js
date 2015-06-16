/**
 * @file 预加载
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    function preload() {
        var game = this.game;

        initLoading(game);
        loadResources(game);
    }

    // loading global
    function initLoading(game) {
        var loadingText = game.add.text(
            game.width / 2, 260,
            '姜饼人正在路上...',
            {
                font: 'bold 30px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        loadingText.anchor.set(0.5);

        var hero = game.add.sprite(game.width / 2, game.height / 2, 'boy-walk');
        hero.anchor.set(0.5);
        var action = 'walk';
        hero.animations.add(action);
        hero.animations.play(action, 6, true);
    }

    function loadResources(game) {
        var path;
        var suffix;

        if (global.getMode() === 'dev') {
            path = 'src/img/';
            suffix = '.png';
        }
        else {
            path = 'http://ishowshao-game.qiniudn.com/super-gingerbread/asset/img/';
            suffix = '.png?v=*TIMESTAMP*';
        }

        // TODO: 组织 img 目录
        game.load.image('transparent', path + 'transparent' + suffix);
        game.load.image('transparent-2', path + 'transparent-2' + suffix);

        ['black', 'white', 'beige', 'dark-beige'].forEach(function (color) {
            game.load.image('pixel-' + color, path + 'pixel/' + color + suffix);
        });

        game.load.image('spot', path + 'spot' + suffix);

        game.load.image('food', path + 'food' + suffix);
        game.load.image('food-with-halo', path + 'food-with-halo' + suffix);

        game.load.image('title', path + 'title' + suffix);
        game.load.image('start', path + 'start' + suffix);

        game.load.image('menu-btn', path + 'menu-btn' + suffix);
        game.load.image('icon-heart', path + 'icon-heart' + suffix);
        game.load.image('icon-hero', path + 'icon-hero' + suffix);
        game.load.image('icon-podium', path + 'icon-podium' + suffix);

        game.load.image('scoreboard', path + 'scoreboard' + suffix);

        game.load.image('popup-edge', path + 'popup-edge' + suffix);
        game.load.image('popup-header', path + 'popup-header' + suffix);
        game.load.image('panel-edge', path + 'panel-edge' + suffix);
        game.load.image('btn-up', path + 'btn-up' + suffix);
        game.load.image('btn-down', path + 'btn-down' + suffix);
        game.load.image('btn-unlock', path + 'btn-unlock' + suffix);
        game.load.image('btn-confirm', path + 'btn-confirm' + suffix);
        game.load.image('me-tip', path + 'me-tip' + suffix);

        game.load.image('end-board', path + 'end-board' + suffix);
        game.load.image('end-btn', path + 'end-btn' + suffix);
        game.load.image('end-btn-share', path + 'end-btn-share' + suffix);
        game.load.image('new-record', path + 'new-record' + suffix);

        game.load.spritesheet('stick', path + 'stick' + suffix, 5, 24);
        game.load.spritesheet('stick-cold', path + 'stick-cold' + suffix, 5, 24);

        global.herosConfig.forEach(function (hero) {
            var name = hero.name;
            var actions = hero.actions;
            for (var action in actions) {
                if (actions.hasOwnProperty(action)) {
                    if (name === 'boy' && action === 'walk') {
                        continue;
                    }
                    game.load.spritesheet(
                        [name, action].join('-'),
                        path + name + '/' + action + suffix,
                        hero.width, hero.height
                    );
                }
            }
        });

        // game.load.spritesheet('baguette-walk', path + 'baguette/' + 'walk' + suffix, 101, 159);

        [1582, 1783, 1311].forEach(function (width, index) {
            var no = index + 1;
            var dir = path + 'view-' + no + '/';
            game.load.spritesheet('bg-' + no, dir + 'bg' + suffix, width, 800);
            game.load.spritesheet('mg-far-' + no, dir + 'mg-far' + suffix, width, 800);
            game.load.spritesheet('mg-near-' + no, dir + 'mg-near' + suffix, width, 800);
        });

        game.load.spritesheet('stage-1', path + 'stage-1' + suffix, 300, 266);
        game.load.spritesheet('stage-2', path + 'stage-2' + suffix, 300, 243);
        game.load.spritesheet('stage-3', path + 'stage-3' + suffix, 300, 245);

        game.load.image('thanks', path + 'thanks' + suffix);
    }

    function create() {
        global.getMode() === 'dev' && global.initFoodCount();

        // TODO: serverData
        var me = this;
        var keys = ['highest', 'selected', 'unlocks', 'shared'];
        var storage = global.getStorage(keys);
        var serverKeys = [];
        for (var key in storage) {
            if (storage.hasOwnProperty(key) && storage[key] === null) {
                serverKeys.push(key);
            }
        }
        var localKeys = [];
        keys.forEach(function (key) {
            if (serverKeys.indexOf(key) === -1) {
                localKeys.push(key);
            }
        });

        // for test
        // localkeys = [];
        // serverKeys = keys;
        
        localKeys.length && global.assignStorage(localKeys);

        if (serverKeys.length) {
            var serverData = require('common/serverData');
            serverData.load(
                serverKeys,
                function (res) {
                    res = JSON.parse(res);
                    var missingKeys = [];
                    serverKeys.forEach(function (key) {
                        if (!res.hasOwnProperty(key)) {
                            missingKeys.push(key);
                        }
                    });
                    global.initStorage(missingKeys);
                    global.setStorage(res);
                    startLevel();
                },
                function (err) {
                    if (global.getMode() === 'dev' || global.getNickname === 'devyumao') {
                        global.initStorage(serverKeys);
                    }
                    startLevel();
                }
            );
        }
        else {
            startLevel();
        }

        function startLevel() {
            // 与以往不同，menu -> level 是连贯场景，所以实际是同一 state
            me.state.start('level', true, false, 'menu');
        }
    }

    return {
        preload: preload,
        create: create
    };

});
