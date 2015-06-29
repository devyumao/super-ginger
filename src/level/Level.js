/**
 * @file 关卡 state
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var config = require('level/config');

    var Background = require('./ground/Background');
    var Midground = require('./ground/Midground');
    var Foreground = require('./ground/Foreground');
    var Fog = require('./Fog');

    var Start = require('./Start');
    var MenuBtns = require('./MenuBtns');
    var End = require('./End');

    var Stage = require('./Stage');
    var Hero = require('./Hero');
    var Stick = require('./Stick');

    var Scoreboard = require('./Scoreboard');
    var Foodboard = require('./Foodboard');
    var Tip = require('./Tip');
    var Combo = require('./Combo');

    var Level = function () {
    };

    Level.prototype._reset = function () {
        this.isHoldEnabled = false;
        this.isBeingHeld = false;

        this.isTouchEnabled = false;

        this.isFoodToBeAdded = false;

        this.shouldMgScroll = false;

        this.theme = this.game.rnd.between(1, 3);
        // this.theme = 3;

        global.resetShareText();
        require('common/weixin').updateShare();
    };

    // 转场
    Level.prototype._transition = function () {
        var Mask = require('common/ui/Mask');
        var mask = new Mask(this.game, {alpha: 1});
        mask.hide(150);
    };

    Level.prototype._initView = function () {
        var game = this.game;

        this.background = new Background(game, {index: this.theme});
        this.farMidground = new Midground(
            game,
            {
                index: this.theme,
                imagePrefix: 'mg-far'
            }
        );
        this.nearMidground = new Midground(
            game,
            {
                index: this.theme,
                imagePrefix: 'mg-near'
            }
        );
        this.fog = new Fog(game);
    };

    Level.prototype._initBaseObjs = function () {
        this._initView();

        var game = this.game;
        this.stage = new Stage(game, {index: this.theme});
        this.hero = new Hero(game, {index: global.getSelected()});
    };

    Level.prototype._initMenuStatus = function () {
        this._initBaseObjs();

        var game = this.game;
        
        this.start = new Start(
            game,
            {
                callback: this._initPlayStatus,
                context: this
            }
        );
        this.menuBtns = new MenuBtns(game);

        var title = game.add.image(game.width / 2, 100, 'title');
        title.scale.set(0.9);
        title.anchor.set(0.5, 0);
        title.alpha = 0.75;
        this.title = title;
    };

    Level.prototype._initPlayStatus = function () {
        var game = this.game;

        if (this.status === 'play') {
            this._initBaseObjs();

            this.hero.setForPlay(false);
            this.stage.setForPlay(false);

            this.isHoldEnabled = true;
        }
        else {
            // 销毁菜单元素
            [this.title, this.start, this.menuBtns].forEach(function (item) {
                item.destroy();
            });

            this.hero.setForPlay(true);
            var me = this;
            this.stage.setForPlay(true, function () {
                me.status = 'play';
                me.isHoldEnabled = true;
            });
        }

        this.scoreboard = new Scoreboard(game);
        this.foodboard = new Foodboard(game);

        this.stick = new Stick(game);

        this.foreground = new Foreground(
            game,
            {
                objects: [this.stage, this.hero, this.stick]
            }
        );

        // this._showReward();

        // 最高分不足2，则给玩法提示
        // 不设1，因为首次成功有偶然性，不一定是真会玩
        if (global.getHighest() < 2) {
            this.playTip = new Tip(game, {text: '按住屏幕\n使棒棒变长'});
        }

        this.combo = new Combo(game);

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
        var hasNewRecord = score > highest;

        hasNewRecord && global.setHighest(score);

        var stick = this.stick;
        stick.fall();

        var hero = this.hero;
        hero.fall(function () {
            me.game.plugins.screenShake.shake(10);
            setTimeout(
                function () {
                    if (hero.power.doubleLife) { // 双命重生
                        hero.sustainLife();
                        stick.setForPlay();
                        hero.twinkle();
                        me.isHoldEnabled = true;
                    }
                    else {
                        new End(
                            me.game,
                            {
                                score: score,
                                hasNewRecord: hasNewRecord
                            }
                        );
                    }
                },
                400
            );
        });
    };

    Level.prototype._showReward = function () {
        var color = require('common/color');

        // TODO: 对象化
        var game = this.game;

        // 加分文本
        var pointsText = game.add.text(
            this.stage.getSpotX(), game.height - config.horizon,
            '+' + this.stage.getSpotMultiple() * this.combo.get(),
            {
                font: 'bold 20px ' + global.fontFamily,
                fill: color.get('dark-grey')
            }
        );
        pointsText.anchor.set(0.5, 1);
        pointsText.alpha = 0;

        var duration = 700;

        var showPoints = game.add.tween(pointsText)
            .to({alpha: 0.8}, duration * 0.5, Phaser.Easing.Quadratic.Out, false);
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
        var praises = ['赞 哟 !', '好 棒 !', '└(^o^)┘'];
        var praiseText = game.add.text(
            game.width / 2, 230,
            praises[game.rnd.between(0, praises.length - 1)],
            {
                font: 'bold 36px ' + global.fontFamily,
                fill: color.get('dark-grey')
            }
        );
        praiseText.anchor.set(0.5, 0);
        praiseText.alpha = 0;
        var showPraise = game.add.tween(praiseText)
            .to({alpha: 0.8}, 400, Phaser.Easing.Quadratic.Out, false);
        var hidePraise = game.add.tween(praiseText)
            .to({alpha: 0}, 400, Phaser.Easing.Quadratic.In, false, 300);
        hidePraise.onComplete.add(function () {
            praiseText.destroy();
        });
        showPraise.chain(hidePraise);
        showPraise.start();
    };

    function onInputDown () {
        // this._showReward();

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
        var combo = this.combo;

        var currEdgeX = stage.getCurrEdgeX();
        var nextEdgeX = stage.getNextEdgeX();

        var me = this;

        hero.kick();
        // TODO: promises
        stick.layDown(function () {
            me.isTouchEnabled = true;

            if (stick.getFullLength() > stage.getInterval()) { // 长度足够
                if (stick.isInSpot(stage)) { // 命中红区
                    scoreboard.addScore(stage.getSpotMultiple() * combo.get());
                    combo.add();
                    me._showReward();
                }
                else {
                    combo.reset();
                }

                // 先走到 next 前沿
                hero.walk(
                    stage.getCurrEdgeX() + stage.getInterval(),
                    function () {
                        me.isTouchEnabled = false;
                        if (!hero.isUpsideDown()) {
                            // 没倒置，继续走
                            if (stick.isInStage(stage)) { // 成功啦
                                // 隐去提示
                                [me.playTip, me.foodTip].forEach(function (tip) {
                                    if (tip) {
                                        tip.hide();
                                        tip = null;
                                    }
                                });

                                hero.walk(
                                    nextEdgeX,
                                    function () {
                                        scoreboard.addScore(1);

                                        if (me.isFoodToBeAdded) {
                                            me.isFoodToBeAdded = false;
                                            global.setFoodCount(global.getFoodCount() + 1);
                                            foodboard.update();
                                        }

                                        me.shouldMgScroll = true;
                                        foreground.move(currEdgeX - nextEdgeX, function () {
                                            me.shouldMgScroll = false;
                                        });

                                        var options = stage.addNext(function () {
                                            stick.update();
                                            foreground.update();
                                            me.isHoldEnabled = true;
                                        });
                                        if (!global.getFoodCount() && options.hasFood) {
                                            me.foodTip = new Tip(
                                                me.game,
                                                {
                                                    text: '行走时点击屏幕\n可翻转角色吃果果'
                                                }
                                            );
                                        }
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

        // new End(this.game, {score: 29});

        this._transition();
    };

    Level.prototype.update = function () {
        this.background.scroll();

        if (this.status === 'play') {
            if (this.shouldMgScroll) {
                this.nearMidground.scroll(2);
                this.farMidground.scroll(1);
            }

            if (this.isHoldEnabled && this.isBeingHeld) {
                this.stick.lengthen();
            }

            var food = this.stage.getFood();
            if (food && food.isStartingBeingEaten(this.hero)) {
                this.isFoodToBeAdded = true;
            }
        }
    };

    return Level;

});
