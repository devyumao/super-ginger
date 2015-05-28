/**
 * @file 关卡 state
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');

    var Level = function () {
    };

    Level.prototype._reset = function () {
        this.isHoldEnabled = false;
        this.isBeingHeld = false;

        this.isTouchEnabled = false;

        this.isFoodToBeAdded = false;

        this.shouldBgScroll = false;

        // this.theme = this.game.rnd.between(1, 2);
        this.theme = 2;
    };

    Level.prototype._initMenuStatus = function () {
        var game = this.game;

        var Background = require('./Background');
        this.background = new Background(
            game,
            {
                index: this.theme
            }
        );

        var Stage = require('./Stage');
        this.stage = new Stage(
            game,
            {
                index: this.theme
            }
        );

        var Hero = require('./Hero');
        this.hero = new Hero(game);

        var Start = require('./Start');
        this.start = new Start(
            game,
            {
                callback: this._initPlayStatus,
                context: this
            }
        );
    };

    Level.prototype._initPlayStatus = function () {
        var game = this.game;

        if (this.status === 'play') {
            var Background = require('./Background');
            this.background = new Background(
                game,
                {
                    index: this.theme
                }
            );

            var Stage = require('./Stage');
            this.stage = new Stage(
                game,
                {
                    index: this.theme
                }
            );

            var Hero = require('./Hero');
            this.hero = new Hero(game);

            this.hero.setForPlay(false);
            this.stage.setForPlay(false);

            this.isHoldEnabled = true;
        }
        else {
            this.start.destroy();

            this.hero.setForPlay(true);
            var me = this;
            this.stage.setForPlay(true, function () {
                me.status = 'play';
                me.isHoldEnabled = true;
            });
        }

        var Scoreboard = require('./Scoreboard');
        this.scoreboard = new Scoreboard(game);
        var Foodboard = require('./Foodboard');
        this.foodboard = new Foodboard(game);

        var Stick = require('./Stick');
        this.stick = new Stick(game);

        var Foreground = require('./Foreground');
        this.foreground = new Foreground(
            game,
            {
                objects: [this.stage, this.hero, this.stick]
            }
        );

        this._bindTouch();
    };

    Level.prototype._bindTouch = function () {
        var game = this.game;

        game.input.onDown.add(onInputDown, this);
        game.input.onUp.add(onInputUp, this);
    };

    Level.prototype._fail = function () {
        var me = this;

        var highest = global.getHighest();
        var score = this.scoreboard.getScore();

        score > highest && global.setHighest(score);

        this.stick.fall();
        this.hero.fall(function () {
            me.state.restart(true, false, 'play');
        });
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
        // this.isBeingHeld = true;

        var hero = this.hero;

        if (this.isHoldEnabled) {
            this.isBeingHeld = true;
            hero.up();
        }

        if (this.isTouchEnabled) {
            hero.flip();
        }
    }

    function onInputUp() {
        if (!this.isHoldEnabled || !this.isBeingHeld) {
            return;
        }

        this.isBeingHeld = false;
        this.isHoldEnabled = false;

        var hero = this.hero;
        var stage = this.stage;
        var stick = this.stick;
        var foreground = this.foreground;
        var scoreboard = this.scoreboard;
        var foodboard = this.foodboard;

        var currEdgeX = stage.getCurrEdgeX();
        var nextEdgeX = stage.getNextEdgeX();

        var me = this;

        hero.kick();
        // TODO: promises
        stick.layDown(function () {
            me.isTouchEnabled = true;

            if (stick.getLength() > stage.getInterval()) { // 长度足够
                if (stick.isInSpot(stage)) { // 命中红区
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

                            if (stick.isInStage(stage)) { // 成功啦
                                hero.walk(
                                    nextEdgeX,
                                    function () {
                                        scoreboard.addScore(1);

                                        if (me.isFoodToBeAdded) {
                                            me.isFoodToBeAdded = false;
                                            global.setFoodCount(global.getFoodCount() + 1);
                                            foodboard.update();
                                        }

                                        me.shouldBgScroll = true;
                                        foreground.move(currEdgeX - nextEdgeX, function () {
                                            me.shouldBgScroll = false;
                                        });

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
                                    currEdgeX + stick.getLength() + 12,
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
                    currEdgeX + stick.getLength() + 12,
                    function () {
                        me.isTouchEnabled = false;

                        me._fail();
                    }
                );
            }
        });
    }

    Level.prototype.init = function (status) {
        this.status = status;
    };

    Level.prototype.create = function () {
        this._reset();

        switch (this.status) {
            case 'menu':
                this._initMenuStatus();
                break;
            case 'play':
                this._initPlayStatus();
                break;
        }
    };

    Level.prototype.update = function () {
        if (this.status !== 'play') {
            return;
        }

        if (this.shouldBgScroll) {
            this.background.scroll();
        }

        if (this.isHoldEnabled && this.isBeingHeld) {
            this.stick.lengthen();
        }

        var food = this.stage.getFood();
        if (food && food.isStartingBeingEaten(this.hero)) {
            this.isFoodToBeAdded = true;
        }
    };

    return Level;

});
