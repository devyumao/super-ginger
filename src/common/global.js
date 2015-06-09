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
        selected: storagePrefix + 'selected'
    };

    var global = {};

    global.fontFamily = '"Helvetica Neue", Helvetica, STHeiTi, sans-serif';


    var basePath = '';

    global.setBasePath = function (path) {
        basePath = path;
    };

    global.getBasePath = function () {
        return basePath;
    };


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


    var selected = localStorage.getItem(storageKey.selected);
    if (selected === null) {
        selected = 0;
    }
    selected = selected === null ? 0 : +selected;

    global.getSelected = function () {
        return selected;
    };

    global.setSelected = function (index) {
        localStorage.setItem(storageKey.selected, index);
    };

    global.baseActions = ['down', 'up', 'kick', 'walk'];

    global.herosConfig = [
        {
            id: 0,
            name: 'boy',
            chName: '姜饼仔',
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
            unlocked: true,
            unlockType: 'free',
            cost: 0
        },
        {
            id: 1,
            name: 'girl',
            chName: '姜饼妹',
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
            unlocked: false,
            unlockType: 'share',
            cost: 0
        },
        {
            id: 2,
            name: 'cone',
            chName: '蛋筒夫人',
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
            unlocked: false,
            unlockType: 'food',
            cost: 50
        },
        {
            id: 3,
            name: 'baguette',
            chName: '法棍先生',
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
            unlocked: false,
            unlockType: 'food',
            cost: 150
        },
        {
            id: 4,
            name: 'donut',
            chName: '甜甜圈',
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
            unlocked: false,
            unlockType: 'food',
            cost: 250
        },
        {
            id: 5,
            name: 'zongzi',
            chName: '粽子糖',
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
            unlocked: false,
            unlockType: 'food',
            cost: 300
        },
        {
            id: 6,
            name: 'cupcake',
            chName: '杯糕小子',
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
            unlocked: false,
            unlockType: 'food',
            cost: 400
        }
    ];

    return global;

});
