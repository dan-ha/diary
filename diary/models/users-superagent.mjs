import request from 'superagent';
import util from 'util';
import url from 'url';
const URL = url.URL;
import DBG from 'debug';
const debug = DBG('diary:users-superagent');
const error = DBG('diary:error-superagent');

function reqURL(path) {
    const requrl = new URL(process.env.USER_SERVICE_URL);
    requrl.pathname = path;
    return requrl.toString();
}

export async function create(username, password, provider, familyName, givenName, middleName, emails, photos) {
    var res = await request
        .post(reqURL('/create-user'))
        .send({
            username, password, provider, familyName, middleName, givenName, emails, photos
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
    return res.body;
}

export async function update(username, password, provider, familyName, middleName, givenName, emails, photos) {
    var res = await request
        .post(reqURL(`/update-user/${username}`))
        .send({
            username, password, provider, familyName, givenName, middleName, emails, photos
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
    return res.body;
}

export async function find(username) {
    var res = await request
        .get(reqURL(`/find/${username}`))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
    return res.body;
}

export async function userPasswordCheck(username, password) {
    var res = await request
        .post(reqURL('passwordCheck'))
        .send({ username, password })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
    return res.body;
}

export async function findOrCreate(profile) {
    var res = await request
        .post(reqURL('/find-or-create'))
        .send({
            username: profile.id,
            password: profile.password,
            familyName: profile.familyName,
            givenName: profile.givenName,
            middleName: profile.middleName,
            emails: profile.emails,
            photos: profile.photos
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
    return res.body;
}

export async function listUsers(){
    var res = await request
        .get(reqURL('/list'))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
    return res.body;
}