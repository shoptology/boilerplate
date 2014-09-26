'use strict';

module.exports = function(app, passport, passportConf){

    var homeController = require('../controllers/home');
    var userController = require('../controllers/user');
    var apiController = require('../controllers/api_examples');
    var contactController = require('../controllers/contact');

    app.get('/', homeController.index);
    app.get('/login', userController.getLogin);
    app.post('/login', userController.postLogin);
    app.get('/logout', userController.logout);
    app.get('/forgot', userController.getForgot);
    app.post('/forgot', userController.postForgot);
    app.get('/reset/:token', userController.getReset);
    app.post('/reset/:token', userController.postReset);
    app.get('/signup', userController.getSignup);
    app.post('/signup', userController.postSignup);
    app.get('/contact', contactController.getContact);
    app.post('/contact', contactController.postContact);
    app.get('/account', passportConf.isAuthenticated, userController.getAccount);
    app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
    app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
    app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
    app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

    /**
     * API examples routes.
     */

    app.get('/api', apiController.getApi);
    app.get('/api/lastfm', apiController.getLastfm);
    app.get('/api/nyt', apiController.getNewYorkTimes);
    app.get('/api/aviary', apiController.getAviary);
    app.get('/api/steam', apiController.getSteam);
    app.get('/api/stripe', apiController.getStripe);
    app.post('/api/stripe', apiController.postStripe);
    app.get('/api/scraping', apiController.getScraping);
    app.get('/api/twilio', apiController.getTwilio);
    app.post('/api/twilio', apiController.postTwilio);
    app.get('/api/clockwork', apiController.getClockwork);
    app.post('/api/clockwork', apiController.postClockwork);
    app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
    app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
    app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
    app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
    app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
    app.post('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postTwitter);
    app.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
    app.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
    app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
    app.get('/api/instagram', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getInstagram);
    app.get('/api/yahoo', apiController.getYahoo);

    /**
     * OAuth sign-in routes.
     */

    app.get('/auth/instagram', passport.authenticate('instagram'));
    app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
      res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
      res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
      res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
      res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
      res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
      res.redirect(req.session.returnTo || '/');
    });

    /**
     * OAuth authorization routes for API examples.
     */

    app.get('/auth/foursquare', passport.authorize('foursquare'));
    app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
      res.redirect('/api/foursquare');
    });
    app.get('/auth/tumblr', passport.authorize('tumblr'));
    app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
      res.redirect('/api/tumblr');
    });
    app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
    app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
      res.redirect('/api/venmo');
    });

};
