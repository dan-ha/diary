import errors from 'restify-errors';
import isEmpty from 'lodash/isEmpty';

export function authenticateApiKey(req, res, next) {
    if (!isEmpty(req.authorization)) {
        if ((req.authorization.basic.username === process.env.AUTH_USERNAME)
         &&
          (req.authorization.basic.password === process.env.AUTH_PASSWORD)) {
            return next();
        }
    }
    return next(new errors.UnauthorizedError("Failed to authenticate"));
}