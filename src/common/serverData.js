/**
 * @file 服务器数据
 * @author yumao [zhangyu38@baidu.com]
 */

define(function () {

    var ajax = require('common/ajax');
    var url = require('common/url');

    function load(keys, success, failure) {
        ajax.get({
            url: url.LOAD_DATA,
            data: {
                key: keys.join(',')
            },
            success: success,
            failure: failure
        });
    }

    function save(data, success, failure) {
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
