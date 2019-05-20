import restify from 'restify';
import errors from 'restify-errors';
import path from 'path';
import dotenv from 'dotenv';

import * as usersDAO from './model/usersDAO';
import { authenticateApiKey } from './utils/apiKeyAuthentication';

class App {

    constructor() {
        // Load environmanet variables
        // Workaround for lack of __dirname in ES6 modules
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        const envPath = `${__dirname}/../.env.${process.env.NODE_ENV}`;
        dotenv.config({ path: envPath });

        this.server = restify.createServer({
            name: "User-Auth-Service",
            version: "0.0.1"
        });

        // Database connection
        usersDAO.connectDB();

        this.server.use(restify.plugins.authorizationParser());
        this.server.use(authenticateApiKey);
        this.server.use(restify.plugins.queryParser());
        this.server.use(restify.plugins.bodyParser({
            mapParams: true
        }));

        this.server.post('/user', async (req, res, next) => {
            try {
                var result = await usersDAO.create(
                    req.params.username,
                    req.params.password,
                    req.params.name,
                    req.params.email,
                );
                res.json(201, result);
                return next();
            } catch (err) {
                console.log(err);
                if (err.name == 'SequelizeUniqueConstraintError') {
                    return next(new errors.ConflictError("Username already exists"));
                } else {
                    return next(new errors.InternalServerError("Internal Server Error"));
                }
            }
        });

        this.server.get('/user/:username', async (req, res, next) => {
            try {
                const user = await usersDAO.find(req.params.username);
                if (!user) {
                    return next(new errors.NotFoundError(`User: ${req.params.username} not found`));
                } else {
                    res.json(200, user);
                    return next();
                }
            } catch (err) {
                console.log(err);
                return next(new errors.InternalServerError("Internal Server Error"));
            }
        });

        // Check password
        this.server.post('/passwordCheck', async (req, res, next) => {
            try {
                const status = await usersDAO.userPasswordCheck(
                    req.params.username,
                    req.params.password);
                if (status) {
                    res.json(200, status);
                    return next();
                } else {
                    return next(new errors.NotFoundError(`User: ${req.params.username} not found`));
                }
            } catch (err) {
                console.log(err);
                return next(new errors.InternalServerError("Internal Server Error"));
            }
        });
    }
}

export default new App().server;