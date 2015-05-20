/**
 * @file AJAX
 * @author yumao [zhangyu38@baidu.com]
 * @create 2015-01-26
 */

define(function () {

    function toQuery(data) {
        var query = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return query.join('&');
    }

    function post(settings) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    settings.success && settings.success(xhr.responseText, xhr);
                }
                else {
                    settings.failure && settings.failure(xhr.status, xhr);
                }
            }
        };
        xhr.open('POST', settings.url ? settings.url : '');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(this.toQuery(settings.data ? settings.data : {}));
    }

    function get(settings) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    settings.success && settings.success(xhr.responseText, xhr);
                }
                else {
                    settings.failure && settings.failure(xhr.status, xhr);
                }
            }
        };
        var data = settings.data || {};
        var url = settings.url || '';
        url += url.indexOf('?') === -1 ? '?' + this.toQuery(data) : '&' + this.toQuery(data);
        xhr.open('GET', url);
        xhr.send();
    }

    return {
        toQuery: toQuery,
        post: post,
        get: get
    };

});
