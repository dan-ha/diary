import express from 'express';
import session from 'express-session';
import sessionFileStore from 'session-file-store';

import hbs from 'hbs';
import path from 'path';
import cookieParser from 'cookie-parser';

import { router as indexRouter } from './routes/index';
import { router as userRouter, initPassport } from './routes/users';
import { connectDb } from './utils/dbConnect';
import { loadEnvVariables } from './utils/envVariables';

// Environment variables
loadEnvVariables();

const app = express();

// MongoDb connection
connectDb();

// Passport session configuration
const FileStore = sessionFileStore(session);
export const sessionCookieName = 'diarycookie.sid';
const sessionStore = new FileStore({
  path: process.env.DIARY_SESSION_DIR ? process.env.DIARY_SESSION_DIR : "sessions"
});

app.use(session({
  store: sessionStore,
  secret: 'keyboard mouse',
  resave: true,
  saveUninitialized: true,
  name: sessionCookieName
}));
initPassport(app);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Public resources
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets/vendor/papercss', express.static(
  path.join(__dirname, '../node_modules', 'papercss', 'dist')));
app.use('/assets/vendor/moment', express.static(
  path.join(__dirname, '../node_modules', 'moment', 'min')));

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);

export default app;
