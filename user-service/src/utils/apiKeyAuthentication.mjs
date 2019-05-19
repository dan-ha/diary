import errors from 'restify-errors';
import isEmpty from 'lodash/isEmpty';

const apiUsername = process.env.AUTH_USERNAME;
const apiPassword = process.env.AUTH_PASSWORD;

export function authenticateApiKey(req, res, next) {
    if (!isEmpty(req.authorization)) {
        if ((req.authorization.basic.username === auth.username) && (req.authorization.basic.password === auth.password)) {
            return next();
        }
    }
    return next(new errors.UnauthorizedError("Failed to authenticate"));
}