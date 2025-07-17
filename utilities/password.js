const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, saltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword,
};
