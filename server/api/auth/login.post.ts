import { defineEventHandler, readBody, createError } from 'h3';
import UserModel from '~/server/models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthPayload } from '~/server/types/user';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
  const payload: AuthPayload = { token, user };
  return payload;
});
