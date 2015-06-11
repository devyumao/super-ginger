/**
 * @file 全局
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    // TODO: big init

    var ajax = require('common/ajax');
    var url = require('common/url');
    var serverData = require('common/serverData');

    var storagePrefix = 'ginger-';
    var storageKey = {
        foodCount: storagePrefix + 'food-count',
        highest: storagePrefix + 'highest',
        selected: storagePrefix + 'selected',
        unlocks: storagePrefix+ 'unlocks'
    };

    var global = {};

    function init () {
        handleHerosConfig();
        handleFont();
        handleBasePath();
        handleFoodCount();
        handleHighest();
        handleSelected();
        handleUnlocks();
    }

    function handleFont() {
        global.fontFamily = '"Helvetica Neue", Helvetica, STHeiTi, sans-serif';
    }

    function handleBasePath() {
        var basePath = '';

        global.setBasePath = function (path) {
            basePath = path;
        };

        global.getBasePath = function () {
            return basePath;
        };
    }

    function handleFoodCount () {
        var foodCount;

        global.initFoodCount = function (cb) {
            var key = storageKey.foodCount;
            foodCount = localStorage.getItem(key);
            if (!foodCount) {
                // TODO: server
                foodCount = 0;
            }
            else {
                foodCount = +foodCount;
            }
            cb && cb();
        };

        global.getFoodCount = function () {
            return foodCount;
        };

        global.setFoodCount = function (count) {
            if (count === foodCount) {
                return;
            }

            ajax.get({
                url: count > foodCount ? url.ADD_FOOD : url.USE_FOOD,
                data: {
                    count: Math.abs(count - foodCount)
                }
            });

            foodCount = count;
            localStorage.setItem(storageKey.foodCount, count);
        };
    }

    function handleHighest () {
        var highest;

        global.initHighest = function (cb) {
            var key = storageKey.highest;
            highest = localStorage.getItem(key);
            if (!highest) {
                // TODO: server
                highest = 0;
            }
            else {
                highest = +highest;
            }
            cb && cb();
        };

        global.getHighest = function () {
            return highest;
        };

        global.setHighest = function (score) {
            highest = score;
            var key = storageKey.highest;
            // TODO: server
            localStorage.setItem(key, score);
        };
    }

    // 被选英雄
    function handleSelected () {
        var selected = localStorage.getItem(storageKey.selected);
        if (selected === null) {
            selected = 0;
        }
        selected = selected === null ? 0 : +selected;

        global.getSelected = function () {
            return selected;
        };

        global.setSelected = function (index) {
            selected = index;
            localStorage.setItem(storageKey.selected, index);
        };
    }

    // 解锁列
    function handleUnlocks () {
        var unlocks = localStorage.getItem(storageKey.unlocks);
        if (unlocks) {
            unlocks = JSON.parse(unlocks);
        }
        else {
            unlocks = [1];
            for (var i = 1, len = global.herosConfig.length; i < len; ++i) {
                unlocks.push(0);
            }
        }

        global.getUnlock = function (index) {
            return unlocks[index];
        };

        function setUnlock (index, value) {
            unlocks[index] = value;
            localStorage.setItem(storageKey.unlocks, JSON.stringify(unlocks));
        }

        global.unlock = function (index) {
            setUnlock(index, 1);
        };

        global.lock = function (index) {
            setUnlock(index, 0);
        };
    }

    function handleHerosConfig() {
        global.herosConfig = [
            {
                id: 0,
                name: 'boy',
                chName: '姜饼仔',
                color: '#f3a156',
                width: 76,
                height: 106,
                paddingRight: 6,
                scale: 0.6,
                actions: {
                    down: {fps: 6},
                    up: {fps: 10},
                    kick: {fps: 24},
                    walk: {fps: 28}
                },
                unlockType: 'free',
                cost: 0,
                desc: '',
                powerText: '我有我的勇气',
                power: {}
            },
            {
                id: 1,
                name: 'girl',
                chName: '姜饼妹',
                color: '#efbc58',
                width: 85,
                height: 112,
                paddingRight: 4,
                scale: 0.6,
                actions: {
                    down: {fps: 6},
                    up: {fps: 10},
                    kick: {fps: 24},
                    walk: {fps: 28}
                },
                unlockType: 'share',
                cost: 0,
                desc: '',
                powerText: '增加出现果子的几率',
                power: {
                    foodProba: 0.58
                }
            },
            {
                id: 2,
                name: 'cone',
                chName: '蛋筒夫人',
                color: '#f55e82',
                width: 109,
                height: 190,
                paddingRight: 15,
                scale: 0.5,
                actions: {
                    down: {fps: 5},
                    up: {fps: 15},
                    kick: {fps: 15},
                    walk: {fps: 15}
                },
                unlockType: 'food',
                cost: 50,
                desc: '',
                powerText: '冷却棒棒的延长速度',
                power: {
                    stickSpeed: 6.8,
                    stickTexture: 'stick-cold'
                }
            },
            {
                id: 3,
                name: 'baguette',
                chName: '法棍先生',
                color: '#ea7408',
                width: 101,
                height: 159,
                paddingRight: 10,
                scale: 0.5,
                actions: {
                    down: {fps: 6},
                    up: {fps: 10},
                    kick: {fps: 15},
                    walk: {fps: 15}
                },
                unlockType: 'food',
                cost: 150,
                desc: '',
                powerText: '不易出现很窄的柱子',
                power: {

                }
            },
            {
                id: 4,
                name: 'donut',
                chName: '甜甜圈',
                color: '#543a22',
                width: 90,
                height: 112,
                paddingRight: 10,
                scale: 0.5,
                actions: {
                    down: {fps: 6},
                    up: {fps: 10},
                    kick: {fps: 15},
                    walk: {fps: 15}
                },
                unlockType: 'food',
                cost: 250,
                desc: '',
                powerText: '自动翻越小间隙',
                power: {
                    
                }
            },
            {
                id: 5,
                name: 'zongzi',
                chName: '粽子糖',
                color: '#d8e480',
                width: 96,
                height: 86,
                paddingRight: 5,
                scale: 0.47,
                actions: {
                    down: {fps: 6},
                    up: {fps: 10},
                    kick: {fps: 15},
                    walk: {fps: 20}
                },
                unlockType: 'food',
                cost: 300,
                desc: '',
                powerText: '击中红心，双倍奖励',
                power: {
                    
                }
            },
            {
                id: 6,
                name: 'cupcake',
                chName: '杯糕小子',
                color: '#a0c8aa',
                width: 110,
                height: 137,
                paddingRight: 12,
                scale: 0.5,
                actions: {
                    down: {fps: 5},
                    up: {fps: 6},
                    kick: {fps: 15},
                    walk: {fps: 12}
                },
                unlockType: 'food',
                cost: 400,
                desc: '',
                powerText: '行走速度减慢',
                power: {
                    
                }
            }
        ];

        global.getHeroConfig = function () {
            return global.herosConfig[global.getSelected()];
        };
    }

    init();

    return global;

});
