/**
 * @file 关卡 state
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var Level = function () {
        this.isTouchEnabled = true;
        this.isBeingTouched = false;

        this.stage = null;
        this.hero = null;
        this.stick = null;
        this.foreground = null;
        this.scoreboard = null;
    };

    Level.prototype._reset = function () {
        this.isTouchEnabled = true;
        this.isBeingTouched = false;
    };

    Level.prototype._bindTouch = function () {
        var game = this.game;

        game.input.onDown.add(onInputDown, this);

        game.input.onUp.add(onInputUp, this);
    };

    function onInputDown () {
        this.isBeingTouched = true;
    }

    function onInputUp() {
        this.isBeingTouched = false;

        if (!this.isTouchEnabled) {
            return;
        }

        this.isTouchEnabled = false;

        var me = this;

        var stage = this.stage;
        var hero = this.hero;
        var stick = this.stick;
        var foreground = this.foreground;

        var currEdgeX = stage.getCurrEdgeX();
        var nextEdgeX = stage.getNextEdgeX();

        var isSucceed = stick.isBetween(stage.getInterval(), nextEdgeX - currEdgeX);
        var spotRange = stage.getSpotRange();
        var isInSpot = stick.isBetween(spotRange.lower, spotRange.upper);


        console.log(stick.getLength());
        console.log(spotRange);

        // TODO: promises
        stick.layDown(function () {

            hero.walk(
                isSucceed ? nextEdgeX - 5 : currEdgeX + stick.getLength(),
                function () {
                    if (isSucceed) {
                        foreground.move(currEdgeX - nextEdgeX);

                        stage.addNext(function () {
                            stick.update();

                            foreground.update();

                            var scoreboard = me.scoreboard;
                            if (isInSpot) {
                                console.log('NB!');
                                scoreboard.addScore(2);
                            }
                            else {
                                scoreboard.addScore(1);
                            }

                            me.isTouchEnabled = true;
                        });
                    }
                    else {
                        stick.fall();
                        hero.fall(function () {
                            me.state.restart();
                        });
                    }
                }
            );
        });
    }

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

    Level.prototype.create = function () {
        this._reset();
        this._initObjects();
        this._bindTouch();
    };

    Level.prototype.update = function () {
        if (this.isTouchEnabled && this.isBeingTouched) {
            this.stick.lengthen();
        }
    };

    return Level;

});
