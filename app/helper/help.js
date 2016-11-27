/**
 * Created by YY on 2016/9/9.
 */
angular.module('helper', [])
    .factory('AppConstants', function () {
        var self = {};
        var host = '115.159.71.32:20161';
        if (-1 === location.host.indexOf('okecust')) {
            // Local host mode.
            //host = '127.0.0.1:20161';
        }
        var base = 'http://' + host + '/ecust-apis';
        self.URL_BASE = base;
        return self;
    });
