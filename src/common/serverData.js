/**
 * @file 服务器数据
 * @author yumao [zhangyu38@baidu.com]
 */

define(function () {

    var ajax = require('common/ajax');
    var url = require('common/url');

    function load(key, success, failure) {
        ajax.get({
            url: url.LOAD_DATA,
            data: {
                key: key
            },
            success: success,
            failure: failure
        });
    }

    function save(key, value, success, failure) {
        var data = {};
        data[key] = value;
        ajax.post({
            url: url.SAVE_DATA,
            data: data,
            success: success,
            failure: failure
        });
    }

    return {
        load: load,
        save: save
    };

});
