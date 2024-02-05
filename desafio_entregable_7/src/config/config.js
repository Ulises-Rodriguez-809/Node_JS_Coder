import dotenv from 'dotenv'

dotenv.config();


const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const APP_ID = process.env.APP_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;
const COOKIE_WORD = process.env.COOKIE_WORD;
const JWT_SECRET_WORD = process.env.JWT_SECRET_WORD;


export const options = {
    PORT,
    MONGO_URL,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    APP_ID,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    COOKIE_WORD,
    JWT_SECRET_WORD
}