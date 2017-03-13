/**
 * @file 关卡 state
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var config = require('level/config');

    // 引入场景类
    var Background = require('./ground/Background');
    var Midground = require('./ground/Midground');
    var Foreground = require('./ground/Foreground');
    var Fog = require('./Fog');

    // 引入菜单元素类
    var Start = require('./Start');
    var MenuBtns = require('./MenuBtns');
    var Title = require('./Title');
    var End = require('./End');

    // 引入主体玩物类
    var Stage = require('./Stage');
    var Hero = require('./Hero');
    var Stick = require('./Stick');

    // 引入界面元素类
    var Scoreboard = require('./Scoreboard');
    var Foodboard = require('./Foodboard');
    var Tip = require('./Tip');
    var Praise = require('./Praise');
    var Combo = require('./Combo');

    /**
     * 关卡
     *
     * @exports level
     * @namespace
     */
    var level = {};

    /**
     * 初始化
     *
     * @public
     * @param {string} status 状态
     */
    level.init = function (status) {
        this.status = status;
    };

    /**
     * 创建对象
     *
     * @public
     */
    level.create = function () {
        this._reset();

        switch (this.status) {
            case 'menu':
                this._initMenuStatus();
                break;
            case 'play':
                this._initPlayStatus();
                break;
        }

        this._transition();
    };

    /**
     * 更新帧
     *
     * @public
     */
    level.update = function () {
        // 背景始终滚动
        this.background.scroll();

        if (this.status === 'play') {
            if (this.shouldMgScroll) {
                // 各中景滚动速度不一, 增强距离层次感
                this.nearMidground.scroll(2);
                this.farMidground.scroll(1);
            }

            if (this.isHoldEnabled && this.isBeingHeld) {
                // 伸长棒子
                this.stick.lengthen();
            }

            // 处理待添加食物
            var food = this.stage.getFood();
            if (food && food.isStartingBeingEaten(this.hero)) {
                this.isFoodToBeAdded = true;
            }
        }
    };

    /**
     * 重置
     *
     * @private
     */
    level._reset = function () {
        /**
         * 按住操作是否启用
         *
         * @type {boolean}
         */
        this.isHoldEnabled = false;

        /**
         * 是否正被按住
         *
         * @type {boolean}
         */
        this.isBeingHeld = false;

        /**
         * 触击操作是否开启
         *
         * @type {boolean}
         */
        this.isTouchEnabled = false;

        /**
         * 是否有待添加的食物
         *
         * @type {boolean}
         */
        this.isFoodToBeAdded = false;

        /**
         * 中景是否应该滚动
         *
         * @type {boolean}
         */
        this.shouldMgScroll = false;

        /**
         * 背景及物件主题
         *
         * @type {string}
         */
        this.theme = this.game.rnd.between(1, 3);

        // 重置微信分享信息
        global.resetShareText();
        require('common/weixin').updateShare();
    };

    /**
     * 转场
     *
     * @private
     */
    level._transition = function () {
        // 用遮掩层过渡
        var Mask = require('common/ui/Mask');
        var mask = new Mask(this.game, {alpha: 1});
        mask.hide(150);
    };

    /**
     * 初始化场景
     *
     * @private
     */
    level._initView = function () {
        var game = this.game;

        /**
         * 背景
         *
         * @type {Background}
         */
        this.background = new Background(game, {index: this.theme});

        /**
         * 远中景
         *
         * @type {Midground}
         */
        this.farMidground = new Midground(
            game,
            {
                index: this.theme,
                imagePrefix: 'mg-far'
            }
        );

        /**
         * 近中景
         *
         * @type {Midground}
         */
        this.nearMidground = new Midground(
            game,
            {
                index: this.theme,
                imagePrefix: 'mg-near'
            }
        );

        /**
         * 雾气
         *
         * @type {Fog}
         */
        this.fog = new Fog(game);
    };

    /**
     * 初始化基础物件
     *
     * @private
     */
    level._initBaseObjs = function () {
        this._initView();

        var game = this.game;

        /**
         * 平台
         *
         * @type {Stage}
         */
        this.stage = new Stage(game, {index: this.theme});

        /**
         * 英雄
         *
         * @type {Hero}
         */
        this.hero = new Hero(game, {index: global.getSelected()});
    };

    /**
     * 初始化菜单状态
     *
     * @private
     */
    level._initMenuStatus = function () {
        this._initBaseObjs();

        var game = this.game;

        /**
         * 开始按钮
         *
         * @type {Start}
         */
        this.start = new Start(
            game,
            {
                callback: this._initPlayStatus,
                context: this
            }
        );

        /**
         * 菜单按钮组
         *
         * @type {MenuBtns}
         */
        this.menuBtns = new MenuBtns(game);

        /**
         * 标题
         *
         * @type {Title}
         */
        this.title = new Title(game);
    };

    /**
     * 初始化可玩状态
     *
     * @private
     */
    level._initPlayStatus = function () {
        var game = this.game;

        // 根据前继状态进行物件的销毁和初始化
        switch (this.status) {
            case 'play':
                this._initBaseObjs();

                // 物件设为可玩, 无动画过渡
                this.hero.setForPlay(false);
                this.stage.setForPlay(false);

                this.isHoldEnabled = true;

                break;

            case 'menu':
                // 销毁菜单元素
                [this.title, this.start, this.menuBtns].forEach(function (item) {
                    item.destroy();
                });

                // 物件设为可玩, 有动画过渡
                this.hero.setForPlay(true);
                var me = this;
                this.stage.setForPlay(true, function () {
                    me.status = 'play';
                    me.isHoldEnabled = true;
                });

                break;
        }

        /**
         * 记分牌
         *
         * @type {Scoreboard}
         */
        this.scoreboard = new Scoreboard(game);

        /**
         * 食物栏
         *
         * @type {Foodboard}
         */
        this.foodboard = new Foodboard(game);

        /**
         * 棒子
         *
         * @type {Stick}
         */
        this.stick = new Stick(game);

        /**
         * 前景
         *
         * @type {Foreground}
         */
        this.foreground = new Foreground(
            game,
            {
                objects: [this.stage, this.hero, this.stick]
            }
        );

        // 最高分不足2，则给玩法提示
        // 不设1，因为首次成功有偶然性，不一定是真会玩
        if (global.getHighest() < 2) {
            /**
             * 玩法提示
             *
             * @type {?Tip}
             */
            this.playTip = new Tip(game, {text: config.tips.play});
        }

        /**
         * 连击
         *
         * @type {Combo}
         */
        this.combo = new Combo(game);

        this._bindTouch();
    };

    /**
     * 绑定触击操作
     *
     * @private
     */
    level._bindTouch = function () {
        var game = this.game;

        game.input.onDown.add(onInputDown, this);
        game.input.onUp.add(onInputUp, this);
    };

    /**
     * 触摸按下函数
     *
     * @inner
     */
    function onInputDown() {
        var hero = this.hero;

        // 处理按住
        if (this.isHoldEnabled) {
            this.isBeingHeld = true;
            hero.up();
        }

        // 处理触击
        if (this.isTouchEnabled) {
            hero.flip();
        }
    }

    /**
     * 触摸松开函数
     *
     * @inner
     */
    function onInputUp() {
        if (!this.isHoldEnabled || !this.isBeingHeld) {
            return;
        }

        this.isBeingHeld = false;
        this.isHoldEnabled = false;

        this.hero.kick();
        this._layDownStick();
    }

    /**
     * 放下棒子
     *
     * @private
     */
    level._layDownStick = function () {
        var stick = this.stick;
        var me = this;

        stick.layDown(function () {
            me.isTouchEnabled = true;

            var stage = me.stage;
            if (stick.getFullLength() > stage.getInterval()) { // 长度足够
                var combo = me.combo;
                if (stick.isInSpot(stage)) { // 命中奖励点
                    // 奖励点加分
                    var points = stage.getSpotMultiple() * combo.get();
                    me.scoreboard.addScore(points);
                    combo.add();
                    // 赞美一下
                    new Praise(
                        me.game,
                        {
                            points: points,
                            pointsX: stage.getSpotX()
                        }
                    );
                }
                else {
                    combo.reset();
                }

                me._makeHeroWalkToNext();
            }
            else { // 长度不足
                me._makeHeroWalkToStickEnd();
            }
        });
    };

    /**
     * 使英雄走到下根柱子
     *
     * @private
     */
    level._makeHeroWalkToNext = function () {
        var me = this;
        var hero = this.hero;
        var stage = this.stage;

        hero.walk(
            stage.getCurrEdgeX() + stage.getInterval(),
            function () {
                me.isTouchEnabled = false;
                if (!hero.isUpsideDown()) { // 未倒置
                    if (me.stick.isInStage(stage)) { // 成功啦
                        // 隐去提示
                        [me.playTip, me.foodTip].forEach(function (tip) {
                            if (tip) {
                                tip.hide();
                                tip = null;
                            }
                        });

                        me._makeHeroWalkToNextEdge();
                    }
                    else { // 走过了
                        me._makeHeroWalkToStickEnd();
                    }
                }
                else { // 倒置触壁
                    me._fail();
                }
            }
        );
    };

    /**
     * 使英雄走到下根柱子边缘
     *
     * @private
     */
    level._makeHeroWalkToNextEdge = function () {
        var me = this;
        var stage = this.stage;
        var nextEdgeX = stage.getNextEdgeX();

        this.hero.walk(
            nextEdgeX,
            function () {
                // 常规加分
                me.scoreboard.addScore(1);

                if (me.isFoodToBeAdded) {
                    me.isFoodToBeAdded = false;
                    // 更新食物数量
                    global.setFoodCount(global.getFoodCount() + 1);
                    me.foodboard.update();
                }

                me.shouldMgScroll = true;
                var foreground = me.foreground;
                // 滚动中景
                foreground.move(stage.getCurrEdgeX() - nextEdgeX, function () {
                    me.shouldMgScroll = false;
                });

                // 添加下根柱子
                var options = stage.addNext(function () {
                    // 物件更新
                    me.stick.update();
                    foreground.update();
                    me.isHoldEnabled = true;
                });

                // 从未取得过食物 并且 下一局有食物, 则提示
                if (!global.getFoodCount() && options.hasFood) {
                    /**
                     * 食物提示
                     *
                     * @type {?Tip}
                     */
                    me.foodTip = new Tip(me.game, {text: config.tips.food});
                }
            }
        );
    };

    /**
     * 使英雄走到下根棒子顶端
     *
     * @private
     */
    level._makeHeroWalkToStickEnd = function () {
        var me = this;

        this.hero.walk(
            this.stage.getCurrEdgeX() + this.stick.getLength() + 12,
            function () {
                me.isTouchEnabled = false;
                me._fail();
            }
        );
    };

    /**
     * 处理失败
     *
     * @private
     */
    level._fail = function () {
        var me = this;

        // 判断新纪录
        var highest = global.getHighest();
        var score = this.scoreboard.getScore();
        var hasNewRecord = score > highest;
        hasNewRecord && global.setHighest(score);

        // 棒子落下
        var stick = this.stick;
        stick.fall();

        // 英雄落下
        var hero = this.hero;
        hero.fall(function () {
            // 屏幕抖动
            me.game.plugins.screenShake.shake(10);
            // 为了体验, 停滞一小段时间再运行
            setTimeout(
                function () {
                    if (hero.power.doubleLife) { // 双命重生
                        hero.sustainLife();
                        stick.setForPlay();
                        hero.twinkle();
                        me.isHoldEnabled = true;
                    }
                    else {
                        // 显示结束画面
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

    return level;

});
