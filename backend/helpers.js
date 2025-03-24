import jwt from 'jsonwebtoken';

//helper function to verify the JWT
export function verifyJwt(token) {
    try{
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        return true;
    } catch (error){
        return false;
    }
}