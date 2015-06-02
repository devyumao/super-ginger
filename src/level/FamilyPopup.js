/**
 * @file 英雄家族 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var util = require('common/util');
    var Popup = require('common/Popup');

    var FamilyPopup = function (game, options) {
        Popup.call(this, game, options);
    };
    util.inherits(FamilyPopup, Popup);

    // FamilyPopup.prototype._init = function () {
        
    // };

    return FamilyPopup;

});
