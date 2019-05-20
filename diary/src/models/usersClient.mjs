import request from 'superagent';
import url from 'url';
const URL = url.URL;

function reqURL(path) {
    const requrl = new URL(process.env.USER_SERVICE_URL);
    requrl.pathname = path;
    return requrl.toString();
}

export async function create(username, password, name, email) {
    var res = await request
        .post(reqURL('/user'))
        .send({
            username, password, name, email
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(process.env.USER_SERVICE_AUTH_USERNAME, process.env.USER_SERVICE_AUTH_PASSWORD);
    return res.body;
}

export async function find(username) {
    var res = await request
        .get(reqURL(`/user/${username}`))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(process.env.USER_SERVICE_AUTH_USERNAME, process.env.USER_SERVICE_AUTH_PASSWORD);
    return res.body;
}

export async function userPasswordCheck(username, password) {
    var res = await request
        .post(reqURL('/passwordCheck'))
        .send({ username, password })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(process.env.USER_SERVICE_AUTH_USERNAME, process.env.USER_SERVICE_AUTH_PASSWORD);
    return res.body;
}