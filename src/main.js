/**
 * @file 主程序
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    function init() {
        require('common/weixin').init();
        initGame();
    }

    function initGame() {
        var game = new Phaser.Game(480, 800, Phaser.CANVAS, '');

        game.state.add('boot', require('boot'));
        game.state.add('preload', require('preload'));
        game.state.add('level', require('level/Level'));

        game.state.start('boot');
    }

    return {
        init: init
    };

});
