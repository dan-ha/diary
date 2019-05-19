import Sequelize from "sequelize";
import bcrypt from 'bcrypt';
import jsyaml from 'js-yaml';
import fs from 'fs-extra';
import isEmpty from 'lodash/isEmpty';
import { User, initUser } from './user';

const BCRYPT_SALT = 10;

export function connectDB() {
    var sequelize;
    if (process.env.NODE_ENV == 'production') {
        sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);
    } else {
        const yamlText = fs.readFileSync(process.env.SEQUELIZE_CONFIG, 'utf-8');
        const params = jsyaml.safeLoad(yamlText, 'utf8');
        sequelize = new Sequelize(params.dbname, params.username, params.password, params.params);
    }
    initUser(sequelize);
    sequelize.sync();

    console.log('aaaaaaaaaaa');
    console.log(process.env.AUTH_USERNAME);
}

export async function create(username, password, name, email) {
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT);
    return User.create({
        username, password: passwordHash, name, email
    });
}

export async function find(username) {
    const user = await User.findOne({ where: { username: username } });
    const res = isEmpty(user) ? undefined : sanitizedUser(user);
    return res;
}

export async function userPasswordCheck(username, password) {
    const user = await User.findOne({ where: { username: username } });
    if (isEmpty(user)) {
        return undefined;
    } else {
        const valid = await bcrypt.compare(password, user.password);
        return { status: valid };
    }
}

export function sanitizedUser(user) {
    var res = {
        id: user.username,
        username: user.username,
        name: user.name,
        email: user.email
    }
    return res;
}