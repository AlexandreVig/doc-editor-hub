import { d as defineEventHandler, r as readBody, U as UserModel, c as createError } from '../../../runtime.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'mongoose';
import 'node:fs';
import 'node:url';

const secret = process.env.JWT_SECRET || "your_jwt_secret";
const login_post = defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  const user = await UserModel.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email or password" });
  }
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
  const payload = { token, user };
  return payload;
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
