import path from 'path';
import util from 'util';
import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import * as usersModel from '../models/users-superagent';
import { sessionCookieName } from '../app';

export const router = express.Router();

import DBG from 'debug';
const debug = DBG('diary:router-users');
const error = DBG('diary:error-users');

export function initPassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());
}

export function ensureAuthenticated(req, res, next) {
  try {
    // req.user is set by Passport in the deserialize function 
    if (req.user) {
      next();
    }
    else {
      res.redirect('/users/login');
    }
  } catch (e) {
    next(e);
  }
}

// Login (get)
router.get('/login', function (req, res, next) {
  try {
    res.render('login', {
      title: "Login to Diary",
      user: req.user
    });
  } catch (e) {
    next(e);
  }
});

// Login (post)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // SUCCESS: Go to home page
  failureRedirect: 'login' // FAILURE: Go to /user/login
})
);

router.get('/logout', function(req, res, next) {
  try{
    req.session.destroy();
    req.logout();
    res.clearCookie(sessionCookieName);
    res.redirect('/');
  } catch(e) {
    next(e);
  }
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      var check = await usersModel.userPasswordCheck(username, password);
      if(check.check) {
        done(null, { id: check.username, username: check.username});
      } else {
        done(null, false, check.message);
      }
    } catch(e) {
      done(e);
    }
  }
));

passport.serializeUser(function(user, done){
  try {
    done(null, user.username);
  } catch(e) {
    done(e);
  }
});

passport.deserializeUser(async (username, done) => {
  try {
    var user = await usersModel.find(username);
    done(null, user);
  } catch(e) {
    done(e);
  }
});