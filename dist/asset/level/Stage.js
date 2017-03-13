/**
 * @file 平台
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var util = require('common/util');
    var config = require('level/config');
    var Food = require('./Food');

    /**
     * 平台类
     *
     * @exports Stage
     * @class
     * @param {Phaser.Game} game 游戏
     * @param {Object} options 参数项
     * @param {index} options.index 主题序号
     */
    var Stage = function (game, options) {
        /**
         * 游戏
         *
         * @type {Phaser.Game}
         */
        this.game = game;

        /**
         * 主题序号
         *
         * @type {number}
         */
        this.index = options.index;

        /**
         * 贴图名
         *
         * @type {string}
         */
        this.imageName = 'stage-' + this.index;

        /**
         * 上根柱子
         *
         * @type {?Phaser.tileSprite}
         */
        this.prev = null;

        /**
         * 当前柱子
         *
         * @type {?Phaser.tileSprite}
         */
        this.curr = null;

        /**
         * 下根柱子
         *
         * @type {?Phaser.tileSprite}
         */
        this.next = null;

        /**
         * 奖励点
         *
         * @type {?Phaser.Image}
         */
        this.spot = null;

        /**
         * 废弃的食物
         *
         * @type {?Food}
         */
        this.oldFood = null;

        /**
         * 食物
         *
         * @type {?Food}
         */
        this.food = null;

        /**
         * 平移速度曲线
         *
         * @type {Function}
         */
        this.moveEasing = Phaser.Easing.Linear.None;

        /**
         * 高度
         *
         * @type {number}
         */
        this.height = game.cache.getImage(this.imageName).height;

        /**
         * 当前柱子右沿水平位置
         *
         * @type {number}
         */
        this.currEdgeX = config.currEdgeX;

        /**
         * 最大柱宽
         *
         * @type {number}
         */
        this.maxWidth = this.currEdgeX;

        this.updateMinWidth();

        this.updateFoodProba();

        this.updateSpotMultiple();
        this.updateSpotWidth();

        this._init();
    };

    /**
     * 初始化
     *
     * @private
     */
    Stage.prototype._init = function () {
        var game = this.game;

        // 一根居中的当前柱
        this.curr = game.add.tileSprite(
            (game.width - this.maxWidth) / 2,
            game.height - config.initialHorizon - (this.height - config.horizon),
            this.maxWidth,
            this.height,
            this.imageName
        );
    };

    /**
     * 设置为可玩状态
     *
     * @public
     * @param {boolean} useTween 是否使用动态过渡
     * @param {Function=} cb 回调
     */
    Stage.prototype.setForPlay = function (useTween, cb) {
        var game = this.game;

        // 初始化 next
        // 初始 next 限制宽度与距离，使得首次难度不要太奇葩
        var nextWidth = this.maxWidth;
        var next = game.add.tileSprite(
            game.width, game.height - this.height,
            nextWidth, this.height,
            this.imageName
        );
        this._randomTilePosition(next);
        this.next = next;
        this.spot = this._createSpot(next);

        // 位置信息
        var currX = 0;
        var currY = game.height - this.height;
        var nextX = this.currEdgeX + game.rnd.between(40, 180);

        var easing = this.moveEasing;
        if (useTween) {
            // curr 移动
            var moveCurr = game.add.tween(this.curr)
                .to({x: currX, y: currY}, 200, easing);

            // next 移动
            var moveNext = game.add.tween(next)
                .to({x: nextX}, 200, easing);
            cb && moveNext.onComplete.add(cb);

            moveCurr.chain(moveNext);
            moveCurr.start();
        }
        else {
            var curr = this.curr;
            curr.x = currX;
            curr.y = currY;
            next.x = nextX;
        }
    };

    /**
     * 随机柱子纹理位置
     *
     * @private
     * @param {Phaser.tileSprite} pillar 柱子
     */
    Stage.prototype._randomTilePosition = function (pillar) {
        pillar.tilePosition.x = -this.game.rnd.between(0, 300 - this.maxWidth);
    };

    /**
     * 创建奖励点
     *
     * @private
     * @param {Phaser.tileSprite} pillar 柱子
     * @return {Phaser.Image} 奖励点
     */
    Stage.prototype._createSpot = function (pillar) {
        var spot = this.game.add.image(pillar.width / 2, this.height - config.horizon, 'spot');
        spot.width = this.spotWidth;
        spot.anchor.set(0.5, 0);
        pillar.addChild(spot);

        return spot;
    };

    /**
     * 创建食物
     *
     * @private
     * @return {Phaser.Image} 奖励点
     */
    Stage.prototype._createFood = function () {
        var game = this.game;

        var food = new Food(
            game,
            {
                x: game.width,
                y: game.height - config.horizon + 10
            }
        );

        return food;
    };

    /**
     * 添加下根柱子
     *
     * @public
     * @param {Function} cb 回调
     * @return {Object} 返回项
     */
    Stage.prototype.addNext = function (cb) {
        var game = this.game;

        // next 大小、位置信息
        var nextWidth = game.rnd.between(this.minWidth, this.maxWidth);
        var nextMargin = [20, 10];
        // next 水平位置在 curr 和除去自身宽度的边界之间, 考虑边缘留空
        var nextX = game.rnd.between(this.currEdgeX + nextMargin[0], game.width - nextWidth - nextMargin[1]);

        // food 大小、位置信息
        var foodWidth = config.foodWidth;
        var foodMargin = 10;
        var food = null;
        var foodX = nextX;
        var hasFood = util.proba(this.foodProba) // 先验概率
            && nextX - this.currEdgeX >= foodWidth + foodMargin * 2; // 间距是否足够放

        if (hasFood) {
            // food 水平位置在两根柱子之间
            foodX = game.rnd.between(this.currEdgeX + foodMargin, nextX - foodMargin - foodWidth);
            food = this._createFood();

            // food 平移动画
            var moveFood = game.add.tween(food.getEl())
                .to({x: foodX}, 300, this.moveEasing);
            moveFood.start();
        }

        // 添加 next
        var next = game.add.tileSprite(
            game.width + nextX - foodX, game.height - this.height,
            nextWidth, this.height,
            this.imageName
        );
        this._randomTilePosition(next);

        var spot = this._createSpot(next);

        // next 平移动画
        var move = game.add.tween(next)
            .to({x: nextX}, 300, this.moveEasing);
        move.onComplete.add(function () {
            // 更替新旧对象
            this.prev && this.prev.destroy();
            this.prev = this.curr;
            this.curr = this.next;
            this.next = next;
            this.spot = spot;

            this.oldFood && this.oldFood.destroy();
            this.oldFood = this.food;
            this.food = food || null;

            cb && cb();
        }, this);
        move.start();

        return {
            hasFood: hasFood
        };
    };

    /**
     * 取得当前柱子右沿的水平位置
     *
     * @public
     * @return {number} 当前柱子右沿的水平位置
     */
    Stage.prototype.getCurrEdgeX = function () {
        return this.currEdgeX;
    };

    /**
     * 取得当前柱子右沿的水平位置
     *
     * @public
     * @return {number} 当前柱子右沿的水平位置
     */
    Stage.prototype.getNextEdgeX = function () {
        var next = this.next;
        return next.x + next.width;
    };

    /**
     * 取得贴图元素
     *
     * @public
     * @return {Array} 贴图组
     */
    Stage.prototype.getEl = function () {
        var el = [this.prev, this.curr, this.next];
        [this.oldFood, this.food].forEach(function (item) {
            item && el.push(item.getEl());
        });
        return el;
    };

    /**
     * 取得两根柱子间距
     *
     * @public
     * @return {number} 两根柱子间距
     */
    Stage.prototype.getInterval = function () {
        var curr = this.curr;
        return this.next.x - curr.x - curr.width;
    };

    /**
     * 取得奖励点水平位置
     *
     * @public
     * @return {number} 奖励点水平位置
     */
    Stage.prototype.getSpotX = function () {
        var next = this.next;
        return next.x + this.spot.x;
    };

    /**
     * 取得奖励点位置区间
     *
     * @public
     * @return {Object} 奖励点位置区间
     */
    Stage.prototype.getSpotRange = function () {
        var lower = this.getSpotX() - this.currEdgeX - this.spotWidth / 2;
        var upper = lower + this.spotWidth;

        return {
            lower: lower,
            upper: upper
        };
    };

    /**
     * 取得食物
     *
     * @public
     * @return {Food} 食物
     */
    Stage.prototype.getFood = function () {
        return this.food;
    };

    /**
     * 取得奖励点乘数
     *
     * @public
     * @return {Food} 奖励点乘数
     */
    Stage.prototype.getSpotMultiple = function () {
        return this.spotMultiple;
    };

    /**
     * 更新食物出现几率
     *
     * @public
     */
    Stage.prototype.updateFoodProba = function () {
        var foodProba = global.getHeroConfig().power.foodProba;
        /**
         * 食物出现几率
         *
         * @type {number}
         */
        this.foodProba = foodProba ? foodProba : 0.5;
    };

    /**
     * 更新最小柱宽
     *
     * @public
     */
    Stage.prototype.updateMinWidth = function () {
        var minWidth = global.getHeroConfig().power.stageMinWidth;
        /**
         * 最小柱宽
         *
         * @type {number}
         */
        this.minWidth = minWidth ? minWidth : 24;
    };

    /**
     * 更新奖励点乘数
     *
     * @public
     */
    Stage.prototype.updateSpotMultiple = function () {
        var spotMultiple = global.getHeroConfig().power.spotMultiple;
        /**
         * 奖励点乘数
         *
         * @type {number}
         */
        this.spotMultiple = spotMultiple ? spotMultiple : 1;
    };

    /**
     * 更新奖励点宽度
     *
     * @public
     */
    Stage.prototype.updateSpotWidth = function () {
        var spotWidth = global.getHeroConfig().power.spotWidth;
        /**
         * 奖励点宽度
         *
         * @type {number}
         */
        this.spotWidth = spotWidth ? spotWidth : 14;
    };

    return Stage;

});
