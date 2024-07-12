import { defineEventHandler, createError, H3Event, getRequestURL } from "h3";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";

const secret = process.env.JWT_SECRET || "your_jwt_secret";

const protected_routes = [
  "/api/auth/me",
  "/api/auth/update-password",
  "/api/documents"
]

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event).pathname;
  let finded = 0;
  for (const route of protected_routes) {
    if (url.startsWith(route)) {
      finded++;
    }
  }
  if (finded == 0) {
    return;
  }

  const token = getHeaders(event)["authorization"]?.split(" ")[1];
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    event.context.user = user;
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
});
