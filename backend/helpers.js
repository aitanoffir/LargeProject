import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export function verifyJwt(token) {
    try{
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        return true;
    } catch (error){
        return false;
    }
}