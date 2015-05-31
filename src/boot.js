/**
 * @file 启动
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

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

        this.state.start('preload');
    }

    return {
        create: create
    };

});
