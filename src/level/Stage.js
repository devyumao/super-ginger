/**
 * @file 平台
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var util = require('common/util');

    var Stage = function (game) {
        this.game = game;
        this.prev = null;
        this.curr = null;
        this.next = null;
        this.spot = null;

        this.height = 235; // TODO: set to global
        this.currEdgeX = 110;
        this.minWidth = 24;
        this.maxWidth = 110;
        this.spotWidth = 10; // TODO: 英雄技能影响

        this._init();
    };

    Stage.prototype._init = function () {
        var game = this.game;

        var curr = game.add.image(0, game.height - this.height, 'stage');
        curr.scale.set(this.currEdgeX, this.height);
        this.curr = curr;

        this._createSpot(curr);

        // 初始 next 限制宽度与距离，使得首次难度不要太奇葩
        var nextWidth = this.maxWidth;
        var next = this.game.add.image(
            this.currEdgeX + util.random(40, 180),
            game.height - this.height,
            'stage'
        );
        next.scale.set(nextWidth, this.height);
        this.next = next;

        this.spot = this._createSpot(next);
    };

    Stage.prototype._createSpot = function (pillar) {
        var spot = this.game.add.image(0.5, 0, 'spot');
        spot.scale.set(this.spotWidth / pillar.width, 8 / pillar.height); // XXX: 先缩放柱子
        spot.anchor.set(0.5, 0);
        pillar.addChild(spot);

        return spot;
    };

    // Stage.prototype._updateGroup = function () {
    //     var group = this.group;
    //     group.add(this.curr, 0);
    //     group.add(this.next, 1);
    // };

    Stage.prototype.addNext = function (cb) {
        var game = this.game;

        var nextWidth = util.random(this.minWidth, this.maxWidth);
        var next = this.game.add.image(
            game.width,
            game.height - this.height,
            'stage'
        );
        next.scale.set(nextWidth, this.height);

        var spot = this._createSpot(next);

        var newX = util.random(this.currEdgeX + 20, (game.width - nextWidth - 20));
        var move = game.add.tween(next)
            .to({x: newX}, 300, Phaser.Easing.Linear.None);

        move.onComplete.add(function () {
            this.prev && this.prev.destroy();
            this.prev = this.curr;
            this.curr = this.next;
            this.next = next;
            this.spot = spot;

            cb && cb();
        }, this);

        move.start();
    };

    Stage.prototype.getCurrEdgeX = function () {
        return this.currEdgeX;
    };

    Stage.prototype.getNextEdgeX = function () {
        var next = this.next;
        return next.x + next.width;
    };

    Stage.prototype.getEl = function () {
        return [this.prev, this.curr, this.next];
    };

    Stage.prototype.getInterval = function () {
        var curr = this.curr;
        return this.next.x - curr.x - curr.width;
    };

    Stage.prototype.getSpotX = function () {
        var next = this.next;
        return next.x + this.spot.x * next.width;
    };

    Stage.prototype.getSpotRange = function () {
        // pillar.x + spot.x * pillar.width

        var lower = this.getSpotX() - this.currEdgeX - this.spotWidth / 2;
        var upper = lower + this.spotWidth;

        return {
            lower: lower,
            upper: upper
        };
    };

    return Stage;

});
