/**
 * @file 英雄家族 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    // TODO: upActive 融入 btnUp

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/ui/Popup');

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

        this._init();
    };
    util.inherits(FamilyPopup, Popup);

    FamilyPopup.prototype._initContent = function () {
        this._setPanelAttrs();
        this._setPagerAttrs();

        this._initPanels();
        this._initPager();
    };

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

        this.btnSelectList = [];
        this.btnUnlockList = [];
    };

    FamilyPopup.prototype._setPagerAttrs = function () {
        var heroCount = 0;
        global.herosConfig.forEach(function (config) {
            if (!config.hidden) {
                ++heroCount;
            }
        });
        this.totalPage = heroCount - 2;
        if (this.totalPage < 1) {
            this.totalPage = 1;
        }

        this.page = global.getSelected() + 1;
        if (this.page > this.totalPage) {
            this.page = this.totalPage;
        }
        
        this.btnUp = null;
        this.btnDown = null;

        this.upActive = true;
        this.downActive = true;
    };

    // TODO: 拆分
    FamilyPopup.prototype._initPanels = function () {
        var container = this.container;
        var me = this;
        var panel = this.panel;

        // 被选英雄置顶
        container.y -= (panel.height + panel.marginTop) * (this.page - 1);

        global.herosConfig.forEach(function (config, index) {
            if (config.hidden) {
                return;
            }
            var options = me._initPanel(config, index);
            me._initHero(config, index, options);
            me._initInfo(config, index, options);
            me._initBtnSelect(config, index, options);
            me._initBtnUnlock(config, index, options);
        });
    };

    FamilyPopup.prototype._initPanel = function (config, index) {
        var game = this.game;
        var container = this.container;
        var panel = this.panel;

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

        return {
            y: topEdge.y,
            panelCtn: panelCtn
        };
    };

    FamilyPopup.prototype._initHero = function (config, index, options) {
        var game = this.game;
        var panel = this.panel;

        var hero = game.add.sprite(
            47 + config.paddingRight, panel.mainHeight / 2 - 2,
            config.name + '-down'
        );
        hero.scale.set(config.scale * 1.1);
        hero.anchor.set(0.5);
        hero.animations.add('down');
        hero.animations.play('down', config.actions.down.fps, true);
        options.panelCtn.addChild(hero);
    };

    FamilyPopup.prototype._isInCurrentPage = function (index) {
        return index >= this.page - 1 && index <= this.page + 1;
    };

    FamilyPopup.prototype._initInfo = function (config, index, options) {
        var game = this.game;
        var panel = this.panel;
        var panelCtn = options.panelCtn;

        var nameText = game.add.text(
            panel.dividingX / 2, panel.mainHeight - 18,
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

        var titleFontStyle = {
            font: 'bold 19px ' + global.fontFamily,
            fill: color.get('coffee'),
            strokeThickness: 4,
            stroke: color.get('beige')
        };

        var descTitleText = game.add.text(
            panel.dividingX + panel.dividingWidth + 10, 10,
            '简介',
            titleFontStyle
        );
        panelCtn.addChild(descTitleText);

        var contentFontStyle = {
            font: '17px ' + global.fontFamily,
            fill: color.get('darker-grey')
        };

        // TODO: 自动加\n
        var descText = game.add.text(
            descTitleText.x + descTitleText.width + 6, descTitleText.y + 4,
            config.desc,
            contentFontStyle
        );
        panelCtn.addChild(descText);

        var powerTilteText = game.add.text(
            panel.dividingX + panel.dividingWidth + 10, descText.y + descText.height + 5,
            '超能',
            titleFontStyle
        );
        panelCtn.addChild(powerTilteText);

        var powerText = game.add.text(
            powerTilteText.x + powerTilteText.width + 6, powerTilteText.y + 4,
            global.getUnlock(index) ? config.powerText : '? ? ?',
            contentFontStyle
        );
        panelCtn.addChild(powerText);
    };

    FamilyPopup.prototype._select = function (index) {
        var hero = this.game.state.states.level.hero;
        hero.change(index);
    };

    FamilyPopup.prototype._initBtnSelect = function (config, index, options) {
        if (global.getUnlock(index)) {
            var game = this.game;
            var panel = this.panel;

            var btnSelect = game.add.button(
                0, options.y,
                'transparent',
                function () {
                    this._select(index);
                    this._hide();
                },
                this
            );
            btnSelect.scale.set(panel.width, panel.height);
            util.addHover(btnSelect, options.panelCtn);

            if (!this._isInCurrentPage(index) || !global.getUnlock(index)) {
                btnSelect.visible = false;
            }
            this.container.addChild(btnSelect);
            this.btnSelectList.push(btnSelect);
        }
        else {
            this.btnSelectList.push(null);
        }
    };

    FamilyPopup.prototype._initBtnUnlock = function (config, index, options) {
        if (!global.getUnlock(index)) {
            var game = this.game;
            var panel = this.panel;
            var me = this;

            var btnUnlock = game.add.button(
                panel.dividingX + panel.dividingWidth, options.y,
                'btn-unlock',
                function () {
                    if (config.unlockType !== 'food') {
                        return;
                    }

                    setTimeout( // 延时仅仅是为了玩家体验
                        function () {
                            me._hide(false);
                            if (global.getFoodCount() >= config.cost) {
                                var Confirm = require('common/ui/Confirm');
                                new Confirm(
                                    game,
                                    {
                                        text: '确定用 ' + config.cost +' 果果解锁\n【' + config.chName + '】？',
                                        onConfirm: function () {
                                            global.setFoodCount(
                                                global.getFoodCount() - config.cost,
                                                function () {
                                                    global.unlock(index);
                                                    me._select(index);
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                            else {
                                var StorePopup = require('./StorePopup');
                                new StorePopup(game);
                            }
                        },
                        150
                    );
                },
                this
            );
            btnUnlock.alpha = 0.7;

            if (!this._isInCurrentPage(index)) {
                // 防止框外触发
                btnUnlock.visible = false;
            }
            this.container.addChild(btnUnlock);
            this.btnUnlockList.push(btnUnlock);

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
                    util.addHover(btnUnlock);
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
            this.btnUnlockList.push(null);
        }
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

        // 这边的状态关联较特殊，所以不用 util.addHover
        var me = this;
        ['Down', 'Up'].forEach(function (type) {
            var events = me['btn' + type].events;
            var activeKey = type.toLowerCase() + 'Active';

            events.onInputDown.add(
                function (target) {
                    if (me[activeKey]) {
                        target.alpha = 0.85;
                    }
                },
                me
            );
            events.onInputUp.add(
                function (target) {
                    if (me[activeKey]) {
                        target.alpha = 1;
                    }
                },
                me
            );
        });

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

                var index = this.page + 2 * factor;
                // 要来的先搞，保证来后状态示人
                var comingBtnUnlock = this.btnUnlockList[index];
                if (comingBtnUnlock) {
                    comingBtnUnlock.visible = true;
                }
                var comingBtnSelect = this.btnSelectList[index];
                if (comingBtnSelect) {
                    comingBtnSelect.visible = true;
                }
            },
            this
        );
        turn.onComplete.add(
            function () {
                var index = this.page - factor;
                // 当前的后搞，保证走前状态示人
                var currBtnUnlock = this.btnUnlockList[index];
                if (currBtnUnlock) {
                    currBtnUnlock.visible = false;
                }
                var currBtnSelect = this.btnSelectList[index];
                if (currBtnSelect) {
                    currBtnSelect.visible = false;
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
