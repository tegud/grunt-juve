(function () {
    'use strict';

    var _ = require('lodash');

    module.exports = function() {
        return {
            load: function(config, callback) {
                callback(_.extend({}, {
                    tests: []
                }, config));
            }
        };
    };
})();
