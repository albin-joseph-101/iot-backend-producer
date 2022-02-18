import jwt from 'jsonwebtoken';
import path from 'path';
import bcrypt from 'bcryptjs'

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

export const generateAPIToken = async () => {

    const salt = bcrypt.genSaltSync(saltRounds);
    const token = bcrypt.hashSync(SECRET, salt);
    return token;
};

export const verifyAPIToken = (token) => {
    return bcrypt.compareSync(SECRET, token)
}

export const verifyToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, SECRET);
        return decoded;
    } catch (err) {
        return new Error(err);
    }
};

