// Import all env vars from .env file
require('dotenv').config()

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const SERVICE_URL = process.env.SERVICE_URL;
const PORT = process.env.PORT;
const GROUPME_ACCESS_TOKEN = process.env.GROUPME_ACCESS_TOKEN;

module.exports = {
    MONGODB_CONNECTION_STRING: MONGODB_CONNECTION_STRING,
    SERVICE_URL: SERVICE_URL,
    PORT: PORT,
    GROUPME_ACCESS_TOKEN: GROUPME_ACCESS_TOKEN
}