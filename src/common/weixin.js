/**
 * @file 微信
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');

    function init(color) {
        var appId = 'wx06c09a44f6e68fe4';

        require('common/ajax').get({
            url: require('common/url').GET_SIGNATURE,
            data: {
                url: location.href.split('#')[0]
            },
            success: function (res) {
                res = JSON.parse(res);
                if (res.retcode) {
                    return;
                }
                wx.config({
                    debug: false,
                    appId: appId,
                    timestamp: res.timestamp,
                    nonceStr: 'yiluwan',
                    signature: res.token,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                    ]
                });
                updateShare();
            }
        });
    }

    function updateShare() {
        // var link = location.href.split('#')[0];
        var link = 'http://mp.weixin.qq.com/s?__biz=MzAwODMwMzA0Mw==&mid=206193292&idx=1&sn=2eb2c175488e2432921a3609af7ca185&scene=2&from=timeline&isappinstalled=0#rd';
        var imgUrl = 'http://farm.yiluwan.org/super-gingerbread/asset/img/icon-200.png';
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: global.getShareText(),
                link: link,
                imgUrl: imgUrl,
                success: function () {
                    if (!global.getShared()) {
                        global.setShared(1);
                        global.unlock(1); // TODO: 根据 unlockType 解锁
                    }
                }
            });
            wx.onMenuShareAppMessage({
                title: '超能姜饼人',
                desc: global.getShareText(),
                link: link,
                imgUrl: imgUrl
            });
        });
    }

    return {
        init: init,
        updateShare: updateShare
    };

});
