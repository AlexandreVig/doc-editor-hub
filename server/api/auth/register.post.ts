import { defineEventHandler, readBody, createError } from 'h3';
import UserModel from '~/server/models/user';
import jwt from 'jsonwebtoken';
import { IUser, AuthPayload } from '~/server/types/user';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

export default defineEventHandler(async (event) => {
  const body: IUser = await readBody(event);
  const existingUser = await UserModel.findOne({ email: body.email });
  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'Email already in use' });
  }
  const user = await UserModel.create(body);
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
  const payload: AuthPayload = { token, user };
  return payload;
});
