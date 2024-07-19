import * as bcrypt from 'bcrypt';
import { generateToken, verifyToken } from './token';
import { USER_TOKEN_KEY } from './constants';
import { isEmail as isEmail_ } from 'class-validator';

export const encryptPassword = async (password: string) => {
  try {
    const saltOrRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  } catch (err) {
    return null;
  }
};

export const comparePassword = async (password: string, hash: string) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    return false;
  }
};

export const isEmpty = (data: string | any) => {
  if (data === undefined || data === null || data === '' || data.length === 0)
    return true;
  return false;
};

export const isEmail = (data: string | any) => {
  console.log(isEmail_(data));
  if (isEmail_(data)) return true;
  return false;
};

export const generateUserToken = async (payload: any) => {
  return await generateToken(payload, USER_TOKEN_KEY);
};

export const verifyUserToken = async (token: string) => {
  return await verifyToken(token, USER_TOKEN_KEY);
};
