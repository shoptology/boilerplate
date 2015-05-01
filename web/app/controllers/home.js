'use strict';

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
    res.render('single-page-app/app', {
        title: 'App',
        layout: 'layout-spa'
    });
};

exports.app = function(req, res) {

};
