import errors from 'restify-errors';
import isEmpty from 'lodash/isEmpty';

let apiKeys = [{
    username: 'them',
    password: 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF'
}];

export function authenticateApiKey(req, res, next) {
    if (!isEmpty(req.authorization)) {
        if (apiKeys.some((auth) => {
            return req.authorization.basic.username === auth.username
                && req.authorization.basic.password === auth.password
        })) {
            return next();
        }
    }
    return next(new errors.UnauthorizedError("Failed to authenticate"));
}