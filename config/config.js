require('dotenv').config();

module.exports = {
    port: process.env.PORT || 80,
    session_secret: process.env.SESSION_SECRET,
    node_env: process.env.NODE_ENV,
    salt_rounds: process.env.BCRYPT_SALT_ROUNDS
}

