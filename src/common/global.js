/**
 * @file 全局
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var serverData = require('common/serverData');

    var basePath = '';

    var storagePrefix = 'ginger-';
    var storageKey = {
        foodCount: storagePrefix + 'food-count',
        highest: storagePrefix + 'highest'
    };

    var foodCount;
    var highest;

    var global = {};

    global.fontFamily = '"Helvetica Neue", Helvetica, STHeiTi, sans-serif';

    global.setBasePath = function (path) {
        basePath = path;
    };

    global.getBasePath = function () {
        return basePath;
    };

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
        foodCount = count;
        var key = storageKey.foodCount;
        // TODO: server
        localStorage.setItem(key, count);
    };

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

    return global;

});
