import { d as defineEventHandler, r as readBody, U as UserModel, c as createError } from '../../../runtime.mjs';
import jwt from 'jsonwebtoken';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'mongoose';
import 'node:fs';
import 'node:url';
import 'bcrypt';

const secret = process.env.JWT_SECRET || "your_jwt_secret";
const register_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const existingUser = await UserModel.findOne({ email: body.email });
  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: "Email already in use" });
  }
  const user = await UserModel.create(body);
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
  const payload = { token, user };
  return payload;
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
