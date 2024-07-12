import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '~/server/models/user';
import { AuthPayload } from '~/server/types/user';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

export default defineEventHandler(async (event) => {
  const { currentPassword, password } = await readBody(event);
  const userId = event.context.user._id;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw createError({
      statusCode: 404,
      statusText: 'User not found',
    });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw createError({
      statusCode: 400,
      statusText: 'Current password is incorrect',
    });
  }

  if (password.length < 6) {
    return {
      status: 400,
      body: { message: 'New password must be at least 6 characters long' },
    };
  }

  // Update password in database)
  user.password = password;
  await user.save();

  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
  const payload: AuthPayload = { token, user };
  return payload;
});
