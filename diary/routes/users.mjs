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
      res.redirect('/user/login');
    }
  } catch (e) {
    next(e);
  }
}

// TO avoid logged in user login again/register
function redirectHomeWhenAuthenticated(req, res, next) {
  try {
    if (req.user) {
      res.redirect('/');
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
}

// Login (get)
router.get('/login', redirectHomeWhenAuthenticated, function (req, res, next) {
  try {
    res.render('login', {
      title: "Login to Diary",
      user: req.user,
      message: getLoginMessage(req.query.message)
    });
  } catch (e) {
    next(e);
  }
});

// Login (post)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // SUCCESS: Go to home page
  failureRedirect: 'login?message=1' // FAILURE: Go to /user/login?error=1
})
);

// Register new User (get)
router.get('/register', (req, res, next) => {
  try {
    res.render('register', {
      title: "register",
      user: req.user
    })
  } catch (e) {
    next(e);
  }
});

// Register new User (post)
router.post('/register', redirectHomeWhenAuthenticated, async (req, res, next) => {
  try {
    var newAccount = await usersModel.create(
      req.body.username,
      req.body.password,
      "local",
      req.body.name,  // family name
      req.body.name,  // given name
      req.body.name,  // middle name
      req.body.email,
      undefined
    );
    if (newAccount) {
      res.redirect("login?message=0");
    }
  } catch (error) {
    res.render('register', {
      title: 'register',
      user: req.user,
      newUser: req.body,
      error: getRegisterErrorMessage(error)
    });
  }
});

router.get('/logout', function (req, res, next) {
  try {
    req.session.destroy();
    req.logout();
    res.clearCookie(sessionCookieName);
    res.redirect('/');
  } catch (e) {
    next(e);
  }
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      var check = await usersModel.userPasswordCheck(username, password);
      if (check.check) {
        done(null, { id: check.username, username: check.username });
      } else {
        done(null, false, check.message);
      }
    } catch (e) {
      done(e);
    }
  }
));

passport.serializeUser(function (user, done) {
  try {
    done(null, user.username);
  } catch (e) {
    done(e);
  }
});

passport.deserializeUser(async (username, done) => {
  try {
    var user = await usersModel.find(username);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

function getLoginMessage(messageCode) {
  switch (messageCode) {
    case '0': return { message: 'Successfully registered. Please login.', class: 'alert-success' };
    case '1': return { message: 'Incorrect username or password.', class: 'alert-danger' };
    default: return undefined;
  }
}

function getRegisterErrorMessage(err) {
  switch (err.status) {
    case 400: return 'Please fill all fields with valid values.';
    case 409: return 'Username already exists, choose different one.';
    default: return 'Server error, try again later.';
  }
}