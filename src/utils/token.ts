import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateToken = (payload: any, secret: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign({ payload }, secret, { algorithm: 'HS256' }, (err, token) => {
      if (err) {
        reject(err.message);
      }
      resolve(token);
    });
  });
};

export const verifyToken = async (
  token: string,
  secret: any,
): Promise<string | jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, { algorithms: ['HS256'] }, (error, decoded) => {
      if (error) reject(error.message);
      resolve(decoded);
    });
  });
};
