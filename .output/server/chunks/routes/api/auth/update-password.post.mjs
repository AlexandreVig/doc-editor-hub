import { d as defineEventHandler, r as readBody, U as UserModel, c as createError } from '../../../runtime.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'mongoose';
import 'node:fs';
import 'node:url';

const secret = process.env.JWT_SECRET || "your_jwt_secret";
const updatePassword_post = defineEventHandler(async (event) => {
  const { currentPassword, password } = await readBody(event);
  const userId = event.context.user._id;
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createError({
      statusCode: 404,
      statusText: "User not found"
    });
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw createError({
      statusCode: 400,
      statusText: "Current password is incorrect"
    });
  }
  if (password.length < 6) {
    return {
      status: 400,
      body: { message: "New password must be at least 6 characters long" }
    };
  }
  user.password = password;
  await user.save();
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
  const payload = { token, user };
  return payload;
});

export { updatePassword_post as default };
//# sourceMappingURL=update-password.post.mjs.map
