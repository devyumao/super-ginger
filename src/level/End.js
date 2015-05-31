/**
 * @file 结束选单
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');

    var End = function (game, options) {
        this.game = game;
        this.mask = null;
        this.body = null;
        this.score = options.score;

        this._init();
    };

    End.prototype._init = function () {
        this._initMask();
        this._initBody();
        this._initBoard();
        this._initTitle();
        this._initBtns();

        this._show();
    };

    End.prototype._initMask = function () {
        var game = this.game;

        var mask = game.add.image(0, 0, 'pixel-black');
        mask.scale.set(game.width, game.height);
        mask.alpha = 0.6;
        this.mask = mask;
    };

    End.prototype._initBody = function () {
        var game = this.game;

        var body = game.add.image(game.width / 2, 80);
        body.anchor.set(0.5, 0);
        this.body = body;
    };

    End.prototype._initTitle = function () {
        var title = this.game.add.text(
            0, 0,
            '结束啦',
            {
                font: 'bold 50px ' + global.fontFamily,
                fill: color.get('white')
            }
        );
        title.anchor.set(0.5, 0);
        this.body.addChild(title);
    };

    // TODO: 新纪录样式
    End.prototype._initBoard = function () {
        var game = this.game;
        var body = this.body;

        var board = game.add.image(0, 90, 'end-board');
        board.anchor.set(0.5, 0);
        body.addChild(board);

        var scoreTitle = game.add.text(
            0, 15,
            '分数',
            {
                font: '22px ' + global.fontFamily,
                fill: color.get('black')
            }
        );
        scoreTitle.anchor.set(0.5, 0);
        board.addChild(scoreTitle);

        var score = game.add.text(
            0, 45,
            this.score + '',
            {
                font: 'bold 46px ' + global.fontFamily,
                fill: color.get('black')
            }
        );
        score.anchor.set(0.5, 0);
        board.addChild(score);

        var highestTitle = game.add.text(
            0, 108,
            '最佳',
            {
                font: '22px ' + global.fontFamily,
                fill: color.get('black')
            }
        );
        highestTitle.anchor.set(0.5, 0);
        board.addChild(highestTitle);

        var highest = game.add.text(
            0, 138,
            global.getHighest(),
            {
                font: 'bold 46px ' + global.fontFamily,
                fill: color.get('black')
            }
        );
        highest.anchor.set(0.5, 0);
        board.addChild(highest);
    };

    End.prototype._initBtns = function () {
        var game = this.game;
        var body = this.body;
        var btnConfigs = [
            {
                texture: 'end-btn-share',
                text: '炫耀一下',
                onClick: function () {
                    
                }
            },
            {
                texture: 'end-btn',
                text: '返回老家',
                onClick: function () {
                    game.state.start('level', true, false, 'menu');
                }
            },
            {
                texture: 'end-btn',
                text: '再来一次',
                onClick: function () {
                    game.state.start('level', true, false, 'play');
                }
            }
        ];

        btnConfigs.forEach(function (config, index) {
            var btn = game.add.button(0, 360 + index * 80, config.texture, config.onClick);
            btn.anchor.set(0.5);
            body.addChild(btn);

            var text = game.add.text(
                0, 3,
                config.text,
                {
                    font: '30px ' + global.fontFamily,
                    fill: color.get('white')
                }
            );
            text.anchor.set(0.5);
            btn.addChild(text);
        });
    };

    End.prototype._show = function () {
        var game = this.game;

        [this.mask, this.body].forEach(function (el) {
            game.add.tween(el)
                .from({alpha: 0}, 500, Phaser.Easing.Quadratic.InOut, true);
        });
    };

    // End.prototype._hide = function () {
    //     var game = this.game;

    //     [this.mask, this.body].forEach(function (el) {
    //         game.add.tween(el)
    //             .to({alpha: 0}, 500, Phaser.Easing.Quadratic.InOut, true);
    //     });
    // };

    // End.prototype._destroy = function () {
    //     this.mask.destroy();
    //     this.body.destroy();
    // };

    return End;

});
