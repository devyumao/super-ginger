/**
 * @file 英雄家族 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/Popup');

    var FamilyPopup = function (game) {
        Popup.call(
            this, game,
            {
                hasHeader: true,
                headerType: 'food',
                title: '超能家族',
                height: 550,
                paddingBottom: 72
            }
        );
    };
    util.inherits(FamilyPopup, Popup);

    FamilyPopup.prototype._setPanelAttrs = function () {
        var game = this.game;

        this.panel = {
            edgeHeight: game.cache.getImage('panel-edge').height,
            mainHeight: 110,
            width: game.cache.getImage('panel-edge').width,
            marginTop: 12,
            dividingX: 110,
            dividingWidth: 6,
        };

        var panel = this.panel;
        this.panel.height = panel.mainHeight + panel.edgeHeight * 2;

        this.btnUnlockList = [];
    };

    FamilyPopup.prototype._setPagerAttrs = function () {
        this.page = global.getSelected() + 1;
        this.totalPage = global.herosConfig.length - 2;
        if (this.totalPage < 1) {
            this.totalPage = 1;
        }

        this.btnUp = null;
        this.btnDown = null;

        this.upActive = true;
        this.downActive = true;
    };

    FamilyPopup.prototype._initContent = function () {
        this._setPanelAttrs();
        this._setPagerAttrs();

        this._initPanels();
        this._initPager();
    };

    FamilyPopup.prototype._initPanels = function () {
        var game = this.game;
        var container = this.container;
        var panel = this.panel;
        var me = this;

        global.herosConfig.forEach(function (config, index) {
            // 绘制面板
            var topEdge = game.add.image(
                0, (panel.marginTop + panel.height) * index + panel.marginTop,
                'panel-edge'
            );
            container.addChild(topEdge);

            var main = game.add.image(
                0, topEdge.y + panel.edgeHeight,
                'pixel-dark-beige'
            );
            main.scale.set(panel.width, panel.mainHeight);
            container.addChild(main);

            var bottomEdge = game.add.image(
                0, main.y + panel.mainHeight + panel.edgeHeight,
                'panel-edge'
            );
            bottomEdge.scale.y = -1;
            container.addChild(bottomEdge);

            var dividing = game.add.image(
                panel.dividingX, topEdge.y,
                'pixel-beige'
            );
            dividing.scale.set(panel.dividingWidth, panel.height);
            container.addChild(dividing);

            // 设置面板容器
            var panelCtn = game.add.image(0, topEdge.y);
            container.addChild(panelCtn);

            // 绘制英雄
            var hero = game.add.sprite(
                47 + config.paddingRight, panel.height / 2 - 10,
                config.name + '-down'
            );
            hero.scale.set(config.scale * 1.1);
            hero.anchor.set(0.5);
            hero.animations.add('down');
            hero.animations.play('down', config.actions.down.fps, true);
            panelCtn.addChild(hero);

            // 绘制名字
            var nameText = game.add.text(
                panel.dividingX / 2, panel.height - 40,
                config.chName,
                {
                    font: 'bold 20px ' + global.fontFamily,
                    fill: color.get('coffee'),
                    strokeThickness: 5,
                    stroke: color.get('white')
                }
            );
            nameText.anchor.set(0.5, 0);
            nameText.alpha = 0.7;
            panelCtn.addChild(nameText);

            var descTitleText = game.add.text(
                panel.dividingX + panel.dividingWidth + 10, 10,
                '简介',
                {
                    font: 'bold 19px ' + global.fontFamily,
                    fill: color.get('coffee'),
                    strokeThickness: 4,
                    stroke: color.get('beige')
                }
            );
            panelCtn.addChild(descTitleText);

            var powerTilteText = game.add.text(
                panel.dividingX + panel.dividingWidth + 10, descTitleText.y + descTitleText.height + 10,
                '超能',
                {
                    font: 'bold 19px ' + global.fontFamily,
                    fill: color.get('coffee'),
                    strokeThickness: 4,
                    stroke: color.get('beige')
                }
            );
            panelCtn.addChild(powerTilteText);


            // 绘制按钮
            if (!config.unlocked) {
                var btnUnlock = game.add.button(
                    panel.dividingX + panel.dividingWidth, topEdge.y,
                    'btn-unlock',
                    function () {
                        console.log('unlock');
                    },
                    me
                );
                btnUnlock.alpha = 0.6;
                if (index < me.page - 1 || index > me.page + 1) {
                    // 防止框外触发
                    btnUnlock.visible = false;
                }
                container.addChild(btnUnlock);
                me.btnUnlockList.push(btnUnlock);

                switch (config.unlockType) {
                    case 'food':
                        var costText = game.add.text(
                            btnUnlock.width / 2 - 8, btnUnlock.height / 2,
                            config.cost,
                            {
                                font: 'bold 36px ' + global.fontFamily,
                                fill: color.get('white')
                            }
                        );
                        costText.anchor.set(1, 0.5);
                        btnUnlock.addChild(costText);

                        var food = game.add.image(
                            btnUnlock.width / 2 + 8, btnUnlock.height / 2 - 5,
                            'food'
                        );
                        food.anchor.set(0, 0.5);
                        food.width = 36;
                        food.height = food.width;
                        btnUnlock.addChild(food);
                        break;
                    case 'share':
                        var shareText = game.add.text(
                            btnUnlock.width / 2, btnUnlock.height / 2,
                            '分享即可获得',
                            {
                                font: 'bold 32px ' + global.fontFamily,
                                fill: color.get('white')
                            }
                        );
                        shareText.anchor.set(0.5);
                        btnUnlock.addChild(shareText);
                        break;
                }
            }
            else {
                me.btnUnlockList.push(null);
            }
        });
    };

    FamilyPopup.prototype._initPager = function () {
        var game = this.game;
        var container = this.container;

        var margin = 10;
        var y = game.height + this.height - this.paddingBottom + 12;

        var btnDown = game.add.button(
            game.width / 2 + margin, y,
            'btn-down',
            function () {
                if (this.downActive) {
                    this._turnPage('down');
                }
            },
            this
        );
        this.elements.push(btnDown);
        this.btnDown = btnDown;

        var btnUp = game.add.button(
            game.width / 2 - margin - btnDown.width, y,
            'btn-up',
            function () {
                if (this.upActive) {
                    this._turnPage('up');
                }
            },
            this
        );
        this.elements.push(btnUp);
        this.btnUp = btnUp;

        this._updateBtns();
    };

    FamilyPopup.prototype._turnPage = function (type) {
        var panel = this.panel;
        var factor = type === 'down' ? 1 : -1;
        var offset = -factor * (panel.height + panel.marginTop);

        var turn = this.game.add.tween(this.container)
            .to({y: offset + ''}, 200, Phaser.Easing.Sinusoidal.InOut);
        turn.onStart.add(
            function () {
                this.upActive = false;
                this.downActive = false;

                // 要来的先搞，保证来后状态示人
                var comingBtnUnlock = this.btnUnlockList[this.page + 2 * factor];
                if (comingBtnUnlock) {
                    comingBtnUnlock.visible = true;
                }
            },
            this
        );
        turn.onComplete.add(
            function () {
                // 当前的后搞，保证走前状态示人
                var currBtnUnlock = this.btnUnlockList[this.page - factor];
                if (currBtnUnlock) {
                    currBtnUnlock.visible = false;
                }

                this.page += factor;
                this._updateBtns();
            },
            this
        );
        turn.start();
    };

    FamilyPopup.prototype._updateBtns = function () {
        switch (this.page) {
            case 1:
                this._disablePagerBtn('up');
                this._activatePagerBtn('down');
                break;
            case this.totalPage:
                this._activatePagerBtn('up');
                this._disablePagerBtn('down');
                break;
            default:
                this._activatePagerBtn('up');
                this._activatePagerBtn('down');
        }
    };

    FamilyPopup.prototype._disablePagerBtn = function (type) {
        this['btn' + type.substr(0, 1).toUpperCase() + type.substr(1)].alpha = 0.5;
        this[type + 'Active'] = false;
    };

    FamilyPopup.prototype._activatePagerBtn = function (type) {
        this['btn' + type.substr(0, 1).toUpperCase() + type.substr(1)].alpha = 1;
        this[type + 'Active'] = true;
    };

    return FamilyPopup;

});
