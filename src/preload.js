/**
 * @file 预加载
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    function preload() {
        var game = this.game;

        var path = 'src/img/';

        game.load.image('stage', path + 'stage.png');
        game.load.image('spot', path + 'spot.png');
    }

    function create() {
        this.state.start('level');
    }

    return {
        preload: preload,
        create: create
    };

});
