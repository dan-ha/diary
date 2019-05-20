import dotenv from 'dotenv';
import path from 'path';

export function loadEnvVariables() {
    // Workaround for lack of __dirname in ES6 modules
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const envPath = `${__dirname}/../../.env.${process.env.NODE_ENV}`;
    dotenv.config({ path: envPath });
}