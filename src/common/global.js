/**
 * @file 全局
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    // TODO: big init

    var ajax = require('common/ajax');
    var url = require('common/url');
    var util = require('common/util');
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
        handleMode();

        handleHerosConfig();

        handleStorage();

        handleFont();

        handleFoodCount();

        handleHighest();
        handleSelected();
        handleUnlocks();

        handleNickname();
    }

    function handleMode() {
        var mode = 'dev';

        global.setMode = function (newMode) {
            mode = newMode;
        };

        global.getMode = function () {
            return mode;
        };
    }

    function handleFont() {
        global.fontFamily = '"Helvetica Neue", Helvetica, STHeiTi, sans-serif';
    }

    function handleStorage() {
        global.getStorage = function (keys) {
            var storage = {};
            keys.forEach(function (key) {
                storage[key] = localStorage.getItem(storageKey[key]);
            });
            return storage;
        };

        global.assignStorage = function (keys) {
            keys.forEach(function (key) {
                global['assign' + util.firstToUpperCase(key)]();
            });
        };

        global.initStorage = function (keys) {
            keys.forEach(function (key) {
                global['init' + util.firstToUpperCase(key)]();
            });
        };

        global.setStorage = function (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    global['set' + util.firstToUpperCase(key)](obj[key], false);
                }
            }
        };
    }

    function handleFoodCount () {
        var foodCount;

        global.initFoodCount = function () {
            foodCount = +localStorage.getItem(storageKey.foodCount);
            foodCount = foodCount ? +foodCount : 0;
        };

        global.getFoodCount = function () {
            return foodCount;
        };

        global.setFoodCount = function (count, remote) {
            if (count === foodCount) {
                return;
            }

            if (typeof remote === 'undefined') {
                remote = true;
            }

            remote && ajax.get({
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

        global.assignHighest = function () {
            highest = +localStorage.getItem(storageKey.highest);
        };

        global.initHighest = function () {
            global.setHighest(0);
        };

        global.getHighest = function () {
            return highest;
        };

        global.setHighest = function (score, remote) {
            highest = +score;
        
            if (typeof remote === 'undefined') {
                remote = true;
            }

            remote && serverData.save({
                highest: highest
            });

            localStorage.setItem(storageKey.highest, highest);
        };
    }

    // 被选英雄
    function handleSelected () {
        var selected;

        global.assignSelected = function () {
            selected = +localStorage.getItem(storageKey.selected);
        };

        global.initSelected = function () {
            global.setSelected(0);
        };
        
        global.getSelected = function () {
            return selected;
        };

        global.setSelected = function (index, remote) {
            selected = +index;

            if (typeof remote === 'undefined') {
                remote = true;
            }

            remote && serverData.save({
                selected: selected
            });

            localStorage.setItem(storageKey.selected, selected);
        };
    }

    // 解锁列
    function handleUnlocks () {
        var unlocks;

        function setUnlock(index, value) {
            unlocks[index] = value;
            saveUnlocks();
        }

        function saveUnlocks(remote) {
            var unlocksStr = JSON.stringify(unlocks);

            if (typeof remote === 'undefined') {
                remote = true;
            }
            remote && serverData.save({
                unlocks: unlocksStr
            });

            localStorage.setItem(storageKey.unlocks, unlocksStr);
        }

        global.assignUnlocks = function () {
            unlocks = JSON.parse(localStorage.getItem(storageKey.unlocks));
        };

        global.initUnlocks = function () {
            unlocks = [1];
            for (var i = 1, len = global.herosConfig.length; i < len; ++i) {
                unlocks.push(0);
            }
            saveUnlocks(unlocks);
        };

        global.getUnlock = function (index) {
            return unlocks[index];
        };

        global.setUnlocks = function (newUnlocks, remote) {
            unlocks = util.isArray(newUnlocks) ? unlocks : JSON.parse(newUnlocks);
            saveUnlocks(remote);
        };

        global.unlock = function (index) {
            setUnlock(index, 1);
        };

        global.lock = function (index) {
            setUnlock(index, 0);
        };
    }

    function handleNickname() {
        var nickname;

        global.getNickname = function () {
            return nickname;
        };

        global.setNickname = function (name) {
            nickname = name;
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
                desc: '从烤箱中逃离出来，向着\n未知前方探索的姜饼仔',
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
                desc: '哥哥出去闯了，有点放心\n不下呢，我也要加油！',
                powerText: '增加出现果果的几率',
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
                desc: '发型贵气的蛋筒夫人看上\n去有些高冷，其实她的心\n很容易融化哟',
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
                    walk: {fps: 12}
                },
                unlockType: 'food',
                cost: 150,
                desc: '从香榭丽舍大街某小卖部\n走出的法式长棍，也在力\n争成为世界第一棍',
                powerText: '不会出现很窄的柱子',
                power: {
                    stageMinWidth: 30
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
                desc: '永远一副惊讶表情的甜甜\n圈，说不定会给这个世界\n带来一些惊喜',
                powerText: '自动翻越小间隙',
                power: {
                    stickExtraLength: 12
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
                desc: '来自东方的神秘角色，虽\n然被称为糖，但是其内心\n是甜是咸还难下定论哦',
                powerText: '命中糖浆，双倍奖励',
                power: {
                    spotMultiple: 2
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
                desc: '为了奔跑不息传递爱与勇\n气，而锻炼出了蓬松味美\n的肌肉',
                powerText: '扩大糖浆的范围',
                power: {
                    spotWidth: 12
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
