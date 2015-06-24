/**
 * @file 平台
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var util = require('common/util');
    var config = require('level/config');
    var Food = require('./Food');

    var Stage = function (game, options) {
        this.game = game;

        this.index = options.index;
        this.imageName = 'stage-' + this.index;

        this.prev = null;
        this.curr = null;
        this.next = null;

        this.spot = null;

        this.oldFood = null;
        this.food = null;

        this.height = game.cache.getImage(this.imageName).height;
        this.currEdgeX = 110;

        this.updateMinWidth();

        this.maxWidth = 110;

        this.updateFoodProba();

        this.updateSpotMultiple();
        this.updateSpotWidth();

        this._init();
    };

    Stage.prototype._init = function () {
        var game = this.game;

        this.curr = game.add.tileSprite(
            (game.width - this.maxWidth) / 2,
            game.height - config.initialHorizon - (this.height - config.horizon),
            this.maxWidth,
            // this.minWidth,
            this.height,
            this.imageName
        );
    };

    Stage.prototype.setForPlay = function (useAnim, cb) {
        var game = this.game;

        // 初始化 next
        // 初始 next 限制宽度与距离，使得首次难度不要太奇葩
        var nextWidth = this.maxWidth;
        var next = game.add.tileSprite(
            game.width, game.height - this.height,
            nextWidth, this.height,
            this.imageName
        );
        next.tilePosition.x = -game.rnd.between(0, 300 - this.maxWidth);
        this.next = next;
        this.spot = this._createSpot(next);

        var currX = 0;
        // currX = this.maxWidth - this.minWidth; // for test
        var currY = game.height - this.height;
        var nextX = this.currEdgeX + game.rnd.between(40, 180);

        if (useAnim) {
            // curr 移动
            var moveCurr = game.add.tween(this.curr)
                .to({x: currX, y: currY}, 200, Phaser.Easing.Linear.None);

            // next 移动
            var moveNext = game.add.tween(next)
                .to({x: nextX}, 200, Phaser.Easing.Linear.None);
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

    Stage.prototype._createSpot = function (pillar) {
        var spot = this.game.add.image(pillar.width / 2, this.height - config.horizon, 'spot');
        spot.width = this.spotWidth;
        spot.anchor.set(0.5, 0);
        pillar.addChild(spot);

        return spot;
    };

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

    Stage.prototype.addNext = function (cb, foodProba) {
        var game = this.game;

        var nextWidth = game.rnd.between(this.minWidth, this.maxWidth);
        // nextWidth = 24;
        var nextMargin = [20, 10];
        var nextX = game.rnd.between(this.currEdgeX + nextMargin[0], game.width - nextWidth - nextMargin[1]);

        // 来一个 food
        var foodWidth = config.foodWidth;
        var foodMargin = 10;
        var food = null;
        var foodX = nextX;
        var hasFood = util.proba(this.foodProba) // 先验概率
            && nextX - this.currEdgeX >= foodWidth + foodMargin * 2; // 间距是否足够放
        if (hasFood) {
            foodX = game.rnd.between(this.currEdgeX + foodMargin, nextX - foodMargin - foodWidth);
            // foodX = this.currEdgeX + foodMargin;
            food = this._createFood();
            var moveFood = game.add.tween(food.getEl())
                .to({x: foodX}, 300, Phaser.Easing.Linear.None);
            moveFood.start();
        }

        // 来下一根柱子
        var next = game.add.tileSprite(
            game.width + nextX - foodX, game.height - this.height,
            nextWidth, this.height,
            this.imageName
        );
        next.tilePosition.x = -game.rnd.between(0, 300 - this.maxWidth); // TODO: 抽离

        var spot = this._createSpot(next);

        var move = game.add.tween(next)
            .to({x: nextX}, 300, Phaser.Easing.Linear.None);
        move.onComplete.add(function () {
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

    Stage.prototype.getCurrEdgeX = function () {
        return this.currEdgeX;
    };

    Stage.prototype.getNextEdgeX = function () {
        var next = this.next;
        return next.x + next.width;
    };

    Stage.prototype.getEl = function () {
        var el = [this.prev, this.curr, this.next];
        [this.oldFood, this.food].forEach(function (item) {
            item && el.push(item.getEl());
        });
        return el;
    };

    Stage.prototype.getInterval = function () {
        var curr = this.curr;
        return this.next.x - curr.x - curr.width;
    };

    Stage.prototype.getSpotX = function () {
        var next = this.next;
        return next.x + this.spot.x;
    };

    Stage.prototype.getSpotRange = function () {
        var lower = this.getSpotX() - this.currEdgeX - this.spotWidth / 2;
        var upper = lower + this.spotWidth;

        return {
            lower: lower,
            upper: upper
        };
    };

    Stage.prototype.getFood = function () {
        return this.food;
    };

    Stage.prototype.getSpotMultiple = function () {
        return this.spotMultiple;
    };

    Stage.prototype.updateFoodProba = function () {
        var foodProba = global.getHeroConfig().power.foodProba;
        this.foodProba = foodProba ? foodProba : 0.5;
    };

    Stage.prototype.updateMinWidth = function () {
        var minWidth = global.getHeroConfig().power.stageMinWidth;
        this.minWidth = minWidth ? minWidth : 24;
    };

    Stage.prototype.updateSpotMultiple = function () {
        var spotMultiple = global.getHeroConfig().power.spotMultiple;
        this.spotMultiple = spotMultiple ? spotMultiple : 1;
    };

    Stage.prototype.updateSpotWidth = function () {
        var spotWidth = global.getHeroConfig().power.spotWidth;
        this.spotWidth = spotWidth ? spotWidth : 10;
    };

    return Stage;

});
