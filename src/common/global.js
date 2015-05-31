/**
 * @file 全局
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var storagePrefix = 'ginger-';

    var storageKey = {
        foodCount: storagePrefix + 'food-count',
        highest: storagePrefix + 'highest'
    };

    var foodCount;
    var highest;

    function initFoodCount(cb) {
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
    }

    function getFoodCount() {
        return foodCount;
    }

    function setFoodCount(count) {
        foodCount = count;
        var key = storageKey.foodCount;
        // TODO: server
        localStorage.setItem(key, count);
    }

    function initHighest(cb) {
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
    }

    function getHighest() {
        return highest;
    }

    function setHighest(score) {
        highest = score;
        var key = storageKey.highest;
        // TODO: server
        localStorage.setItem(key, score);
    }

    return {
        fontFamily: '"Helvetica Neue", Helvetica, STHeiTi, sans-serif',

        initFoodCount: initFoodCount,
        getFoodCount: getFoodCount,
        setFoodCount: setFoodCount,

        initHighest: initHighest,
        getHighest: getHighest,
        setHighest: setHighest
    };

});
