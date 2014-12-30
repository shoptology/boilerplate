'use strict';

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
    res.render('home', {
        title: 'Home'
    });
};

exports.app = function(req, res) {
    res.render('app', {
        title: 'App',
        layout: 'layout-app'
    });
};