/**
 * @file 启动
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');

    function preload() {
        var path;
        var suffix;

        // TODO: common
        if (global.getMode() === 'dev') {
            path = 'src/img/';
            suffix = '.png';
        }
        else {
            path = 'http://ishowshao-game.qiniudn.com/super-gingerbread/asset/img/';
            suffix = '.png?v=*TIMESTAMP*';
        }

        this.game.load.spritesheet('boy-walk', path + 'boy/walk' + suffix, 76, 106);
    }

    function create() {
        var game = this.game;

        // 场景设置
        game.stage.backgroundColor = require('common/color').get('bg');

        // 屏幕振动插件设置
        game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);
        game.plugins.screenShake.setup({
            shakeX: false,
            shakeY: true,
            sensCoef: 0.3
        });

        // 比例设置
        var scale = this.scale;
        scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // 保持高宽比铺屏
        scale.pageAlignHorizontally = true;
        scale.pageAlignVertically = true;

        // 避免玩家看到屏幕适应的过程
        setTimeout(
            function () {
                game.state.start('preload');
            },
            100
        );
    }

    return {
        preload: preload,
        create: create
    };

});
