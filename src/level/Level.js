/**
 * @file 关卡 state
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Level = function () {
        this.stage = null;
        this.hero = null;
        this.stick = null;
        this.foreground = null;
        this.scoreboard = null;
    };

    Level.prototype._reset = function () {
        this.isHoldEnabled = true;
        this.isBeingHeld = false;

        this.isTouchEnabled = false;
    };

    Level.prototype._initObjects = function () {
        var game = this.game;

        var Scoreboard = require('./Scoreboard');
        this.scoreboard = new Scoreboard(game);

        var Stage = require('./Stage');
        this.stage = new Stage(game);
        var Hero = require('./Hero');
        this.hero = new Hero(game);
        var Stick = require('./Stick');
        this.stick = new Stick(game);

        var Foreground = require('./Foreground');
        this.foreground = new Foreground(
            game,
            {
                objects: [this.stage, this.hero, this.stick]
            }
        );
    };

    Level.prototype._bindTouch = function () {
        var game = this.game;

        game.input.onDown.add(onInputDown, this);

        game.input.onUp.add(onInputUp, this);
    };

    Level.prototype._fail = function () {
        var me = this;

        this.stick.fall();
        this.hero.fall(function () {
            me.state.restart();
        });
    };

    Level.prototype.isStickInStage = function () {
        var stage = this.stage;
        return this.stick.isBetween(stage.getInterval(), stage.getNextEdgeX() - stage.getCurrEdgeX());
    };

    Level.prototype.isStickInSpot = function () {
        var spotRange = this.stage.getSpotRange();
        console.log(this.stick.getLength());
        console.log(spotRange);
        return this.stick.isBetween(spotRange.lower, spotRange.upper);
    };

    Level.prototype._showReward = function () {
        var game = this.game;

        // 加分文本
        var pointsText = game.add.text(
            this.stage.getSpotX(), game.height - 235,
            '+1',
            {
                fill: '#999'
            }
        );
        pointsText.anchor.set(0.5, 1);
        pointsText.fontSize = 20;
        pointsText.alpha = 0;

        var duration = 700;

        var showPoints = game.add.tween(pointsText)
            .to({alpha: 1}, duration * 0.5, Phaser.Easing.Quadratic.Out, false);
        var hidePoints = game.add.tween(pointsText)
            .to({alpha: 0}, duration * 0.5, Phaser.Easing.Quadratic.In, false);
        var risePoints = game.add.tween(pointsText)
            .to({y: '-20'}, duration, Phaser.Easing.Linear.None, false);
        risePoints.onComplete.add(function () {
            pointsText.destroy();
        });
        showPoints.chain(hidePoints);
        showPoints.start();
        risePoints.start();

        // 赞美之词
        var praiseText = game.add.text(
            game.width / 2, 160,
            'Perfect!',
            {
                fill: '#999'
            }
        );
        praiseText.anchor.set(0.5, 0);
        praiseText.fontSize = 36;
        praiseText.alpha = 0;
        var showPraise = game.add.tween(praiseText)
            .to({alpha: 1}, 400, Phaser.Easing.Quadratic.Out, false);
        var hidePraise = game.add.tween(praiseText)
            .to({alpha: 0}, 400, Phaser.Easing.Quadratic.In, false, 300);
        hidePraise.onComplete.add(function () {
            praiseText.destroy();
        });
        showPraise.chain(hidePraise);
        showPraise.start();
    };

    function onInputDown () {
        this.isBeingHeld = true;

        if (this.isTouchEnabled) {
            this.hero.flip();
        }
    }

    function onInputUp() {
        this.isBeingHeld = false;

        if (!this.isHoldEnabled) {
            return;
        }

        this.isHoldEnabled = false;

        var me = this;

        var stage = this.stage;
        var hero = this.hero;
        var stick = this.stick;
        var foreground = this.foreground;
        var scoreboard = this.scoreboard;

        var currEdgeX = stage.getCurrEdgeX();
        var nextEdgeX = stage.getNextEdgeX();

        // TODO: promises
        stick.layDown(function () {
            me.isTouchEnabled = true;

            if (stick.getLength() > stage.getInterval()) { // 长度足够
                if (me.isStickInSpot()) { // 命中红区
                    console.log('NB!');
                    scoreboard.addScore(1);
                    me._showReward();
                }

                // 先走到 next 前沿
                hero.walk(
                    stage.getCurrEdgeX() + stage.getInterval(),
                    function () {
                        if (!hero.isUpsideDown()) {
                            me.isTouchEnabled = false;
                            // 没倒置，继续走

                            if (me.isStickInStage()) { // 成功啦
                                hero.walk(
                                    nextEdgeX - 5,
                                    function () {
                                        scoreboard.addScore(1);

                                        foreground.move(currEdgeX - nextEdgeX);

                                        stage.addNext(function () {
                                            stick.update();
                                            foreground.update();
                                            me.isHoldEnabled = true;
                                        });
                                    }
                                );
                            }
                            else { // 走过了
                                hero.walk(
                                    currEdgeX + stick.getLength(),
                                    function () {
                                        me._fail();
                                    }
                                );
                            }
                        }
                        else {
                            // 倒置触壁，over
                            me._fail();
                        }
                    }
                );
            }
            else { // 长度不足
                hero.walk(
                    currEdgeX + stick.getLength(),
                    function () {
                        me.isTouchEnabled = false;

                        me._fail();
                    }
                );
            }
        });
    }

    Level.prototype.create = function () {
        this._reset();
        this._initObjects();
        this._bindTouch();
    };

    Level.prototype.update = function () {
        if (this.isHoldEnabled && this.isBeingHeld) {
            this.stick.lengthen();
        }
    };

    return Level;

});
