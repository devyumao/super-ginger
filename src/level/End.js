/**
 * @file 结束选单
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');

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
        var Mask = require('common/ui/Mask');
        this.mask = new Mask(this.game, {alpha: 0.6});
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

        var titleFontStyle = {
            font: '22px ' + global.fontFamily,
            fill: color.get('black')
        };

        var scoreTitle = game.add.text(
            0, 15,
            '分数',
            titleFontStyle
        );
        scoreTitle.anchor.set(0.5, 0);
        board.addChild(scoreTitle);

        var highestTitle = game.add.text(
            0, 108,
            '最佳',
            titleFontStyle
        );
        highestTitle.anchor.set(0.5, 0);
        board.addChild(highestTitle);

        var valueFontStyle = {
            font: 'bold 46px ' + global.fontFamily,
            fill: color.get('black')
        };

        var scoreValue = game.add.text(
            0, 45,
            this.score + '',
            valueFontStyle
        );
        scoreValue.anchor.set(0.5, 0);
        board.addChild(scoreValue);

        var hightest = global.getHighest();
        var highestValue = game.add.text(
            0, 138,
            hightest + '',
            valueFontStyle
        );
        highestValue.anchor.set(0.5, 0);
        board.addChild(highestValue);

        if (this.score > hightest) {
            var newRecord = game.add.image(
                scoreTitle.x + scoreTitle.width / 2 + 18,
                scoreTitle.y,
                'new-record'
            );
            board.addChild(newRecord);

            var newRecordText = game.add.text(
                newRecord.x + newRecord.width / 2,
                newRecord.y + 16,
                '新纪录',
                {
                    font: 'bold 18px ' + global.fontFamily,
                    fill: color.get('white')
                }
            );
            newRecordText.anchor.set(0.5);
            board.addChild(newRecordText);
        }
    };

    End.prototype._transition = function (cb) {
        var Mask = require('common/ui/Mask');
        var mask = new Mask(this.game, {alpha: 1});
        mask.show(150, cb);
    };

    End.prototype._initBtns = function () {
        var me = this;
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
                text: '返回菜单',
                onClick: function () {
                    me._transition(function () {
                        game.state.start('level', true, false, 'menu');
                    });
                }
            },
            {
                texture: 'end-btn',
                text: '再玩一次',
                onClick: function () {
                    me._transition(function () {
                        game.state.start('level', true, false, 'play');
                    });
                }
            }
        ];

        btnConfigs.forEach(function (config, index) {
            var btn = game.add.button(0, 360 + index * 80, config.texture, config.onClick);
            btn.anchor.set(0.5);
            util.addHover(btn);
            body.addChild(btn);

            var text = game.add.text(
                0, 3,
                config.text,
                {
                    font: 'bold 30px ' + global.fontFamily,
                    fill: color.get(config.texture === 'end-btn' ? 'coffee' : 'white')
                }
            );
            text.anchor.set(0.5);
            btn.addChild(text);
        });
    };

    End.prototype._show = function () {
        var duration = 500;
        this.mask.show(duration);
        this.game.add.tween(this.body)
            .from({alpha: 0}, duration, Phaser.Easing.Quadratic.InOut, true);
    };

    return End;

});
